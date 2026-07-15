const CredentialService = require("../services/credentialService");

const CredentialController = {
  /**
   * GET /api/credentials
   */
  async getAll(req, res, next) {
    try {
      const data = await CredentialService.getAll();
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  /**
   * PUT /api/credentials
   */
  async updateAll(req, res, next) {
    try {
      const result = await CredentialService.updateAll(req.body, req.user.username);

      res.auditMeta = {
        level: "INFO",
        message: "Device credentials updated.",
      };

      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  /**
   * PUT /api/credentials/:type
   */
  async updateOne(req, res, next) {
    try {
      const { type } = req.params;
      const result = await CredentialService.updateOne(type, req.body, req.user.username);

      res.auditMeta = {
        level: "INFO",
        message: `"${type}" credentials updated.`,
      };

      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/credentials/:type/test
   */
  async testConnection(req, res, next) {
    try {
      const { type } = req.params;
      const result = await CredentialService.testConnection(type);

      res.auditMeta = {
        level: "SUCCESS",
        message: `Connection test passed for "${type}".`,
      };

      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/credentials/olt/command
   * Execute a CLI command on the OLT via MikroTik tunnel.
   */
  async executeOltCommand(req, res, next) {
    try {
      const { command } = req.body;

      if (!command || !command.trim()) {
        return res.status(400).json({ message: "Command is required." });
      }

      const result = await CredentialService.executeOltCommand(command.trim());

      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = CredentialController;
