const MetricCard = ({ title, value, icon: Icon, theme }) => {
    const defaultTheme = {
        bg: "bg-white",
        border: "border-slate-200",
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
        valueColor: "text-slate-800",
    };

    const t = { ...defaultTheme, ...theme };

    return (
        <div className={`${t.bg} rounded-xl shadow-sm border ${t.border} p-6 flex items-start justify-between`}>
            <div className="flex flex-col gap-1">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
                <p className={`text-2xl font-bold ${t.valueColor}`}>{value ?? "—"}</p>
            </div>
            {Icon && (
                <div className={`h-10 w-10 rounded-lg ${t.iconBg} flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${t.iconColor}`} />
                </div>
            )}
        </div>
    );
};

export default MetricCard;
