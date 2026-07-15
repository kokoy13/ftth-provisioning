const { Client } = require("ssh2");
const { RouterOSAPI } = require("node-routeros");
const { Telnet } = require("telnet-client");
const Provisioning = require("../models/Provisioning");
const Credential = require("../models/Credential");
const AuditLog = require("../models/AuditLog");
const { FSM_STATES, LOG_LEVELS } = require("../utils/constants");

const ProvisioningService = {
  /**
   * List provisioning records with filters and pagination.
   */
  async list({ search, status, page, limit, offset }) {
    const { data, total } = await Provisioning.findAll({ search, status, limit, offset });
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  /**
   * Create a new provisioning record and execute the real provisioning flow:
   * 1. MikroTik → Create PPPoE Secret
   * 2. OLT → Configure ONU
   * 3. Telegram → Send notification
   */
  async create(payload, actor) {
    const record = await Provisioning.create(payload);

    await AuditLog.create({
      level: LOG_LEVELS.INFO,
      message: `Provisioning created for "${payload.customerName}" (ID: ${record.id})`,
      actor,
    }).catch(() => {});

    // Execute provisioning asynchronously
    this._executeProvisioning(record.id, payload, actor).catch((err) => {
      console.error(`[PROVISIONING ERROR ID:${record.id}]`, err.message);
    });

    return { id: record.id, status: FSM_STATES.PENDING, message: "Provisioning queued." };
  },

  /**
   * Internal: execute the full provisioning flow.
   */
  async _executeProvisioning(id, payload, actor) {
    console.log(`[PROVISIONING] Starting ID:${id} for "${payload.customerUsername}"`);
    await Provisioning.updateStatus(id, FSM_STATES.PROVISIONING, null);

    try {
      // ── Step 1: MikroTik ───────────────────────────────────────────
      await Provisioning.updateStep(id, "🔌 Connecting to MikroTik...");
      const mikrotikCred = await Credential.findByType("mikrotik");
      if (!mikrotikCred || !mikrotikCred.host) {
        throw new Error("MikroTik credentials not configured.");
      }

      const profileMap = {
        "10Mbps": "default",
        "20Mbps": "default",
        "50Mbps": "default",
        "100Mbps": "default",
      };
      const mtProfile = profileMap[payload.profile] || "default";

      await Provisioning.updateStep(id, "📡 Creating PPPoE secret on MikroTik...");
      const sshCommand = `/ppp secret add name="${payload.customerUsername}" password="${payload.pppoePassword}" service=pppoe profile="${mtProfile}"`;
      await this._execSshCommand(mikrotikCred, sshCommand);

      await AuditLog.create({
        level: LOG_LEVELS.SUCCESS,
        message: `PPPoE secret created for "${payload.customerUsername}" on MikroTik`,
        actor,
      }).catch(() => {});

      // ── Step 2: OLT ─────────────────────────────────────────────────
      const oltCred = await Credential.findByType("olt");
      if (oltCred && oltCred.host) {
        try {
          await Provisioning.updateStep(id, "🔗 Connecting to OLT...");
          const telnet = new Telnet();
          await telnet.connect({
            host: oltCred.host, port: oltCred.port || 23,
            username: oltCred.username || "", password: oltCred.password || "",
            shellPrompt: /[#>]\s*$/, loginPrompt: /(?:login|username|user)\s*[:>]/i,
            passwordPrompt: /(?:password|pass)\s*[:>]/i, timeout: 5000,
          });

          const template = this._oltTemplate(payload, id);
          for (const cmd of template) {
            await Provisioning.updateStep(id, `⚙️ ${cmd}`);
            await telnet.exec(cmd);
          }
          telnet.end();

          await AuditLog.create({
            level: LOG_LEVELS.SUCCESS,
            message: `ONU configured on OLT for "${payload.customerName}"`,
            actor,
          }).catch(() => {});
        } catch (oltErr) {
          console.error(`[OLT ERROR ID:${id}]`, oltErr.message);
        }
      }

      // ── Step 3: Telegram ────────────────────────────────────────────
      await Provisioning.updateStep(id, "📨 Sending Telegram notification...");
      await this._sendTelegramNotification(payload, id).catch(() => {});

      // ── Done ────────────────────────────────────────────────────────
      await Provisioning.updateStep(id, "✅ Completed");
      await Provisioning.updateStatus(id, FSM_STATES.ACTIVE, null);

      await AuditLog.create({
        level: LOG_LEVELS.SUCCESS,
        message: `Provisioning completed for "${payload.customerName}" (ID: ${id})`,
        actor,
      }).catch(() => {});

    } catch (err) {
      await Provisioning.updateStep(id, `❌ ${err.message}`);
      await Provisioning.updateStatus(id, FSM_STATES.FAILED, err.message);

      await AuditLog.create({
        level: LOG_LEVELS.ERROR,
        message: `Provisioning failed for "${payload.customerName}" (ID: ${id}): ${err.message}`,
        actor,
      }).catch(() => {});

      // Send failure notification
      await this._sendTelegramNotification(payload, id, err.message).catch(() => {});
    }
  },

  /**
   * Execute a RouterOS command on MikroTik via SSH.
   */
  _execSshCommand(cred, command) {
    return new Promise((resolve, reject) => {
      const client = new Client();
      let output = "";
      let resolved = false;

      client.on("ready", () => {
        client.exec(command, (err, stream) => {
          if (err) {
            client.end();
            return reject(err);
          }
          stream.on("data", (data) => { output += data.toString(); });
          stream.stderr.on("data", (data) => { output += "[ERR] " + data.toString(); });
          stream.on("close", () => {
            client.end();
            if (!resolved) { resolved = true; resolve(output.trim()); }
          });
        });
      });

      client.on("error", (err) => {
        if (!resolved) { resolved = true; reject(err); }
      });

      client.connect({
        host: cred.host,
        port: 22,
        username: cred.username,
        password: cred.password || "",
        readyTimeout: 15000,
      });
    });
  },

  /**
   * Generate OLT configuration commands from template.
   * Parameters marked with { } will be replaced with actual values.
   */
  _oltTemplate(payload, id) {
    // Speed mapping berdasarkan profile
    const speedMap = {
      "10Mbps":  { up: 5,   down: 10  },
      "20Mbps":  { up: 10,  down: 20  },
      "50Mbps":  { up: 25,  down: 50  },
      "100Mbps": { up: 50,  down: 100 },
    };
    const speed = speedMap[payload.profile] || { up: 10, down: 20 };

    // Bersihkan PORT_OLT: hapus prefix "olt-", "olt_", atau suffix ":N"
    const cleanPort = (payload.oltPort || "")
      .replace(/^olt[-_]/i, "")
      .replace(/:\d+$/, "")
      .trim();

    const onuNumber = payload.onuNumber || id;
    const vars = {
      PORT_OLT: cleanPort || payload.oltPort,
      "no onu": onuNumber,
      "serial number modem": payload.serialNumber || "ZTEG00000000",
      "nama pelanggan": payload.customerName,
      deskripsi: `FTTH - ${payload.customerName}`,
      upload: speed.up,
      download: speed.down,
      "username pppoe": payload.customerUsername,
      "password pppoe": payload.pppoePassword,
    };

    const raw = [
      "conf t",
      "int gpon-olt_{PORT_OLT}",
      "onu {no onu} type ZTEG-F609 sn {serial number modem}",
      "exit",
      "",
      "int gpon-onu_{PORT_OLT}:{no onu}",
      "name {nama pelanggan}",
      "description {deskripsi}",
      "tcont 1 name INET-HOME profile UP-{upload}M",
      "gemport 1 name INET-FAMILY tcont 1",
      "gemport 1 traffic-limit downstream DOWN-{download}M",
      "service-port 1 vport 1 user-vlan 1001 vlan 1001",
      "service-port 1 description INET-FAMILY",
      "port-identification format DSL-FORUM-PON vport 1",
      "pppoe-intermediate-agent enable vport 1",
      "exit",
      "",
      "pon-onu-mng gpon-onu_{PORT_OLT}:{no onu}",
      "service FAMILY-TEST gemport 1 vlan 1001",
      "vlan port eth_0/1 mode tag vlan 1001",
      "dhcp-ip ethuni eth_0/1 from-internet",
      "wan-ip 1 mode pppoe username {username pppoe} password {password pppoe} vlan-profile wan1001 host 1",
      "wan 1 service internet host 1",
      "exit",
      "end",
    ];

    // Replace all {params} with actual values
    return raw
      .filter((line) => line.trim() !== "")
      .map((line) => {
        let result = line;
        for (const [key, val] of Object.entries(vars)) {
          result = result.replaceAll(`{${key}}`, val);
        }
        return result;
      });
  },

  /**
   * Send Telegram notification for provisioning result.
   */
  async _sendTelegramNotification(payload, id, errorMsg = null) {
    const telegramCred = await Credential.findByType("telegram");
    console.log(`[TELEGRAM] Credentials:`, telegramCred ? `bot_token=${telegramCred.bot_token ? "✓" : "✗"} chat_id=${telegramCred.chat_id ? "✓" : "✗"}` : "NOT FOUND");
    if (!telegramCred || !telegramCred.bot_token || !telegramCred.chat_id) {
      console.log(`[TELEGRAM] Skipped — missing bot_token or chat_id`);
      return;
    }

    const https = require("https");
    const statusIcon = errorMsg ? "❌" : "✅";
    const statusLabel = errorMsg ? "FAILED" : "SUCCESS";
    const errorLine = errorMsg ? `\nError: ${errorMsg}` : "";

    const onuNo = payload.onuNumber || id;
    const text = `<b>${statusIcon} FTTH Provisioning ${statusLabel}</b>
━━━━━━━━━━━━━━━━━━━
ID: ${id}
Customer: ${payload.customerName || "-"}
PPPoE: ${payload.customerUsername || "-"}
Pass: ${payload.pppoePassword || "-"}
Profile: ${payload.profile || "-"}
OLT Port: ${payload.oltPort || "-"}
ONU No: ${onuNo}
Serial: ${payload.serialNumber || "-"}
Time: ${new Date().toISOString().slice(0, 19).replace("T", " ")}${errorLine}`;

    console.log(`[TELEGRAM] Sending:\n${text}`);

    const data = JSON.stringify({
      chat_id: telegramCred.chat_id,
      text,
      parse_mode: "HTML",
    });

    return new Promise((resolve, reject) => {
      const req = https.request(
        {
          hostname: "api.telegram.org",
          path: `/bot${telegramCred.bot_token}/sendMessage`,
          method: "POST",
          headers: { "Content-Type": "application/json" },
          timeout: 10000,
        },
        (res) => {
          let body = "";
          res.on("data", (c) => (body += c));
          res.on("end", () => {
            console.log(`[TELEGRAM] Response status ${res.statusCode}:`, body.slice(0, 200));
            resolve(body);
          });
        }
      );
      req.on("error", (err) => {
        console.error(`[TELEGRAM] Request failed:`, err.message);
        reject(err);
      });
      req.write(data);
      req.end();
    });
  },

  /**
   * Delete a provisioning record.
   */
  async delete(id, actor) {
    const record = await Provisioning.findById(id);
    if (!record) {
      throw Object.assign(new Error("Provisioning record not found."), { statusCode: 404 });
    }

    const deleted = await Provisioning.delete(id);
    if (!deleted) {
      throw Object.assign(new Error("Failed to delete record."), { statusCode: 500 });
    }

    await AuditLog.create({
      level: LOG_LEVELS.WARNING,
      message: `Provisioning deleted: "${record.customerName}" (ID: ${id})`,
      actor,
    }).catch(() => {});

    return { success: true };
  },

  /**
   * Get provisioning progress status.
   */
  async progress(id) {
    const record = await Provisioning.findById(id);
    if (!record) {
      throw Object.assign(new Error("Provisioning record not found."), { statusCode: 404 });
    }
    return {
      id: record.id,
      status: record.status,
      step: record.provisioningStep || "Queued",
      errorMessage: record.errorMessage,
    };
  },

  /**
   * Retry provisioning for a failed record.
   */
  async retry(id, actor) {
    const record = await Provisioning.findById(id);

    if (!record) {
      throw Object.assign(new Error("Provisioning record not found."), { statusCode: 404 });
    }

    if (record.status !== FSM_STATES.FAILED) {
      throw Object.assign(new Error("Only FAILED records can be retried."), { statusCode: 400 });
    }

    await Provisioning.updateStatus(id, FSM_STATES.PROVISIONING, null);

    await AuditLog.create({
      level: LOG_LEVELS.INFO,
      message: `Provisioning retry initiated for "${record.customerName}" (ID: ${id})`,
      actor,
    }).catch(() => {});

    // Re-execute with the stored payload
    const payload = {
      customerName: record.customerName,
      customerUsername: record.customerUsername,
      pppoePassword: record.pppoePassword,
      oltPort: record.oltPort,
      serialNumber: record.serialNumber,
      profile: record.profile,
      onuNumber: record.onuNumber,
    };

    this._executeProvisioning(id, payload, actor).catch((err) => {
      console.error(`[RETRY ERROR ID:${id}]`, err.message);
    });

    return { id, status: FSM_STATES.PROVISIONING, message: "Provisioning retry started." };
  },
};

module.exports = ProvisioningService;
