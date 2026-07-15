import { useState, useEffect, useRef, useCallback } from "react";
import { Activity, Wifi, X, Loader2 } from "lucide-react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const BASE_URL = "http://127.0.0.1:5001/api";
const HISTORY_LENGTH = 20;
const POLL_INTERVAL = 3000;

const formatUptime = (createdAt) => {
  const diffMs = Date.now() - new Date(createdAt).getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffHrs >= 24) {
    const days = Math.floor(diffHrs / 24);
    return `${days}d ${diffHrs % 24}h`;
  }
  if (diffHrs > 0) return `${diffHrs}h ${diffMins}m`;
  return `${diffMins}m`;
};

/**
 * Table of active connection users with click-to-view real-time traffic.
 */
const ActiveUsersTable = ({ users }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [traffic, setTraffic] = useState({ labels: [], inbound: [], outbound: [] });
  const [isPolling, setIsPolling] = useState(false);
  const intervalRef = useRef(null);

  const fetchUserBandwidth = useCallback(async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/monitoring/user-bandwidth/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (!res.ok) return;
      const data = await res.json();
      setTraffic((prev) => ({
        labels: [...prev.labels, data.timestamp || new Date().toLocaleTimeString()].slice(-HISTORY_LENGTH),
        inbound: [...prev.inbound, data.inboundMbps || 0].slice(-HISTORY_LENGTH),
        outbound: [...prev.outbound, data.outboundMbps || 0].slice(-HISTORY_LENGTH),
      }));
    } catch {
      // silent
    }
  }, []);

  const handleSelectUser = (user) => {
    if (selectedUser?.id === user.id) return;
    setSelectedUser(user);
    setTraffic({ labels: [], inbound: [], outbound: [] });
    setIsPolling(true);
  };

  const handleCloseTraffic = () => {
    setSelectedUser(null);
    setTraffic({ labels: [], inbound: [], outbound: [] });
    setIsPolling(false);
  };

  useEffect(() => {
    if (!isPolling || !selectedUser) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    fetchUserBandwidth(selectedUser.id);
    intervalRef.current = setInterval(() => fetchUserBandwidth(selectedUser.id), POLL_INTERVAL);

    return () => clearInterval(intervalRef.current);
  }, [isPolling, selectedUser, fetchUserBandwidth]);

  const chartData = {
    labels: traffic.labels,
    datasets: [
      {
        label: "Inbound (Mbps)",
        data: traffic.inbound,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 1,
        pointHoverRadius: 4,
      },
      {
        label: "Outbound (Mbps)",
        data: traffic.outbound,
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 1,
        pointHoverRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 300 },
    interaction: { mode: "index", intersect: false },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Mbps", font: { size: 11 } }, grid: { color: "rgba(0,0,0,0.04)" } },
      x: { ticks: { maxTicksLimit: 5, font: { size: 10 } }, grid: { display: false } },
    },
    plugins: { legend: { position: "top", labels: { boxWidth: 12, padding: 8, font: { size: 11 } } } },
  };

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-2.5 px-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Customer</th>
              <th className="text-left py-2.5 px-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">PPPoE</th>
              <th className="text-left py-2.5 px-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">OLT Port</th>
              <th className="text-left py-2.5 px-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Profile</th>
              <th className="text-left py-2.5 px-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">IP Address</th>
              <th className="text-center py-2.5 px-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Uptime</th>
              <th className="text-center py-2.5 px-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Traffic</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-slate-400 text-sm">No active connections.</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  className={`border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors ${
                    selectedUser?.id === user.id ? "bg-blue-50 border-l-2 border-l-blue-500" : ""
                  }`}
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <Wifi className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="font-medium text-slate-800">{user.customer_name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-mono text-xs">{user.customer_username}</td>
                  <td className="py-3 px-3 text-slate-600 text-xs">{user.olt_port}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                      {user.profile || "—"}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-mono text-xs">{user.ip_address || "—"}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="text-xs font-medium text-emerald-600">
                      {user.created_at ? formatUptime(user.created_at) : "—"}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    {selectedUser?.id === user.id && isPolling ? (
                      <Activity className="h-4 w-4 text-blue-500 animate-pulse mx-auto" />
                    ) : (
                      <Activity className="h-4 w-4 text-slate-300 mx-auto" />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Traffic Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={handleCloseTraffic} />
          <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{selectedUser.customer_name}</p>
                  <p className="text-xs text-slate-400">{selectedUser.customer_username}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isPolling && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    Live
                  </span>
                )}
                <button
                  onClick={handleCloseTraffic}
                  className="h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="h-4 w-4 text-slate-400" />
                </button>
              </div>
            </div>
            {/* Modal Body: Chart */}
            <div className="h-64 p-5">
              {traffic.labels.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
                </div>
              ) : (
                <Line data={chartData} options={chartOptions} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveUsersTable;
