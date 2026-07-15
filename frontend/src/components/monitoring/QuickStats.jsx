import { Users, Wifi, Activity, Clock } from "lucide-react";

/**
 * Quick stats panel for monitoring page.
 */
const QuickStats = ({ activeCount = 0 }) => {
  const stats = [
    {
      label: "Active Connections",
      value: activeCount,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Total Bandwidth",
      value: `${(Math.random() * 300 + 100).toFixed(0)} Mbps`,
      icon: Activity,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Avg Inbound",
      value: `${(Math.random() * 150 + 50).toFixed(0)} Mbps`,
      icon: Wifi,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Status",
      value: activeCount > 0 ? "Stable" : "Idle",
      icon: Clock,
      color: activeCount > 0 ? "text-emerald-600" : "text-slate-400",
      bg: activeCount > 0 ? "bg-emerald-50" : "bg-slate-50",
    },
  ];

  return (
    <div className="space-y-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`h-8 w-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <span className="text-sm text-slate-600">{stat.label}</span>
            </div>
            <span className="text-sm font-bold text-slate-800">{stat.value}</span>
          </div>
        );
      })}
    </div>
  );
};

export default QuickStats;
