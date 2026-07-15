import { X } from "lucide-react";
import StatusBadge from "../ui/StatusBadge";

// ─── FUNGSI HELPER LOKAL ─────────────────────────────────────────
const formatDate = (isoString) => {
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

/**
 * Slide-out detail panel for a provisioning record.
 */
const ProvisioningDetailDrawer = ({ record, isOpen, onClose }) => {
  if (!isOpen || !record) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm cursor-pointer" onClick={onClose}></div>

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white shadow-2xl h-full overflow-y-auto animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-slate-800">Record Details</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Close drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Status</span>
            <StatusBadge status={record.status} />
          </div>

          {/* Customer Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Customer Information</h3>
            <div className="space-y-2">
              <DetailRow label="Name" value={record.customerName} />
              <DetailRow label="PPPoE Username" value={record.customerUsername} />
            </div>
          </div>

          {/* Network Config */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Network Configuration</h3>
            <div className="space-y-2">
              <DetailRow label="OLT Port" value={record.oltPort} />
              <DetailRow label="ONU Serial" value={record.serialNumber} />
              <DetailRow label="Profile" value={record.profile} />
              <DetailRow label="IP Address" value={record.ipAddress} />
            </div>
          </div>

          {/* Timestamps */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Timestamps</h3>
            <div className="space-y-2">
              <DetailRow label="Created" value={formatDate(record.createdAt)} />
              <DetailRow label="Updated" value={formatDate(record.updatedAt)} />
            </div>
          </div>

          {/* Error Message (if FAILED) */}
          {record.status === "FAILED" && record.errorMessage && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Error Details</h3>
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
                <p className="text-sm text-rose-800">{record.errorMessage}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4">
    <span className="text-sm text-slate-500 flex-shrink-0">{label}</span>
    <span className="text-sm font-medium text-slate-800 text-right break-all">{value || "—"}</span>
  </div>
);

export default ProvisioningDetailDrawer;