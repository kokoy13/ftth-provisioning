const db = require("../../config/db");
const { randomMbps, timeString } = require("../utils/helpers");

const MonitoringService = {
  /**
   * Get current bandwidth metrics (simulated for now — in production,
   * this would query MikroTik CCR via API for real interface traffic data).
   */
  getBandwidth() {
    return {
      timestamp: timeString(),
      inboundMbps: randomMbps(50, 300),
      outboundMbps: randomMbps(30, 200),
    };
  },

  /**
   * Get ONU health summary from the ZTE OLT.
   */
  async getOnuHealth() {
    try {
      const [rows] = await db.execute(
        `SELECT
           SUM(CASE WHEN status = 'ACTIVE' THEN 1 ELSE 0 END) AS onlineCount,
           SUM(CASE WHEN status IN ('FAILED', 'SUSPENDED', 'IDLE', 'PENDING') THEN 1 ELSE 0 END) AS offlineCount
         FROM provisioning`
      );
      return {
        onlineCount: rows[0]?.onlineCount || 0,
        offlineCount: rows[0]?.offlineCount || 0,
      };
    } catch {
      return { onlineCount: 0, offlineCount: 0 };
    }
  },

  /**
   * Get list of active users (status = ACTIVE).
   */
  async getActiveUsers() {
    try {
      const [rows] = await db.execute(
        `SELECT id, customer_name, customer_username, olt_port, serial_number, profile, ip_address, status, created_at
         FROM provisioning
         WHERE status = 'ACTIVE'
         ORDER BY customer_name ASC`
      );
      return rows;
    } catch {
      return [];
    }
  },

  /**
   * Get simulated per-user bandwidth traffic.
   */
  getUserBandwidth(userId) {
    return {
      userId,
      timestamp: timeString(),
      inboundMbps: randomMbps(5, 80),
      outboundMbps: randomMbps(3, 50),
    };
  },
};

module.exports = MonitoringService;
