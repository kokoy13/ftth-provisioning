const AuditLog = require("../models/AuditLog");
const { LOG_LEVELS } = require("../utils/constants");

/**
 * Middleware to automatically log audit events after a successful response.
 * Attach custom metadata via res.auditMeta before calling res.json().
 *
 * Usage:
 *   res.auditMeta = { level: "SUCCESS", message: "Provisioning created for user X" };
 *   res.json({ ... });
 */
const auditLog = () => {
  return (req, res, next) => {
    const originalJson = res.json.bind(res);

    res.json = function (body) {
      const meta = res.auditMeta;

      if (meta && req.user) {
        AuditLog.create({
          level: meta.level || LOG_LEVELS.INFO,
          message: meta.message || `${req.method} ${req.originalUrl}`,
          actor: req.user.username,
          meta: JSON.stringify({
            method: req.method,
            url: req.originalUrl,
            body: req.body,
            params: req.params,
          }),
        }).catch((err) => {
          console.error("[AUDIT LOG ERROR]", err.message);
        });
      }

      return originalJson(body);
    };

    next();
  };
};

module.exports = auditLog;
