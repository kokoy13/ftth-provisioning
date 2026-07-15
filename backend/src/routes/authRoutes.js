const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");

router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/verify-reset-token", AuthController.verifyResetToken);
router.post("/reset-password", AuthController.resetPassword);

module.exports = router;
