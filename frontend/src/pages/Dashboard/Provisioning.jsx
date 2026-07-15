import { useState, useEffect, useCallback } from "react";
import { Plus, FileText, Bot, Terminal, Loader2, ChevronDown, ChevronUp } from "lucide-react";

import LoadingSpinner from "../../components/ui/LoadingSpinner";
import PaginationControls from "../../components/ui/PaginationControls";
import FilterBar from "../../components/provisioning/FilterBar";
import ProvisioningTable from "../../components/provisioning/ProvisioningTable";
import CreateProvisioningModal from "../../components/provisioning/CreateProvisioningModal";
import ProvisioningDetailDrawer from "../../components/provisioning/ProvisioningDetailDrawer";
import ProvisioningChatbot from "../../components/provisioning/ProvisioningChatbot";
import ProgressModal from "../../components/provisioning/ProgressModal";
import DashboardLayout from "../../components/layouts/DashboardLayout";

const PAGE_SIZE = 10;

const Provisioning = () => {

  const [records, setRecords] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [showMethodPicker, setShowMethodPicker] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // OLT Command Test
  const [oltCommand, setOltCommand] = useState("");
  const [oltOutput, setOltOutput] = useState("");
  const [isOltCmdLoading, setIsOltCmdLoading] = useState(false);
  const [showOltTerminal, setShowOltTerminal] = useState(false);

  // Progress Modal
  const [progressId, setProgressId] = useState(null);
  const [showProgress, setShowProgress] = useState(false);

  // FUNCTION FECTH DATA PROVISIONING
  const fetchRecords = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const searchParams = new URLSearchParams();

      //Table Features: Pagination, Search, and Status Filter
      searchParams.append("page", params.page || 1);
      searchParams.append("limit", params.limit || PAGE_SIZE);
      if (params.search) searchParams.append("search", params.search);
      if (params.status) searchParams.append("status", params.status);

      //Fetching data from backend API with query parameters
      const res = await fetch(`http://127.0.0.1:5001/api/provisioning?${searchParams}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const data = await res.json();
      setRecords(data.records || data.data || []);
      setTotalItems(data.total || (data.records || data.data || []).length);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // FUNCTION LOAD DATA PROVISIONING
  const loadRecords = useCallback(() => {
    fetchRecords({
      page: currentPage,
      limit: PAGE_SIZE,
      search: searchQuery || undefined,
      status: statusFilter || undefined,
    });
  }, [fetchRecords, currentPage, searchQuery, statusFilter]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // FUNCTION VIEW DATA PROVISIONING
  const handleView = (record) => {
    setSelectedRecord(record);
    setIsDrawerOpen(true);
  };

  // FUNCTION DELETE DATA PROVISIONING
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this provisioning record?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://127.0.0.1:5001/api/provisioning/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      loadRecords();
    } catch (err) {
      setError("Failed to delete record");
    }
  };

  const handleRetry = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://127.0.0.1:5001/api/provisioning/${id}/retry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      loadRecords();
    } catch (err) {
      setError("Failed to retry provisioning");
    }
  };

  const handleCreate = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:5001/api/provisioning`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(err.message || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setIsCreateModalOpen(false);
      setProgressId(data.id);
      setShowProgress(true);
    } catch (err) {
      setError(err.message || "Failed to create record");
    }
  };

  const handleProgressComplete = () => {
    setShowProgress(false);
    setProgressId(null);
    loadRecords();
  };

  const handleOltCommand = async () => {
    if (!oltCommand.trim()) return;
    setIsOltCmdLoading(true);
    setOltOutput("");
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:5001/api/credentials/olt/command`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ command: oltCommand.trim() }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(err.message || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setOltOutput(data.output || "(no output)");
    } catch (err) {
      setOltOutput(`ERROR: ${err.message}`);
    } finally {
      setIsOltCmdLoading(false);
    }
  };

  return (
    <DashboardLayout>
        <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Provisioning</h1>
          <p className="text-sm text-slate-500 mt-1">Manage customer FTTH provisioning records.</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMethodPicker(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-950 text-white font-medium rounded-lg shadow-sm transition-colors text-sm"
          >
            <Plus className="h-4 w-4" />
            Create
          </button>
        </div>
      </div>

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* OLT Terminal */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <button
          onClick={() => setShowOltTerminal(!showOltTerminal)}
          className="w-full flex items-center justify-between px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-slate-500" />
            OLT Command Terminal
          </span>
          {showOltTerminal ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
        </button>
        {showOltTerminal && (
          <div className="px-6 pb-5 space-y-3 border-t border-slate-100 pt-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={oltCommand}
                onChange={(e) => setOltCommand(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleOltCommand(); }}
                placeholder="Contoh: show run interface gpon-olt_1/1/2"
                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                onClick={handleOltCommand}
                disabled={isOltCmdLoading || !oltCommand.trim()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-950 text-white font-medium rounded-lg text-sm disabled:opacity-50 transition-colors"
              >
                {isOltCmdLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Terminal className="h-4 w-4" />}
                Run
              </button>
            </div>
            {oltOutput && (
              <pre className="bg-slate-900 text-green-400 text-xs font-mono rounded-lg p-4 overflow-x-auto max-h-60 overflow-y-auto whitespace-pre-wrap">
                {oltOutput}
              </pre>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <ProvisioningTable
            records={records}
            onView={handleView}
            onDelete={handleDelete}
            onRetry={handleRetry}
          />
        )}

        {!isLoading && (
          <div className="px-6 py-4">
            <PaginationControls
              currentPage={currentPage}
              totalItems={totalItems}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Method Picker Modal */}
      {showMethodPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 cursor-pointer" onClick={() => setShowMethodPicker(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-1">Pilih Metode</h3>
            <p className="text-sm text-slate-500 mb-5">Bagaimana Anda ingin membuat provisioning?</p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowMethodPicker(false);
                  setIsCreateModalOpen(true);
                }}
                className="w-full flex items-center gap-4 px-5 py-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
              >
                <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Form</p>
                  <p className="text-xs text-slate-500">Isi data melalui formulir</p>
                </div>
              </button>
              <button
                onClick={() => {
                  setShowMethodPicker(false);
                  setIsChatbotOpen(true);
                }}
                className="w-full flex items-center gap-4 px-5 py-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all text-left"
              >
                <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Chatbot</p>
                  <p className="text-xs text-slate-500">Dipandu percakapan</p>
                </div>
              </button>
            </div>
            <button
              onClick={() => setShowMethodPicker(false)}
              className="mt-4 w-full py-2.5 text-sm text-slate-500 hover:text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      <CreateProvisioningModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreate}
      />

      <ProvisioningDetailDrawer
        record={selectedRecord}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedRecord(null);
        }}
      />

      <ProvisioningChatbot
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        onSubmit={handleCreate}
      />

      <ProgressModal
        isOpen={showProgress}
        provisioningId={progressId}
        onComplete={handleProgressComplete}
      />
    </div>
    </DashboardLayout>
  );
};

export default Provisioning;