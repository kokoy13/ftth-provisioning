const MonitoringService = require("../services/monitoringService");

const MonitoringController = {
  /**
   * GET /api/monitoring/bandwidth
   */
  async getBandwidth(req, res) {
    const data = MonitoringService.getBandwidth();
    res.json(data);
  },

  /**
   * GET /api/monitoring/onu-health
   */
  async getOnuHealth(req, res, next) {
    try {
      const data = await MonitoringService.getOnuHealth();
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/monitoring/active-users
   */
  async getActiveUsers(req, res, next) {
    try {
      const data = await MonitoringService.getActiveUsers();
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/monitoring/user-bandwidth/:id
   */
  async getUserBandwidth(req, res) {
    const data = MonitoringService.getUserBandwidth(req.params.id);
    res.json(data);
  },
};

module.exports = MonitoringController;
