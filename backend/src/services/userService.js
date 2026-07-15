const bcrypt = require("bcryptjs");
const User = require("../models/User");
const AuditLog = require("../models/AuditLog");
const { LOG_LEVELS } = require("../utils/constants");

const UserService = {
  /**
   * Get all users.
   */
  async list() {
    return await User.findAll();
  },

  /**
   * Create a new user.
   */
  async create({ username, password, role, fullName, email }, actor) {
    if (!username || !password || !role) {
      throw Object.assign(new Error("Username, password, and role are required."), { statusCode: 400 });
    }

    const existing = await User.findByUsername(username);
    if (existing) {
      throw Object.assign(new Error("Username already exists."), { statusCode: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      password: hashedPassword,
      role,
      full_name: fullName || null,
      email: email || null,
    });

    await AuditLog.create({
      level: LOG_LEVELS.INFO,
      message: `User "${username}" created by "${actor}".`,
      actor,
    }).catch(() => {});

    return user;
  },

  /**
   * Update an existing user.
   */
  async update(id, { username, password, role, fullName, email }, actor) {
    const user = await User.findById(id);
    if (!user) {
      throw Object.assign(new Error("User not found."), { statusCode: 404 });
    }

    if (username !== undefined && username !== user.username) {
      const existing = await User.findByUsername(username);
      if (existing) {
        throw Object.assign(new Error("Username already exists."), { statusCode: 409 });
      }
    }

    const fields = {};
    if (username !== undefined) fields.username = username;
    if (role !== undefined) fields.role = role;
    if (fullName !== undefined) fields.full_name = fullName;
    if (email !== undefined) fields.email = email;
    if (password) {
      fields.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(fields).length > 0) {
      await User.update(id, fields);
    }

    await AuditLog.create({
      level: LOG_LEVELS.INFO,
      message: `User "${user.username}" updated by "${actor}".`,
      actor,
    }).catch(() => {});

    return { message: "User updated successfully." };
  },

  /**
   * Delete a user.
   */
  async delete(id, actor) {
    const user = await User.findById(id);
    if (!user) {
      throw Object.assign(new Error("User not found."), { statusCode: 404 });
    }

    await User.delete(id);

    await AuditLog.create({
      level: LOG_LEVELS.INFO,
      message: `User "${user.username}" deleted by "${actor}".`,
      actor,
    }).catch(() => {});

    return { message: "User deleted successfully." };
  },
};

module.exports = UserService;
