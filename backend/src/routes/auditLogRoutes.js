const express = require("express");
const router = express.Router();
const AuditLogController = require("../controllers/auditLogController");
const authenticate = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");
const { ROLES } = require("../utils/constants");

router.use(authenticate);

// Only SUPER_ADMIN can view audit logs
router.get("/", authorize(ROLES.SUPER_ADMIN), AuditLogController.list);

module.exports = router;
