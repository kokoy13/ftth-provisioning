import { useState, useEffect, useCallback } from "react";

import LoadingSpinner from "../../components/ui/LoadingSpinner";
import PaginationControls from "../../components/ui/PaginationControls";
import LogSearchBar from "../../components/logs/LogSearchBar";
import LevelFilter from "../../components/logs/LevelFilter";
import AuditLogTable from "../../components/logs/AuditLogTable";
import DashboardLayout from "../../components/layouts/DashboardLayout";

const BASE_URL = "http://127.0.0.1:5001/api";
const DEFAULT_PAGE_SIZE = 10; // Variabel lokal sebagai pengganti constant

/**
 * System Audit Logs Dashboard — chronological, searchable event logs.
 * Super Admin only.
 */
const Log = () => {
  const [logs, setLogs] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      params.append("page", currentPage);
      params.append("limit", DEFAULT_PAGE_SIZE);
      if (searchQuery) params.append("search", searchQuery);
      if (levelFilter) params.append("level", levelFilter);

      // Endpoint langsung ditulis di sini
      const res = await fetch(`${BASE_URL}/audit-logs?${params}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(err.message || `HTTP ${res.status}`);
      }
      
      const data = await res.json();
      setLogs(data.records || data.data || []);
      setTotalItems(data.total || (data.records || data.data || []).length);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, levelFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Reset to page 1 on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, levelFilter]);

  return (
    <DashboardLayout>
        <div className="space-y-6">
            {/* Page Title */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">System Audit Logs</h1>
                <p className="text-sm text-slate-500 mt-1">
                Chronological event logs tracking automated state mutations and user actions.
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <LogSearchBar value={searchQuery} onChange={setSearchQuery} />
                <LevelFilter value={levelFilter} onChange={setLevelFilter} />
            </div>

            {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-lg p-4 text-sm">
                {error}
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {isLoading ? (
                <LoadingSpinner />
                ) : (
                <AuditLogTable logs={logs} />
                )}

                {!isLoading && (
                <div className="px-6 py-4">
                    <PaginationControls
                    currentPage={currentPage}
                    totalItems={totalItems}
                    pageSize={DEFAULT_PAGE_SIZE}
                    onPageChange={setCurrentPage}
                    />
                </div>
                )}
            </div>
        </div>
    </DashboardLayout>
  );
};

export default Log;