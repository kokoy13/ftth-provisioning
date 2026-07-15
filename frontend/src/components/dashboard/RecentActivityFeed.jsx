import { Clock } from "lucide-react";

const RecentActivityFeed = ({ activities = [] }) => {
    const levelColors = {
        INFO: "text-blue-600 bg-blue-50",
        SUCCESS: "text-emerald-600 bg-emerald-50",
        WARNING: "text-amber-600 bg-amber-50",
        ERROR: "text-rose-600 bg-rose-50",
    };

    const formatTimestamp = (isoString) => {
        if (!isoString) return "—";
        return new Date(isoString).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-medium text-slate-700 mb-4">Recent Activity</h3>

            {activities.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">No recent activity.</p>
            ) : (
                <ul className="space-y-3 max-h-80 overflow-y-auto">
                    {activities.map((activity, index) => (
                        <li
                            key={activity.id || index}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            <div
                                className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                                    levelColors[activity.level] || levelColors.INFO
                                }`}
                            >
                                <Clock className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-slate-700 truncate">{activity.message}</p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    {formatTimestamp(activity.timestamp)}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default RecentActivityFeed;