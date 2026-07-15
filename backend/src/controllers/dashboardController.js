const Provisioning = require("../models/Provisioning");
const AuditLog = require("../models/AuditLog");

const DashboardController = {
  /**
   * GET /api/dashboard/stats
   */
  async getStats(req, res, next) {
    try {
      const counts = await Provisioning.getStatusCounts();

      res.json({
        activePPPoE: counts.ACTIVE || 0,
        onlineOnus: counts.ACTIVE || 0,
        suspended: counts.SUSPENDED || 0,
        alerts: counts.FAILED || 0,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/dashboard/active-pppoe
   */
  async getActivePPPoE(req, res, next) {
    try {
      const { data } = await Provisioning.findAll({
        status: "ACTIVE",
        limit: 20,
        offset: 0,
      });

      // Map to session-like format for the frontend grid
      const sessions = data.map((r) => ({
        customer: r.customerName,
        username: r.customerUsername,
        ipAddress: r.ipAddress || "N/A",
        status: r.status,
        uptime: "—",
      }));

      res.json({ data: sessions });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/dashboard/recent-activity
   */
  async getRecentActivity(req, res, next) {
    try {
      const activities = await AuditLog.getRecent(10);
      res.json({ data: activities });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = DashboardController;
