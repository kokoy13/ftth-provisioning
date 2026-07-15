const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const authenticate = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");
const { ROLES } = require("../utils/constants");

router.use(authenticate);

// Only SUPER_ADMIN can manage users
router.get("/", authorize(ROLES.SUPER_ADMIN), UserController.list);
router.post("/", authorize(ROLES.SUPER_ADMIN), UserController.create);
router.put("/:id", authorize(ROLES.SUPER_ADMIN), UserController.update);
router.delete("/:id", authorize(ROLES.SUPER_ADMIN), UserController.delete);

module.exports = router;
