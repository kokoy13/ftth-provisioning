import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Wifi, Users, AlertTriangle, LogOut, X, User } from "lucide-react";
import { useAuth } from "../../AuthContext";

const SAMPLE_ALERTS = [
  { id: 1, text: "ONU ZTEGCA123456 is offline", time: "2m ago", type: "error" },
  { id: 2, text: "PPPoE session timeout for user_pppoe01", time: "5m ago", type: "warning" },
  { id: 3, text: "Bandwidth usage above 90% on port GPON 0/1/1", time: "12m ago", type: "warning" },
  { id: 4, text: "New provisioning request for John Doe", time: "30m ago", type: "info" },
  { id: 5, text: "Suspended ONU reactivated successfully", time: "1h ago", type: "success" },
];

const alertStyles = {
  error: "border-l-rose-500 bg-rose-50",
  warning: "border-l-amber-500 bg-amber-50",
  info: "border-l-blue-500 bg-blue-50",
  success: "border-l-emerald-500 bg-emerald-50",
};

const Header = () =>{
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [hasAlerts, setHasAlerts] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const bellRef = useRef(null);
    const userMenuRef = useRef(null);

    // Click outside to close dropdowns
    useEffect(() => {
        const handleClick = (e) => {
            if (showDropdown && bellRef.current && !bellRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
            if (showUserMenu && userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [showDropdown, showUserMenu]);

    const initial = user?.fullName
        ? user.fullName.charAt(0).toUpperCase()
        : user?.username
        ? user.username.charAt(0).toUpperCase()
        : "U";

    return(
        <header className="sticky top-0 z-40 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
            {/* Center: Status Counters */}
            <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Users className="h-3.5 w-3.5 text-emerald-500" />
                    <span>PPPoE Active</span>
                    <span className="font-semibold text-emerald-700">—</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Wifi className="h-3.5 w-3.5 text-blue-500" />
                    <span>ONUs Online</span>
                    <span className="font-semibold text-blue-700">—</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                    <span>Alerts</span>
                    <span className="font-semibold text-amber-700">0</span>
                </div>
            </div>

            {/* Right: User Info + Actions */}
            <div className="flex items-center gap-3">
                {/* Notification Bell */}
                <div className="relative" ref={bellRef}>
                    <button
                        onClick={() => setShowDropdown((prev) => !prev)}
                        className="relative h-9 w-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        aria-label="Notifications"
                    >
                        <Bell className="h-5 w-5" />
                        {hasAlerts && (
                            <span className="absolute top-1 right-1 h-2 w-2 bg-rose-500 rounded-full"></span>
                        )}
                    </button>

                    {/* Dropdown */}
                    {showDropdown && (
                        <div
                            className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
                        >
                            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                                <span className="text-sm font-semibold text-slate-800">Notifications</span>
                                {hasAlerts && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setHasAlerts(false); }}
                                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>
                            <div className="max-h-72 overflow-y-auto">
                                {hasAlerts ? (
                                    SAMPLE_ALERTS.map((alert) => (
                                        <div
                                            key={alert.id}
                                            className={`px-4 py-3 border-l-4 ${alertStyles[alert.type]} border-b border-slate-100 last:border-b-0`}
                                        >
                                            <p className="text-xs text-slate-700 leading-relaxed">{alert.text}</p>
                                            <p className="text-xs text-slate-400 mt-0.5">{alert.time}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-8 text-center text-sm text-slate-400">
                                        No new notifications.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* User Info + Logout Dropdown */}
                <div className="relative" ref={userMenuRef}>
                    <button
                        onClick={() => setShowUserMenu((prev) => !prev)}
                        className="flex items-center gap-2 pr-2 py-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                            {initial}
                        </div>
                        <div className="hidden sm:block text-left">
                            <p className="text-sm font-medium text-slate-700 leading-tight">
                                {user?.fullName || user?.username || "User"}
                            </p>
                            <p className="text-xs text-slate-400 leading-tight">
                                {user?.role || "Unknown"}
                            </p>
                        </div>
                    </button>

                    {showUserMenu && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
                            <button
                                onClick={() => { setShowUserMenu(false); navigate("/profile"); }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-100"
                            >
                                <User className="h-4 w-4" />
                                Profile
                            </button>
                            <button
                                onClick={logout}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header;