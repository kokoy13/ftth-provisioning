const db = require("../../config/db");

const AuditLog = {
  /**
   * Create a new audit log entry.
   */
  async create({ level, message, actor, meta }) {
    const [result] = await db.execute(
      "INSERT INTO audit_logs (level, message, actor, meta) VALUES (?, ?, ?, ?)",
      [level, message, actor || "System", meta || null]
    );
    return { id: result.insertId };
  },

  /**
   * List audit logs with optional search, level filter, and pagination.
   */
  async findAll({ search, level, limit, offset }) {
    let where = "WHERE 1=1";
    const params = [];

    if (search) {
      where += " AND (message LIKE ? OR actor LIKE ?)";
      const s = `%${search}%`;
      params.push(s, s);
    }

    if (level) {
      where += " AND level = ?";
      params.push(level);
    }

    // Count total
    const [countRows] = await db.execute(
      `SELECT COUNT(*) as total FROM audit_logs ${where}`,
      params
    );
    const total = countRows[0].total;

    // Fetch records
    const [rows] = await db.execute(
      `SELECT id, level, message, actor, meta, created_at AS timestamp
       FROM audit_logs ${where}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return { data: rows, total };
  },

  /**
   * Get recent activity logs (for dashboard feed).
   */
  async getRecent(limit = 10) {
    const [rows] = await db.execute(
      `SELECT id, level, message, actor, created_at AS timestamp
       FROM audit_logs
       ORDER BY created_at DESC
       LIMIT ?`,
      [limit]
    );
    return rows;
  },
};

module.exports = AuditLog;
