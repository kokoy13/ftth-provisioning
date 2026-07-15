const db = require("../../config/db");

const Credential = {
  /**
   * Get a credential record by type (mikrotik, olt, telegram).
   */
  async findByType(type) {
    const [rows] = await db.execute(
      "SELECT id, type, host, username, password, port, bot_token, chat_id FROM credentials WHERE type = ? LIMIT 1",
      [type]
    );
    return rows[0] || null;
  },

  /**
   * Get all credentials (without passwords for security).
   */
  async findAll() {
    const [rows] = await db.execute(
      "SELECT id, type, host, username, port, bot_token, chat_id FROM credentials"
    );
    return rows;
  },

  /**
   * Upsert (insert or update) a credential record by type.
   */
  async upsert(type, data) {
    const existing = await this.findByType(type);

    if (existing) {
      const fields = [];
      const values = [];

      if (data.host !== undefined) { fields.push("host = ?"); values.push(data.host); }
      if (data.username !== undefined) { fields.push("username = ?"); values.push(data.username); }
      if (data.password !== undefined) { fields.push("password = ?"); values.push(data.password); }
      if (data.port !== undefined) { fields.push("port = ?"); values.push(data.port); }
      if (data.bot_token !== undefined) { fields.push("bot_token = ?"); values.push(data.bot_token); }
      if (data.chat_id !== undefined) { fields.push("chat_id = ?"); values.push(data.chat_id); }

      if (fields.length > 0) {
        values.push(type);
        await db.execute(
          `UPDATE credentials SET ${fields.join(", ")} WHERE type = ?`,
          values
        );
      }
    } else {
      await db.execute(
        `INSERT INTO credentials (type, host, username, password, port, bot_token, chat_id)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          type,
          data.host || null,
          data.username || null,
          data.password || null,
          data.port || null,
          data.bot_token || null,
          data.chat_id || null,
        ]
      );
    }
  },

  /**
   * Get all credentials grouped by type (for GET /credentials response).
   */
  async getGrouped() {
    const rows = await this.findAll();
    const result = {};
    rows.forEach((r) => {
      if (r.type === "mikrotik" || r.type === "olt") {
        result[r.type] = {
          host: r.host,
          username: r.username,
          port: r.port,
        };
      } else if (r.type === "telegram") {
        result[r.type] = {
          botToken: r.bot_token,
          chatId: r.chat_id,
        };
      }
    });
    return result;
  },
};

module.exports = Credential;
