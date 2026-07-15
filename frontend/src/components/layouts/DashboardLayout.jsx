import { NavLink} from "react-router-dom";
import Sidebar from "../dashboard/Sidebar";
import Header from "../dashboard/Header";

const DashboardLayout = ({children}) => {
    return (
        <div className="flex h-screen bg-slate-50">
            {/* ── Sidebar ── */}
            <Sidebar/>

            {/* ── Main Content ── */}
            <div
                className={`flex-1 flex flex-col transition-all duration-300 ml-60`}
            >
                {/* ── Top Header (Sticky) ── */}
                <Header/>

                {/* ── Page Content ── */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;
