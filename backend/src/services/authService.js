const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../../config/db");
const User = require("../models/User");
const AuditLog = require("../models/AuditLog");
const EmailService = require("./emailService");
const { JWT_SECRET, JWT_EXPIRES_IN, LOG_LEVELS, ROLES } = require("../utils/constants");

const AuthService = {
  /**
   * Authenticate a user and return a JWT token.
   */
  async login(username, password) {
    const user = await User.findByUsername(username);

    if (!user) {
      throw Object.assign(new Error("Invalid username or password."), { statusCode: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw Object.assign(new Error("Invalid username or password."), { statusCode: 401 });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Log successful login
    await AuditLog.create({
      level: LOG_LEVELS.SUCCESS,
      message: `User "${username}" logged in successfully.`,
      actor: username,
    }).catch(() => {});

    return {
      token,
      user: {
        username: user.username,
        role: user.role,
        fullName: user.full_name,
        email: user.email,
      },
    };
  },

  /**
   * Handle password recovery request.
   * Checks if user exists and role is SUPER_ADMIN before generating reset link.
   */
  async forgotPassword(email) {
    const user = await User.findByEmail(email);

    // Always return generic message — don't reveal whether email exists or role
    if (!user || user.role !== ROLES.SUPER_ADMIN) {
      return { message: "If the email exists, a recovery link has been sent." };
    }

    // Generate a short-lived JWT reset token
    const resetToken = jwt.sign(
      { id: user.id, email: user.email, purpose: "password_reset" },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

    // Send the reset link via email
    await EmailService.sendResetPassword(user.email, resetLink);

    await AuditLog.create({
      level: LOG_LEVELS.INFO,
      message: `Password reset email sent to "${user.email}" (${user.username}).`,
      actor: user.username,
    }).catch(() => {});

    return {
      message: "If the email exists, a recovery link has been sent.",
    };
  },

  /**
   * Verify that a reset token is valid (without consuming it).
   */
  async verifyResetToken(token) {
    if (!token) {
      return { valid: false };
    }

    try {
      const payload = jwt.verify(token, JWT_SECRET);
      if (payload.purpose !== "password_reset") {
        return { valid: false };
      }

      const user = await User.findById(payload.id);
      if (!user) {
        return { valid: false };
      }

      return { valid: true };
    } catch {
      return { valid: false };
    }
  },

  /**
   * Reset user password using a valid reset token.
   */
  async resetPassword(token, newPassword, confirmPassword) {
    if (!token) {
      throw Object.assign(new Error("Reset token is required."), { statusCode: 400 });
    }

    if (!newPassword || !confirmPassword) {
      throw Object.assign(new Error("New password and confirmation are required."), { statusCode: 400 });
    }

    if (newPassword !== confirmPassword) {
      throw Object.assign(new Error("Passwords do not match."), { statusCode: 400 });
    }

    if (newPassword.length < 6) {
      throw Object.assign(new Error("Password must be at least 6 characters."), { statusCode: 400 });
    }

    // Verify the reset token
    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch {
      throw Object.assign(new Error("Invalid or expired reset token."), { statusCode: 401 });
    }

    if (payload.purpose !== "password_reset") {
      throw Object.assign(new Error("Invalid reset token."), { statusCode: 401 });
    }

    // Find user and update password
    const user = await User.findById(payload.id);
    if (!user) {
      throw Object.assign(new Error("User not found."), { statusCode: 404 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await User.updatePassword(user.id, hashedPassword);

    await AuditLog.create({
      level: LOG_LEVELS.SUCCESS,
      message: `Password has been reset successfully for user "${user.username}".`,
      actor: user.username,
    }).catch(() => {});

    return { message: "Password has been reset successfully." };
  },
};

module.exports = AuthService;
