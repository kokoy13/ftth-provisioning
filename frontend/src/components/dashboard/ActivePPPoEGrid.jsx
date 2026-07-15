import StatusBadge from "../ui/StatusBadge";

const ActivePPPoEGrid = ({ sessions = [] }) => {
    // Handle if sessions is empty or undefined
    if (sessions.length === 0) {
        return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-medium text-slate-700 mb-4">Active PPPoE Sessions</h3>
            <p className="text-sm text-slate-400 text-center py-8">No active sessions found.</p>
        </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
                <h3 className="text-lg font-medium text-slate-700">Active PPPoE Sessions</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                        <tr>
                        <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider text-xs">
                            Customer
                        </th>
                        <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider text-xs">
                            Username
                        </th>
                        <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider text-xs">
                            IP Address
                        </th>
                        <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider text-xs">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider text-xs">
                            Uptime
                        </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {sessions.map((session, index) => (
                            <tr key={session.id || index} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-3 font-medium text-slate-800">{session.customer}</td>
                                <td className="px-6 py-3 text-slate-600">{session.username}</td>
                                <td className="px-6 py-3 text-slate-600 font-mono">{session.ipAddress}</td>
                                <td className="px-6 py-3">
                                    <StatusBadge status={session.status || "ACTIVE"} />
                                </td>
                                <td className="px-6 py-3 text-slate-600">{session.uptime || "—"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ActivePPPoEGrid;
