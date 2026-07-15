const express = require("express");
const router = express.Router();
const MonitoringController = require("../controllers/monitoringController");
const authenticate = require("../middlewares/authMiddleware");

router.use(authenticate);

router.get("/bandwidth", MonitoringController.getBandwidth);
router.get("/onu-health", MonitoringController.getOnuHealth);
router.get("/active-users", MonitoringController.getActiveUsers);
router.get("/user-bandwidth/:id", MonitoringController.getUserBandwidth);

module.exports = router;
