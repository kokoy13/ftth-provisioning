const FSM_STATES = {
    IDLE: "IDLE",
    PENDING: "PENDING",
    PROVISIONING: "PROVISIONING",
    ACTIVE: "ACTIVE",
    SUSPENDED: "SUSPENDED",
    FAILED: "FAILED",
};

const FSM_STATE_THEMES = {
    [FSM_STATES.IDLE]: { 
        badge: "bg-amber-50 text-amber-800 border border-amber-300", 
        dot: "bg-amber-500" 
    },
    [FSM_STATES.PENDING]: { 
        badge: "bg-amber-50 text-amber-800 border border-amber-300", 
        dot: "bg-amber-500" 
    },
    [FSM_STATES.PROVISIONING]: { 
        badge: "bg-blue-50 text-blue-800 border border-blue-300", 
        dot: "bg-blue-500", 
        animated: true 
    },
    [FSM_STATES.ACTIVE]: { 
        badge: "bg-emerald-50 text-emerald-800 border border-emerald-300", 
        dot: "bg-emerald-500" 
    },
    [FSM_STATES.SUSPENDED]: { 
        badge: "bg-orange-50 text-orange-800 border border-orange-300", 
        dot: "bg-orange-500" 
    },
    [FSM_STATES.FAILED]: { 
        badge: "bg-rose-50 text-rose-800 border border-rose-300", 
        dot: "bg-rose-500" 
    },
};

const capitalize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const StatusBadge = ({ status }) => {
    // IDLE sebagai fallback jika status tidak ditemukan
    const theme = FSM_STATE_THEMES[status] || FSM_STATE_THEMES[FSM_STATES.IDLE];
    const isAnimated = theme.animated;

    return (
        <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${theme.badge}`}
        role="status"
        aria-label={`Status: ${capitalize(status)}`}
        >
        {isAnimated ? (
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
        ) : (
            <span className={`inline-block h-2 w-2 rounded-full ${theme.dot}`}></span>
        )}
            {capitalize(status)}
        </span>
    );
};

export default StatusBadge;