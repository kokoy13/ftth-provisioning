import { Eye, Trash2 } from "lucide-react";
import StatusBadge from "../ui/StatusBadge";
import RetryProvisioningButton from "./RetryProvisioningButton";
import RoleGuard from "../middleware/RoleGuard";

// ─── KONSTANTA LOKAL ─────────────────────────────────────────────
const FSM_STATES = {
  FAILED: "FAILED",
  // Status lain tidak diperlukan di file ini karena StatusBadge sudah mandiri
};

const ROLES = {
  SUPER_ADMIN: "admin",
};

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
 * Main data table for provisioning records.
 */
const ProvisioningTable = ({ records, onView, onDelete, onRetry }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider text-xs">
              #
            </th>
            <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider text-xs">
              Customer
            </th>
            <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider text-xs">
              PPPoE User
            </th>
            <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider text-xs">
              ONU No
            </th>
            <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider text-xs">
              OLT Port
            </th>
            <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider text-xs">
              Status
            </th>
            <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider text-xs">
              Updated
            </th>
            <th className="px-6 py-3 text-right font-medium text-slate-500 uppercase tracking-wider text-xs">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {records.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                No provisioning records found.
              </td>
            </tr>
          ) : (
            records.map((record, index) => (
              <tr
                key={record.id || index}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-3 text-slate-400 font-mono text-xs">{index + 1}</td>
                <td className="px-6 py-3 font-medium text-slate-800">{record.customerName}</td>
                <td className="px-6 py-3 text-slate-600 font-mono">{record.customerUsername}</td>
                <td className="px-6 py-3 text-slate-600 font-mono">{record.onuNumber || "—"}</td>
                <td className="px-6 py-3 text-slate-600">{record.oltPort}</td>
                <td className="px-6 py-3">
                  <StatusBadge status={record.status} />
                </td>
                <td className="px-6 py-3 text-slate-500 text-xs">{formatDate(record.updatedAt)}</td>
                <td className="px-6 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {/* View button — all roles */}
                    <button
                      onClick={() => onView(record)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-xs font-medium"
                      title="View Details"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </button>

                    {/* Retry button — only for FAILED records */}
                    {record.status === FSM_STATES.FAILED && (
                      <RetryProvisioningButton recordId={record.id} onRetry={onRetry} />
                    )}

                    {/* Delete button — Super Admin only */}
                    <RoleGuard roles={[ROLES.SUPER_ADMIN]}>
                      <button
                        onClick={() => onDelete(record.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-xs font-medium"
                        title="Delete Record"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </RoleGuard>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProvisioningTable;