const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { errorHandler, notFound } = require("./src/middlewares/errorMiddleware");
const auditLog = require("./src/middlewares/auditLogMiddleware");

// Route imports
const authRoutes = require("./src/routes/authRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const provisioningRoutes = require("./src/routes/provisioningRoutes");
const monitoringRoutes = require("./src/routes/monitoringRoutes");
const credentialRoutes = require("./src/routes/credentialRoutes");
const auditLogRoutes = require("./src/routes/auditLogRoutes");
const userRoutes = require("./src/routes/userRoutes");

const app = express();

// ─── Global Middleware ──────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(auditLog());

// ─── API Routes ─────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/provisioning", provisioningRoutes);
app.use("/api/monitoring", monitoringRoutes);
app.use("/api/credentials", credentialRoutes);
app.use("/api/audit-logs", auditLogRoutes);
app.use("/api/users", userRoutes);

// ─── Health Check ───────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Error Handling ─────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ───────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📋 API base: http://localhost:${PORT}/api`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
});
