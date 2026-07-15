const AuthService = require("../services/authService");

const AuthController = {
  /**
   * POST /api/auth/login
   */
  async login(req, res, next) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
      }

      const result = await AuthService.login(username, password);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/auth/logout
   */
  async logout(req, res) {
    // JWT is stateless — logout is handled client-side by removing the token.
    res.json({ message: "Logged out successfully." });
  },

  /**
   * POST /api/auth/forgot-password
   */
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required." });
      }

      const result = await AuthService.forgotPassword(email);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/auth/verify-reset-token
   */
  async verifyResetToken(req, res, next) {
    try {
      const { token } = req.body;
      const result = await AuthService.verifyResetToken(token);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/auth/reset-password
   */
  async resetPassword(req, res, next) {
    try {
      const { token, newPassword, confirmPassword } = req.body;

      const result = await AuthService.resetPassword(token, newPassword, confirmPassword);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = AuthController;
