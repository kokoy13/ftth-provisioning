/**
 * Database Seed Script
 * Creates all required tables and inserts initial demo data.
 *
 * Run: npm run seed
 */
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const run = async () => {
  const pool = await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || "3306"),
  });

  const DB_NAME = process.env.DB_NAME || "mikonet";

  console.log("🔧 Creating database if not exists...");
  await pool.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
  await pool.query(`USE \`${DB_NAME}\``);

  // ─── Create Tables ────────────────────────────────────────────────────────
  console.log("📦 Creating tables...");

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('admin', 'tech') NOT NULL DEFAULT 'tech',
      full_name VARCHAR(100) DEFAULT NULL,
      email VARCHAR(100) DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS provisioning (
      id INT AUTO_INCREMENT PRIMARY KEY,
      customer_name VARCHAR(100) NOT NULL,
      customer_username VARCHAR(50) NOT NULL,
      pppoe_password VARCHAR(100) DEFAULT NULL,
      olt_port VARCHAR(50) NOT NULL,
      serial_number VARCHAR(50) DEFAULT NULL,
      profile VARCHAR(50) DEFAULT NULL,
      onu_number INT DEFAULT NULL,
      ip_address VARCHAR(45) DEFAULT NULL,
      status ENUM('IDLE','PENDING','PROVISIONING','ACTIVE','SUSPENDED','FAILED') NOT NULL DEFAULT 'IDLE',
      error_message TEXT DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS credentials (
      id INT AUTO_INCREMENT PRIMARY KEY,
      type VARCHAR(20) NOT NULL UNIQUE,
      host VARCHAR(255) DEFAULT NULL,
      username VARCHAR(100) DEFAULT NULL,
      password VARCHAR(255) DEFAULT NULL,
      port INT DEFAULT NULL,
      bot_token VARCHAR(255) DEFAULT NULL,
      chat_id VARCHAR(50) DEFAULT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      level ENUM('INFO','SUCCESS','WARNING','ERROR') NOT NULL DEFAULT 'INFO',
      message TEXT NOT NULL,
      actor VARCHAR(50) DEFAULT 'System',
      meta JSON DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // ─── Seed Demo Data ───────────────────────────────────────────────────────
  console.log("🌱 Seeding demo data...");

  // Users
  const adminPass = await bcrypt.hash("admin123", 10);
  const techPass = await bcrypt.hash("tech123", 10);

  await pool.query(
    `INSERT INTO users (username, password, role, full_name, email)
     VALUES (?, ?, 'admin', 'Network Admin', 'admin@mikonet.com')
     ON DUPLICATE KEY UPDATE password = VALUES(password)`,
    ["admin", adminPass]
  );

  await pool.query(
    `INSERT INTO users (username, password, role, full_name, email)
     VALUES (?, ?, 'tech', 'Field Technician', 'tech@mikonet.com')
     ON DUPLICATE KEY UPDATE password = VALUES(password)`,
    ["technician", techPass]
  );

  // Add columns if missing (for existing databases)
  try { await pool.query("ALTER TABLE provisioning ADD COLUMN pppoe_password VARCHAR(100) DEFAULT NULL AFTER customer_username"); } catch {}
  try { await pool.query("ALTER TABLE provisioning ADD COLUMN onu_number INT DEFAULT NULL AFTER profile"); } catch {}
  try { await pool.query("ALTER TABLE provisioning ADD COLUMN provisioning_step VARCHAR(100) DEFAULT NULL AFTER onu_number"); } catch {}

  // Sample provisioning records
  const sampleCustomers = [
    { name: "John Doe", user: "johndoe_pppoe", pass: "johndoe123", port: "olt-1/1/1:1", sn: "ZTEGCA123456", profile: "100M-Plan", onu: 1, ip: "10.10.1.101", status: "ACTIVE" },
    { name: "Jane Smith", user: "janesmith_pppoe", pass: "jane123", port: "olt-1/1/1:2", sn: "ZTEGCA789012", profile: "50M-Plan", onu: 2, ip: "10.10.1.102", status: "ACTIVE" },
    { name: "Bob Wilson", user: "bobwilson_pppoe", pass: "bob123", port: "olt-1/1/2:1", sn: "ZTEGCB345678", profile: "100M-Plan", onu: 3, ip: null, status: "PROVISIONING" },
    { name: "Alice Brown", user: "alicebrown_pppoe", pass: "alice123", port: "olt-1/1/2:3", sn: "ZTEGCC901234", profile: "50M-Plan", onu: 4, ip: null, status: "PENDING" },
    { name: "Charlie Davis", user: "charlie_pppoe", pass: "charlie123", port: "olt-1/1/3:1", sn: "ZTEGCD567890", profile: "200M-Plan", onu: 5, ip: null, status: "FAILED", error: "ONU authentication failed" },
    { name: "Diana Evans", user: "diana_pppoe", pass: "diana123", port: "olt-1/1/3:2", sn: "ZTEGCE123789", profile: "100M-Plan", onu: 6, ip: "10.10.1.106", status: "SUSPENDED" },
  ];

  for (const c of sampleCustomers) {
    await pool.query(
      `INSERT INTO provisioning (customer_name, customer_username, pppoe_password, olt_port, serial_number, profile, onu_number, ip_address, status, error_message)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE customer_name = VALUES(customer_name)`,
      [c.name, c.user, c.pass, c.port, c.sn, c.profile, c.onu || null, c.ip, c.status, c.error || null]
    );
  }

  // Sample credentials
  await pool.query(
    `INSERT INTO credentials (type, host, username, password, port)
     VALUES ('mikrotik', '192.168.1.1', 'admin', 'mikrotik_pass', 8728)
     ON DUPLICATE KEY UPDATE host = VALUES(host)`
  );
  await pool.query(
    `INSERT INTO credentials (type, host, username, password, port)
     VALUES ('olt', '192.168.1.2', 'admin', 'olt_pass', 23)
     ON DUPLICATE KEY UPDATE host = VALUES(host)`
  );
  await pool.query(
    `INSERT INTO credentials (type, bot_token, chat_id)
     VALUES ('telegram', '123456:ABC-DEF', '-1001234567890')
     ON DUPLICATE KEY UPDATE bot_token = VALUES(bot_token)`
  );

  // Sample audit logs
  const sampleLogs = [
    { level: "SUCCESS", message: "Provisioning succeeded for John Doe", actor: "System" },
    { level: "SUCCESS", message: "Provisioning succeeded for Jane Smith", actor: "System" },
    { level: "ERROR", message: "Provisioning failed for Charlie Davis: ONU authentication failed", actor: "System" },
    { level: "INFO", message: 'User "admin" logged in successfully.', actor: "admin" },
    { level: "WARNING", message: "High bandwidth usage detected on olt-1/1/1", actor: "System" },
  ];

  for (const log of sampleLogs) {
    await pool.query(
      "INSERT INTO audit_logs (level, message, actor) VALUES (?, ?, ?)",
      [log.level, log.message, log.actor]
    );
  }

  console.log("✅ Database seeded successfully!");
  console.log("");
  console.log("Demo accounts:");
  console.log("  Admin: username=admin, password=admin123");
  console.log("  Tech:  username=technician, password=tech123");

  await pool.end();
};

run().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
