/**
 * Role-based authorization middleware.
 * Requires authenticate middleware to have run first (req.user must exist).
 * @param  {...string} allowedRoles - Roles permitted to access the route.
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required." });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied. You do not have permission to perform this action.",
      });
    }

    next();
  };
};

module.exports = authorize;
