const ProvisioningService = require("../services/provisioningService");
const { getPaginationParams } = require("../utils/helpers");

const ProvisioningController = {
  /**
   * GET /api/provisioning
   */
  async list(req, res, next) {
    try {
      const { page, limit, offset } = getPaginationParams(req.query);
      const result = await ProvisioningService.list({
        search: req.query.search,
        status: req.query.status,
        page,
        limit,
        offset,
      });
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/provisioning
   */
  async create(req, res, next) {
    try {
      const { customerName, customerUsername, pppoePassword, oltPort, serialNumber, profile, onuNumber } = req.body;

      if (!customerName || !customerUsername || !pppoePassword || !oltPort) {
        return res.status(400).json({
          message: "customerName, customerUsername, pppoePassword, and oltPort are required.",
        });
      }
      const record = await ProvisioningService.create(
        { customerName, customerUsername, pppoePassword, oltPort, serialNumber, profile, onuNumber },
        req.user.username
      );

      res.auditMeta = {
        level: "SUCCESS",
        message: `Provisioning created for "${customerName}"`,
      };

      res.status(201).json(record);
    } catch (err) {
      next(err);
    }
  },

  /**
   * DELETE /api/provisioning/:id
   */
  /**
   * GET /api/provisioning/:id/progress
   */
  async progress(req, res, next) {
    try {
      const { id } = req.params;
      const record = await ProvisioningService.progress(id);
      res.json(record);
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const result = await ProvisioningService.delete(id, req.user.username);

      res.auditMeta = {
        level: "WARNING",
        message: `Provisioning deleted (ID: ${id})`,
      };

      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/provisioning/:id/retry
   */
  async retry(req, res, next) {
    try {
      const { id } = req.params;
      const result = await ProvisioningService.retry(id, req.user.username);
      
      res.auditMeta = {
        level: "INFO",
        message: `Provisioning retry initiated (ID: ${id})`,
      };

      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = ProvisioningController;
