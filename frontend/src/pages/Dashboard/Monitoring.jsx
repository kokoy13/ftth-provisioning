import { useState, useEffect, useRef, useCallback } from "react";
import { Pause, Play, Users } from "lucide-react";

import LoadingSpinner from "../../components/ui/LoadingSpinner";
import BandwidthLineChart from "../../components/monitoring/BandwidthLineChart";
import ActiveUsersTable from "../../components/monitoring/ActiveUsersTable";
import QuickStats from "../../components/monitoring/QuickStats";
import DashboardLayout from "../../components/layouts/DashboardLayout";

const BASE_URL = "http://127.0.0.1:5001/api";
const BANDWIDTH_POLL_INTERVAL_MS = 5000;
const BANDWIDTH_HISTORY_LENGTH = 30;

/**
 * Network Monitoring Hub — Real-time bandwidth traffic and active connections.
 */
const Monitoring = () => {
  // ─── STATE MANAJEMEN ─────────────────────────────────────────────
  const [bandwidth, setBandwidth] = useState({ labels: [], inbound: [], outbound: [] });
  const [activeUsers, setActiveUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPolling, setIsPolling] = useState(true);
  
  const intervalRef = useRef(null);

  // ─── FUNGSI API ──────────────────────────────────────────────────

  // 1. Ambil data Active Users
  const fetchActiveUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/monitoring/active-users`, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setActiveUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  // 2. Ambil data Bandwidth secara real-time
  const fetchBandwidthPoint = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/monitoring/bandwidth`, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const data = await res.json();
      setBandwidth((prev) => ({
        labels: [...prev.labels, data.timestamp || new Date().toLocaleTimeString()].slice(-BANDWIDTH_HISTORY_LENGTH),
        inbound: [...prev.inbound, data.inboundMbps || 0].slice(-BANDWIDTH_HISTORY_LENGTH),
        outbound: [...prev.outbound, data.outboundMbps || 0].slice(-BANDWIDTH_HISTORY_LENGTH),
      }));
    } catch (err) {
      setError(err.message);
    }
  }, []);

  // ─── KENDALI POLLING ─────────────────────────────────────────────
  const startPolling = useCallback(() => setIsPolling(true), []);
  const stopPolling = useCallback(() => setIsPolling(false), []);

  // ─── EFEK (Lifecycle) ────────────────────────────────────────────

  // Efek untuk menjalankan dan menghentikan polling bandwidth
  useEffect(() => {
    if (!isPolling) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    const poll = async () => {
      setIsLoading(true);
      await fetchBandwidthPoint();
      setIsLoading(false);
    };

    poll(); // Ambil data saat pertama kali jalan
    intervalRef.current = setInterval(fetchBandwidthPoint, BANDWIDTH_POLL_INTERVAL_MS);

    return () => clearInterval(intervalRef.current);
  }, [isPolling, fetchBandwidthPoint]);

  // Efek untuk memuat Active Users saat halaman pertama dibuka
  useEffect(() => {
    fetchActiveUsers();
  }, [fetchActiveUsers]);

  // ─── RENDER UI ───────────────────────────────────────────────────
  return (
    <DashboardLayout>
        <div className="space-y-6">
      {/* Page Title + Polling Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Network Monitoring</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time bandwidth traffic and active connections.</p>
        </div>
        <button
          onClick={isPolling ? stopPolling : startPolling}
          className={`inline-flex items-center gap-2 px-4 py-2 font-medium rounded-lg shadow-sm transition-colors text-sm ${
            isPolling
              ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
              : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
          }`}
        >
          {isPolling ? (
            <>
              <Pause className="h-4 w-4" />
              Pause Live
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Resume Live
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      {/* Bandwidth Line Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Bandwidth Traffic</h2>
          {isPolling && (
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Live
            </span>
          )}
        </div>
        {isLoading && bandwidth.labels.length === 0 ? (
          <LoadingSpinner />
        ) : (
          <BandwidthLineChart data={bandwidth} />
        )}
      </div>

      {/* Active Users Table + Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Users Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-slate-800">Active Connections</h2>
            <span className="ml-auto inline-flex items-center justify-center h-6 px-2 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
              {activeUsers.length} online
            </span>
          </div>
          <ActiveUsersTable users={activeUsers} />
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Stats</h2>
          <QuickStats activeCount={activeUsers.length} />
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default Monitoring;