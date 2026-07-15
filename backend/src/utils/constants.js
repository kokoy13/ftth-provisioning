// ─── FSM Provisioning States ─────────────────────────────────────────────────
const FSM_STATES = {
  IDLE: "IDLE",
  PENDING: "PENDING",
  PROVISIONING: "PROVISIONING",
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
  FAILED: "FAILED",
};

// ─── FSM Transition Rules ───────────────────────────────────────────────────
// Setiap key adalah state asal, value adalah array state tujuan yang diizinkan
const FSM_TRANSITIONS = {
  [FSM_STATES.IDLE]:          [FSM_STATES.PENDING],
  [FSM_STATES.PENDING]:       [FSM_STATES.PROVISIONING, FSM_STATES.FAILED],
  [FSM_STATES.PROVISIONING]:  [FSM_STATES.ACTIVE, FSM_STATES.FAILED],
  [FSM_STATES.ACTIVE]:        [FSM_STATES.SUSPENDED],
  [FSM_STATES.SUSPENDED]:     [FSM_STATES.ACTIVE],
  [FSM_STATES.FAILED]:        [FSM_STATES.PROVISIONING],
};

// ─── FSM Transition Validator ───────────────────────────────────────────────
function validateTransition(currentState, newState) {
  const allowed = FSM_TRANSITIONS[currentState];
  if (!allowed) {
    throw new Error(`Unknown FSM state: "${currentState}".`);
  }
  if (!allowed.includes(newState)) {
    throw Object.assign(
      new Error(
        `Invalid FSM transition: "${currentState}" → "${newState}". ` +
        `Allowed transitions from "${currentState}": ${allowed.join(", ") || "none"}.`
      ),
      { statusCode: 400 }
    );
  }
}

// ─── User Roles ─────────────────────────────────────────────────────────────
const ROLES = {
  SUPER_ADMIN: "admin",
  FIELD_TECH: "tech",
};

// ─── Log Levels ─────────────────────────────────────────────────────────────
const LOG_LEVELS = {
  INFO: "INFO",
  SUCCESS: "SUCCESS",
  WARNING: "WARNING",
  ERROR: "ERROR",
};

// ─── JWT Config ─────────────────────────────────────────────────────────────
const JWT_SECRET = process.env.JWT_SECRET || "ftth_provisioning_secret_key_2026";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

// ─── Pagination ─────────────────────────────────────────────────────────────
const DEFAULT_PAGE_SIZE = 10;

module.exports = {
  FSM_STATES,
  FSM_TRANSITIONS,
  validateTransition,
  ROLES,
  LOG_LEVELS,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  DEFAULT_PAGE_SIZE,
};
