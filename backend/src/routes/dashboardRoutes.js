const express = require("express");
const router = express.Router();
const DashboardController = require("../controllers/dashboardController");
const authenticate = require("../middlewares/authMiddleware");

router.use(authenticate);

router.get("/stats", DashboardController.getStats);
router.get("/active-pppoe", DashboardController.getActivePPPoE);
router.get("/recent-activity", DashboardController.getRecentActivity);

module.exports = router;
