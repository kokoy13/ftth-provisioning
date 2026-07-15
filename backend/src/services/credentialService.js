const https = require("https");
const { Telnet } = require("telnet-client");
const { RouterOSAPI } = require("node-routeros");
const Credential = require("../models/Credential");
const AuditLog = require("../models/AuditLog");
const { LOG_LEVELS } = require("../utils/constants");

const CredentialService = {
  /**
   * Get all credentials (without passwords).
   */
  async getAll() {
    return await Credential.getGrouped();
  },

  /**
   * Update credentials for all device types.
   */
  async updateAll({ mikrotik, olt, telegram }, actor) {
    if (mikrotik) {
      await Credential.upsert("mikrotik", {
        host: mikrotik.host,
        username: mikrotik.username,
        password: mikrotik.password,
        port: mikrotik.port,
      });
    }

    if (olt) {
      await Credential.upsert("olt", {
        host: olt.host,
        username: olt.username,
        password: olt.password,
        port: olt.port,
      });
    }

    if (telegram) {
      await Credential.upsert("telegram", {
        bot_token: telegram.botToken,
        chat_id: telegram.chatId,
      });
    }

    await AuditLog.create({
      level: LOG_LEVELS.INFO,
      message: "Device credentials updated.",
      actor,
    }).catch(() => {});

    return { message: "Credentials saved successfully." };
  },

  /**
   * Update credentials for a single device type.
   */
  async updateOne(type, data, actor) {
    if (!type) {
      throw Object.assign(new Error("Device type is required."), { statusCode: 400 });
    }

    if (type === "mikrotik" || type === "olt") {
      await Credential.upsert(type, {
        host: data.host,
        username: data.username,
        password: data.password,
        port: data.port,
      });
    } else if (type === "telegram") {
      await Credential.upsert("telegram", {
        bot_token: data.botToken,
        chat_id: data.chatId,
      });
    } else {
      throw Object.assign(new Error(`Unknown device type "${type}".`), { statusCode: 400 });
    }

    await AuditLog.create({
      level: LOG_LEVELS.INFO,
      message: `"${type}" credentials updated.`,
      actor,
    }).catch(() => {});

    return { message: `"${type}" credentials saved successfully.` };
  },

  /**
   * Test connection to a specific device type.
   * In production, this would actually connect to the device.
   */
  async testConnection(type) {
    const cred = await Credential.findByType(type);

    if (!cred) {
      throw Object.assign(new Error(`No credentials configured for "${type}".`), { statusCode: 404 });
    }

    if (type === "telegram") {
      return await this._testTelegram(cred);
    }

    if (type === "mikrotik") {
      return await this._testMikrotik(cred);
    }

    if (type === "olt") {
      return await this._testOlt(cred);
    }

    throw Object.assign(new Error(`Unknown device type "${type}".`), { statusCode: 400 });
  },

  /**
   * Test Telegram Bot connection by calling the actual Bot API.
   */
  async _testTelegram(cred) {
    const botToken = cred.bot_token;
    const chatId = cred.chat_id;

    if (!botToken) {
      throw Object.assign(new Error("Telegram Bot Token is not configured."), { statusCode: 400 });
    }

    // Step 1: Validate bot token via getMe
    await this._telegramRequest(botToken, "getMe");

    // Step 2: If chatId exists, send a test message
    if (chatId) {
      try {
        const text = "✅ *Test Connection Successful* — FTTH Provisioning System";
        await this._telegramRequest(botToken, "sendMessage", {
          chat_id: chatId,
          text,
          parse_mode: "Markdown",
        });
        return { message: "Telegram Bot connected and test message sent successfully." };
      } catch (err) {
        throw Object.assign(
          new Error(
            `Bot token is valid, but Chat ID "${chatId}" not found. ` +
            "Make sure the bot has been added to the chat/group and the Chat ID is correct."
          ),
          { statusCode: 400 }
        );
      }
    }

    return { message: "Telegram Bot token is valid (no test message sent — Chat ID not configured)." };
  },

  /**
   * Helper to call Telegram Bot API.
   */
  _telegramRequest(botToken, method, body = null) {
    return new Promise((resolve, reject) => {
      const url = new URL(`https://api.telegram.org/bot${botToken}/${method}`);

      const options = {
        hostname: url.hostname,
        path: url.pathname,
        method: body ? "POST" : "GET",
        headers: { "Content-Type": "application/json" },
        timeout: 10000,
      };

      const req = https.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const json = JSON.parse(data);
            if (!json.ok) {
              const errMsg = json.description || "Unknown Telegram API error";
              reject(Object.assign(new Error(`Telegram API error: ${errMsg}`), { statusCode: 502 }));
            } else {
              resolve(json.result);
            }
          } catch {
            reject(Object.assign(new Error("Invalid response from Telegram API."), { statusCode: 502 }));
          }
        });
      });

      req.on("error", (err) => {
        reject(Object.assign(new Error(`Telegram connection failed: ${err.message}`), { statusCode: 502 }));
      });

      req.on("timeout", () => {
        req.destroy();
        reject(Object.assign(new Error("Telegram API request timed out after 10s."), { statusCode: 504 }));
      });

      if (body) {
        req.write(JSON.stringify(body));
      }
      req.end();
    });
  },

  /**
   * Test MikroTik connection via RouterOS API (port 8728).
   */
  async _testMikrotik(cred) {
    const { host, username, password, port } = cred;

    if (!host || !username) {
      throw Object.assign(
        new Error("MikroTik host and username are required."),
        { statusCode: 400 }
      );
    }

    const apiPort = port || 8728;

    const conn = new RouterOSAPI({
      host,
      user: username,
      password: password || "",
      port: apiPort,
      timeout: 10000,
    });

    try {
      await conn.connect();

      // Get router identity to confirm connection
      const identity = await conn.write("/system/identity/print");
      const routerName = identity[0]?.name || "Unknown";

      // Get system resource info
      const resources = await conn.write("/system/resource/print");
      const version = resources[0]?.version || "Unknown";
      const uptime = resources[0]?.uptime || "Unknown";

      conn.close();

      return {
        message: `Connected to MikroTik "${routerName}" (RouterOS ${version}, Uptime: ${uptime}).`,
      };
    } catch (err) {
      if (conn) {
        try { conn.close(); } catch { /* ignore */ }
      }

      if (err.code === "ECONNREFUSED") {
        throw Object.assign(
          new Error(`Connection refused on ${host}:${apiPort}. Ensure the MikroTik API service is enabled on port ${apiPort}.`),
          { statusCode: 502 }
        );
      }
      if (err.code === "ETIMEDOUT" || err.code === "ECONNABORTED") {
        throw Object.assign(
          new Error(`Connection timed out connecting to ${host}:${apiPort}. Check network connectivity and firewall.`),
          { statusCode: 504 }
        );
      }
      if (err.code === "ENOTFOUND") {
        throw Object.assign(
          new Error(`Host "${host}" not found. Check the hostname or IP address.`),
          { statusCode: 502 }
        );
      }

      throw Object.assign(
        new Error(`MikroTik connection failed: ${err.message}`),
        { statusCode: 502 }
      );
    }
  },

  /**
   * Test OLT connection via MikroTik (jump host).
   * Topology: Backend → MikroTik → OLT ZTE C320 (Telnet)
   */
  async _testOlt(cred) {
    const { host: oltHost, port: oltPort } = cred;
    const telnetPort = oltPort || 23;

    if (!oltHost) {
      throw Object.assign(new Error("OLT host is required."), { statusCode: 400 });
    }

    // Get MikroTik credentials to use as jump host
    const mikrotikCred = await Credential.findByType("mikrotik");
    if (!mikrotikCred || !mikrotikCred.host) {
      throw Object.assign(
        new Error("MikroTik credentials are required to reach the OLT. Please configure MikroTik credentials first."),
        { statusCode: 400 }
      );
    }

    // Connect to MikroTik
    const conn = new RouterOSAPI({
      host: mikrotikCred.host,
      user: mikrotikCred.username,
      password: mikrotikCred.password || "",
      port: mikrotikCred.port || 8728,
      timeout: 20000,
    });

    let connectionClosed = false;
    const safeClose = () => {
      if (!connectionClosed) {
        connectionClosed = true;
        try { conn.close(); } catch { /* ignore */ }
      }
    };

    try {
      await conn.connect();

      // Ping OLT dari MikroTik untuk verifikasi reachability
      const pingResult = await conn.write("/ping", [
        `=address=${oltHost}`,
        "=count=3",
        "=interval=1s",
      ]);

      safeClose();

      const replies = pingResult.filter((r) => r && r.time !== undefined);
      const sent = pingResult.filter((r) => r && (r.time !== undefined || r.status === "timeout")).length;

      if (replies.length === 0) {
        throw Object.assign(
          new Error(
            `OLT ${oltHost} not reachable via MikroTik. Ping failed (${sent} attempts).`
          ),
          { statusCode: 502 }
        );
      }

      const times = replies.map((r) => parseFloat(r.time)).filter((t) => !isNaN(t));
      const avgLatency = times.length > 0
        ? (times.reduce((a, b) => a + b, 0) / times.length).toFixed(1)
        : "N/A";

      return {
        message: `OLT ${oltHost} reachable via MikroTik (ping ${replies.length}/${sent}, avg ${avgLatency}ms)`,
      };
    } catch (err) {
      safeClose();
      if (err.statusCode) throw err;
      throw Object.assign(
        new Error(`OLT connection test failed: ${err.message}`),
        { statusCode: 502 }
      );
    }
  },

  /**
   * Execute a CLI command on the OLT via direct telnet.
   * Topology: Backend → OLT:23 (Telnet) — requires PC to have route to OLT network.
   *
   * @param {string} command - CLI command to execute on OLT
   * @returns {Promise<{output: string}>}
   */
  async executeOltCommand(command) {
    if (!command || !command.trim()) {
      throw Object.assign(new Error("Command is required."), { statusCode: 400 });
    }

    const oltCred = await Credential.findByType("olt");
    if (!oltCred || !oltCred.host) {
      throw Object.assign(
        new Error("OLT credentials are required. Please configure OLT first."),
        { statusCode: 400 }
      );
    }

    const params = {
      host: oltCred.host,
      port: oltCred.port || 23,
      username: oltCred.username || "",
      password: oltCred.password || "",
      shellPrompt: /[#>]\s*$/,
      loginPrompt: /(?:login|username|user)\s*[:>]/i,
      passwordPrompt: /(?:password|pass)\s*[:>]/i,
      timeout: 15000,
      stripShellPrompt: true,
    };

    const connection = new Telnet();

    try {
      await connection.connect(params);
      const result = await connection.exec(command);
      connection.end();
      return { output: result.trim() || "(no output)" };
    } catch (err) {
      if (connection) {
        try { connection.end(); } catch { /* ignore */ }
      }

      if (err.code === "ECONNREFUSED") {
        throw Object.assign(
          new Error(`Connection refused to ${params.host}:${params.port}. Telnet service may not be running on OLT.`),
          { statusCode: 502 }
        );
      }
      if (err.code === "ENOTFOUND" || err.code === "EAI_AGAIN") {
        throw Object.assign(
          new Error(`Host ${params.host} not found. Check network connectivity and routing.`),
          { statusCode: 502 }
        );
      }
      if (err.message && err.message.includes("timed out")) {
        throw Object.assign(
          new Error(`Connection timed out to ${params.host}:${params.port}. Check if OLT is reachable from this PC.`),
          { statusCode: 504 }
        );
      }

      throw Object.assign(
        new Error(`OLT command failed: ${err.message}`),
        { statusCode: 502 }
      );
    }
  },
};

module.exports = CredentialService;
