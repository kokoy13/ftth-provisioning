const UserService = require("../services/userService");

const UserController = {
  /**
   * GET /api/users
   */
  async list(req, res, next) {
    try {
      const data = await UserService.list();
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/users
   */
  async create(req, res, next) {
    try {
      const { username, password, role, fullName, email } = req.body;
      const result = await UserService.create(
        { username, password, role, fullName, email },
        req.user.username
      );

      res.auditMeta = {
        level: "INFO",
        message: `User "${username}" created.`,
      };

      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  /**
   * PUT /api/users/:id
   */
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { username, password, role, fullName, email } = req.body;
      const result = await UserService.update(
        id,
        { username, password, role, fullName, email },
        req.user.username
      );

      res.auditMeta = {
        level: "INFO",
        message: `User #${id} updated.`,
      };

      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  /**
   * DELETE /api/users/:id
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const result = await UserService.delete(id, req.user.username);

      res.auditMeta = {
        level: "INFO",
        message: `User #${id} deleted.`,
      };

      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = UserController;
