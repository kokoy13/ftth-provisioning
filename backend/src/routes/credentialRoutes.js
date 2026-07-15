const express = require("express");
const router = express.Router();
const CredentialController = require("../controllers/credentialController");
const authenticate = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");
const { ROLES } = require("../utils/constants");

router.use(authenticate);

// Only SUPER_ADMIN can manage credentials
router.get("/", authorize(ROLES.SUPER_ADMIN), CredentialController.getAll);
router.put("/", authorize(ROLES.SUPER_ADMIN), CredentialController.updateAll);

// OLT command execution (must be before /:type to avoid route conflict)
router.post("/olt/command", authorize(ROLES.SUPER_ADMIN), CredentialController.executeOltCommand);

router.put("/:type", authorize(ROLES.SUPER_ADMIN), CredentialController.updateOne);
router.post("/:type/test", authorize(ROLES.SUPER_ADMIN), CredentialController.testConnection);

module.exports = router;
