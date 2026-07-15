const AuditLogService = require("../services/auditLogService");
const { getPaginationParams } = require("../utils/helpers");

const AuditLogController = {
  /**
   * GET /api/audit-logs
   */
  async list(req, res, next) {
    try {
      const { limit, offset } = getPaginationParams(req.query);
      const result = await AuditLogService.list({
        search: req.query.search,
        level: req.query.level,
        limit,
        offset,
      });
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = AuditLogController;
