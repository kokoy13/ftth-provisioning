import { NavLink} from "react-router-dom";
import { useLocation } from "react-router-dom";
import logo from "/img/logo(white).png"
import { LayoutDashboard, ClipboardList, Activity, KeyRound, ScrollText, LogOut, Menu, ChevronLeft, Bell, Wifi, Users, AlertTriangle, UserCog } from "lucide-react";
import { useAuth } from "../../AuthContext";

const Sidebar = ()=> {
    const location = useLocation();
    const { user } = useAuth();
    const isAdmin = user?.role === "admin";

    const navItems = [
        { 
            path: "/dashboard", label: "Dashboard", icon: LayoutDashboard
        },
        { 
            path: "/provisioning", label: "Provisioning", icon: ClipboardList 
        },
        { 
            path: "/monitoring", label: "Monitoring", icon: Activity 
        },
        {
            path: "/credentials",label: "Credentials", icon: KeyRound,
        },
        ...(isAdmin ? [{ path: "/users", label: "Users", icon: UserCog }] : []),
        {
            path: "/logs",label: "Logs", icon: ScrollText,
        },
    ];

    return(
        <aside
            className={`fixed left-0 top-0 h-screen bg-gray-900 text-white transition-all duration-300 z-50 flex flex-col w-60`}
        >
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-700">
                <img src={logo} alt="Logo" className="h-8" />
                <span className="text-sm font-semibold whitespace-nowrap overflow-hidden">
                    FTTH Monitoring
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 overflow-y-auto">
                <ul className="space-y-6 px-2">
                    {navItems
                    .map((item) => {
                        const Icon = item.icon;
                        return (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) => {
                                        const isRootPath = location.pathname === "/" && item.path === "/dashboard";
                                        
                                        const isItemActive = isActive || isRootPath;

                                        return `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                            isItemActive
                                                ? "bg-blue-600/20 text-blue-400 border-l-4 border-blue-500"
                                                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                        }`;
                                    }}
                                    title={item.label}
                                >
                                    <Icon className="h-5 w-5 shrink-0" />
                                    <span>{item.label}</span>
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    )
}

export default Sidebar;