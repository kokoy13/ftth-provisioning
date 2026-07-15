const AuditLog = require("../models/AuditLog");

const AuditLogService = {
  /**
   * List audit logs with filters and pagination.
   */
  async list({ search, level, limit, offset }) {
    const { data, total } = await AuditLog.findAll({ search, level, limit, offset });
    return { data, total, page: Math.ceil(offset / limit) + 1, limit, totalPages: Math.ceil(total / limit) };
  },
};

module.exports = AuditLogService;
