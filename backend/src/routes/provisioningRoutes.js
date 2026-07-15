const express = require("express");
const router = express.Router();
const ProvisioningController = require("../controllers/provisioningController");
const authenticate = require("../middlewares/authMiddleware");

router.use(authenticate);

router.get("/", ProvisioningController.list);
router.post("/", ProvisioningController.create);
router.get("/:id/progress", ProvisioningController.progress);
router.delete("/:id", ProvisioningController.delete);
router.post("/:id/retry", ProvisioningController.retry);

module.exports = router;
