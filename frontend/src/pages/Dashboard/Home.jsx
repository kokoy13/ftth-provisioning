import { useEffect, useState } from "react";
import { Users, Wifi, AlertTriangle, BellRing } from "lucide-react";

import LoadingSpinner from "../../components/ui/LoadingSpinner";
import MetricCard from "../../components/dashboard/MetricCard";
import ActivePPPoEGrid from "../../components/dashboard/ActivePPPoEGrid";
import RecentActivityFeed from "../../components/dashboard/RecentActivityFeed";
import DashboardLayout from "../../components/layouts/DashboardLayout";

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem("token");
                const headers = {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                };

                const fetchData = async (endpoint) => {
                    try {
                        const response = await fetch(`http://127.0.0.1:5001/api${endpoint}`, { headers });
                        if (!response.ok) return null;
                        return await response.json();
                    } catch {
                        return null;
                    }
                };

                const [statsData, sessionsData, activityData] = await Promise.all([
                    fetchData("/dashboard/stats"),
                    fetchData("/dashboard/active-pppoe"),
                    fetchData("/dashboard/recent-activity"),
                ]);
                console.log(statsData);

                setStats(statsData);
                setSessions(sessionsData?.data || sessionsData?.records || []);
                setActivities(activityData?.data || activityData?.records || []);

            } catch (err) {
                setError(err.message || "Terjadi kesalahan saat memuat data dashboard.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (isLoading) return <LoadingSpinner />;

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Page Title */}
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                    <p className="text-sm text-slate-500 mt-1">System health overview and active sessions.</p>
                </div>

                {error && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-lg p-4 text-sm">
                    {error}
                    </div>
                )}

                {/* Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    <MetricCard
                        title="Active PPPoE"
                        value={stats?.activePPPoE ?? 0}
                        icon={Users}
                        theme={{
                            bg: "bg-emerald-50",
                            border: "border-emerald-200",
                            iconBg: "bg-emerald-100",
                            iconColor: "text-emerald-700",
                            valueColor: "text-emerald-700",
                    }}
                    />
                    <MetricCard
                        title="ONUs Online"
                        value={stats?.onlineOnus ?? 0}
                        icon={Wifi}
                        theme={{
                            bg: "bg-blue-50",
                            border: "border-blue-200",
                            iconBg: "bg-blue-100",
                            iconColor: "text-blue-700",
                            valueColor: "text-blue-700",
                    }}
                    />
                    <MetricCard
                        title="Suspended"
                        value={stats?.suspended ?? 0}
                        icon={AlertTriangle}
                        theme={{
                            bg: "bg-orange-50",
                            border: "border-orange-200",
                            iconBg: "bg-orange-100",
                            iconColor: "text-orange-700",
                            valueColor: "text-orange-700",
                        }}
                    />
                    <MetricCard
                        title="Alerts"
                        value={stats?.alerts ?? 0}
                        icon={BellRing}
                        theme={{
                            bg: "bg-rose-50",
                            border: "border-rose-200",
                            iconBg: "bg-rose-100",
                            iconColor: "text-rose-700",
                            valueColor: "text-rose-700",
                        }}
                    />
                </div>  

                {/* Active PPPoE Grid + Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <ActivePPPoEGrid sessions={sessions} />
                    </div>
                    <div>
                        <RecentActivityFeed activities={activities} />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;