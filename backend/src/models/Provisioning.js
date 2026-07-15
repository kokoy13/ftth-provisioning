const db = require("../../config/db");
const { FSM_STATES, validateTransition } = require("../utils/constants");

const Provisioning = {
  /**
   * List provisioning records with optional search, status filter, and pagination.
   */
  async findAll({ search, status, limit, offset }) {
    let where = "WHERE 1=1";
    const params = [];

    if (search) {
      where += " AND (customer_name LIKE ? OR customer_username LIKE ? OR olt_port LIKE ?)";
      const s = `%${search}%`;
      params.push(s, s, s);
    }

    if (status && Object.values(FSM_STATES).includes(status)) {
      where += " AND status = ?";
      params.push(status);
    }

    // Count total
    const [countRows] = await db.execute(
      `SELECT COUNT(*) as total FROM provisioning ${where}`,
      params
    );
    const total = countRows[0].total;

    // Fetch records
    const [rows] = await db.execute(
      `SELECT id, customer_name AS customerName, customer_username AS customerUsername,
              pppoe_password AS pppoePassword, olt_port AS oltPort,
              serial_number AS serialNumber, profile, onu_number AS onuNumber,
              provisioning_step AS provisioningStep,
              ip_address AS ipAddress, status, error_message AS errorMessage,
              created_at AS createdAt, updated_at AS updatedAt
       FROM provisioning ${where}
       ORDER BY updated_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return { data: rows, total };
  },

  /**
   * Find a single provisioning record by ID.
   */
  async findById(id) {
    const [rows] = await db.execute(
      `SELECT id, customer_name AS customerName, customer_username AS customerUsername,
              pppoe_password AS pppoePassword, olt_port AS oltPort,
              serial_number AS serialNumber, profile, onu_number AS onuNumber,
              provisioning_step AS provisioningStep,
              ip_address AS ipAddress, status, error_message AS errorMessage,
              created_at AS createdAt, updated_at AS updatedAt
       FROM provisioning WHERE id = ? LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  },

  /**
   * Create a new provisioning record (starts in PENDING state).
   */
  async create({ customerName, customerUsername, pppoePassword, oltPort, serialNumber, profile, onuNumber }) {
    // Insert with IDLE state
    const [result] = await db.execute(
      `INSERT INTO provisioning (customer_name, customer_username, pppoe_password, olt_port, serial_number, profile, onu_number, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [customerName, customerUsername, pppoePassword || null, oltPort, serialNumber || null, profile || null, onuNumber || null, FSM_STATES.IDLE]
    );
    const id = result.insertId;
    // Transition IDLE → PENDING with FSM validation
    await this.updateStatus(id, FSM_STATES.PENDING, null);
    return { id, onuNumber: onuNumber || id, status: FSM_STATES.PENDING };
  },

  /**
   * Update a provisioning record's status.
   */
  async updateStatus(id, newStatus, errorMessage = null) {
    // Get current state
    const [rows] = await db.execute("SELECT status FROM provisioning WHERE id = ?", [id]);
    if (rows.length === 0) {
      throw Object.assign(new Error("Provisioning record not found."), { statusCode: 404 });
    }
    const currentStatus = rows[0].status;

    // FSM validation: only allow valid transitions
    validateTransition(currentStatus, newStatus);

    await db.execute(
      "UPDATE provisioning SET status = ?, error_message = ?, updated_at = NOW() WHERE id = ?",
      [newStatus, errorMessage, id]
    );
  },

  async updateStep(id, step) {
    await db.execute(
      "UPDATE provisioning SET provisioning_step = ?, updated_at = NOW() WHERE id = ?",
      [step, id]
    );
  },

  /**
   * Delete a provisioning record.
   */
  async delete(id) {
    const [result] = await db.execute("DELETE FROM provisioning WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },

  /**
   * Get counts by status (for dashboard stats).
   */
  async getStatusCounts() {
    const [rows] = await db.execute(
      "SELECT status, COUNT(*) as count FROM provisioning GROUP BY status"
    );
    const counts = {};
    rows.forEach((r) => {
      counts[r.status] = r.count;
    });
    return counts;
  },
};

module.exports = Provisioning;
