// ─── FSM Provisioning States ────────────────────────────────────────────────
export const FSM_STATES = {
  IDLE: "IDLE",
  PENDING: "PENDING",
  PROVISIONING: "PROVISIONING",
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
  FAILED: "FAILED",
};

export const FSM_STATE_LABELS = {
  [FSM_STATES.IDLE]: "Idle",
  [FSM_STATES.PENDING]: "Pending",
  [FSM_STATES.PROVISIONING]: "Provisioning",
  [FSM_STATES.ACTIVE]: "Active",
  [FSM_STATES.SUSPENDED]: "Suspended",
  [FSM_STATES.FAILED]: "Failed",
};

// ─── FSM State Visual Themes ────────────────────────────────────────────────
export const FSM_STATE_THEMES = {
  [FSM_STATES.IDLE]: {
    badge: "bg-amber-50 text-amber-800 border border-amber-300",
    row: "border-l-4 border-amber-400",
    dot: "bg-amber-500",
  },
  [FSM_STATES.PENDING]: {
    badge: "bg-amber-50 text-amber-800 border border-amber-300",
    row: "border-l-4 border-amber-400",
    dot: "bg-amber-500",
  },
  [FSM_STATES.PROVISIONING]: {
    badge: "bg-blue-50 text-blue-800 border border-blue-300",
    row: "border-l-4 border-blue-400",
    dot: "bg-blue-500",
    animated: true,
  },
  [FSM_STATES.ACTIVE]: {
    badge: "bg-emerald-50 text-emerald-800 border border-emerald-300",
    row: "border-l-4 border-emerald-400",
    dot: "bg-emerald-500",
  },
  [FSM_STATES.SUSPENDED]: {
    badge: "bg-orange-50 text-orange-800 border border-orange-300",
    row: "border-l-4 border-orange-400",
    dot: "bg-orange-500",
  },
  [FSM_STATES.FAILED]: {
    badge: "bg-rose-50 text-rose-800 border border-rose-300",
    row: "border-l-4 border-rose-400",
    dot: "bg-rose-500",
  },
};

// ─── User Roles ─────────────────────────────────────────────────────────────
export const ROLES = {
  SUPER_ADMIN: "admin",
  FIELD_TECH: "tech",
};

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: "Admin",
  [ROLES.FIELD_TECH]: "Techinician",
};

// ─── API Endpoints ──────────────────────────────────────────────────────────
export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  FORGOT_PASSWORD: "/auth/forgot-password",
  VERIFY_RESET_TOKEN: "/auth/verify-reset-token",
  RESET_PASSWORD: "/auth/reset-password",

  // Dashboard
  DASHBOARD_STATS: "/dashboard/stats",
  ACTIVE_PPOE: "/dashboard/active-pppoe",
  RECENT_ACTIVITY: "/dashboard/recent-activity",

  // Provisioning
  PROVISIONING_LIST: "/provisioning",
  PROVISIONING_CREATE: "/provisioning",
  PROVISIONING_UPDATE: "/provisioning/:id",
  PROVISIONING_DELETE: "/provisioning/:id",
  PROVISIONING_RETRY: "/provisioning/:id/retry",

  // Monitoring
  BANDWIDTH: "/monitoring/bandwidth",
  ONU_HEALTH: "/monitoring/onu-health",

  // Credentials
  CREDENTIALS_GET: "/credentials",
  CREDENTIALS_UPDATE: "/credentials",
  CREDENTIALS_TEST: "/credentials/:type/test",

  // Audit Logs
  AUDIT_LOGS: "/audit-logs",
};

// ─── Log Levels ─────────────────────────────────────────────────────────────
export const LOG_LEVELS = {
  INFO: "INFO",
  SUCCESS: "SUCCESS",
  WARNING: "WARNING",
  ERROR: "ERROR",
};

export const LOG_LEVEL_THEMES = {
  [LOG_LEVELS.INFO]: "bg-blue-100 text-blue-800",
  [LOG_LEVELS.SUCCESS]: "bg-emerald-100 text-emerald-800",
  [LOG_LEVELS.WARNING]: "bg-amber-100 text-amber-800",
  [LOG_LEVELS.ERROR]: "bg-rose-100 text-rose-800",
};

// ─── Pagination ─────────────────────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// ─── Chart.js Defaults ──────────────────────────────────────────────────────
export const BANDWIDTH_POLL_INTERVAL_MS = 5000;
export const BANDWIDTH_HISTORY_LENGTH = 30;
