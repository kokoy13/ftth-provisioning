const db = require("../../config/db");

const User = {
  /**
   * Find a user by username.
   */
  async findByUsername(username) {
    const [rows] = await db.execute(
      "SELECT id, username, password, role, full_name, email FROM users WHERE username = ? LIMIT 1",
      [username]
    );
    return rows[0] || null;
  },

  /**
   * Find a user by ID.
   */
  async findById(id) {
    const [rows] = await db.execute(
      "SELECT id, username, role, full_name FROM users WHERE id = ? LIMIT 1",
      [id]
    );
    return rows[0] || null;
  },

  /**
   * Find user by email (for password recovery).
   */
  async findByEmail(email) {
    const [rows] = await db.execute(
      "SELECT id, username, email, role FROM users WHERE email = ? LIMIT 1",
      [email]
    );
    return rows[0] || null;
  },

  /**
   * Update user password.
   */
  async updatePassword(userId, hashedPassword) {
    await db.execute("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, userId]);
  },

  /**
   * Get all users (without passwords).
   */
  async findAll() {
    const [rows] = await db.execute(
      "SELECT id, username, role, full_name, email, created_at FROM users ORDER BY created_at DESC"
    );
    return rows;
  },

  /**
   * Create a new user.
   */
  async create({ username, password, role, full_name, email }) {
    const [result] = await db.execute(
      "INSERT INTO users (username, password, role, full_name, email) VALUES (?, ?, ?, ?, ?)",
      [username, password, role, full_name, email || null]
    );
    return { id: result.insertId, username, role, full_name, email };
  },

  /**
   * Update a user (partial).
   */
  async update(id, fields) {
    const allowed = ["username", "role", "full_name", "email", "password"];
    const entries = Object.entries(fields).filter(([key]) => allowed.includes(key));
    if (entries.length === 0) return;

    const setClause = entries.map(([key]) => `${key} = ?`).join(", ");
    const values = entries.map(([, val]) => val);

    await db.execute(`UPDATE users SET ${setClause} WHERE id = ?`, [...values, id]);
  },

  /**
   * Delete a user by ID.
   */
  async delete(id) {
    await db.execute("DELETE FROM users WHERE id = ?", [id]);
  },
};

module.exports = User;
