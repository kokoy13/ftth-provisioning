import { Search, Filter } from "lucide-react";

// ─── DATA STATUS LOKAL ──────────────────────────────────────────
const FSM_STATES = {
  IDLE: "IDLE",
  PENDING: "PENDING",
  PROVISIONING: "PROVISIONING",
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
  FAILED: "FAILED",
};

const FSM_STATE_LABELS = {
  [FSM_STATES.IDLE]: "Idle",
  [FSM_STATES.PENDING]: "Pending",
  [FSM_STATES.PROVISIONING]: "Provisioning",
  [FSM_STATES.ACTIVE]: "Active",
  [FSM_STATES.SUSPENDED]: "Suspended",
  [FSM_STATES.FAILED]: "Failed",
};

/**
 * Filter bar with search, status filter, and date filter.
 */
const FilterBar = ({ searchQuery, onSearchChange, statusFilter, onStatusFilterChange }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by customer name, OLT port, or username…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      {/* Status Filter */}
      <div className="relative">
        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="pl-10 pr-8 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-700 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
        >
          <option value="">All Statuses</option>
          {Object.values(FSM_STATES).map((state) => (
            <option key={state} value={state}>
              {FSM_STATE_LABELS[state]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterBar;