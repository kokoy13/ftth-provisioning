import LogLevelBadge from "./LogLevelBadge";
import { formatDate } from "../../helpers";

/**
 * Main audit log data table.
 */
const AuditLogTable = ({ logs }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider text-xs">
              Timestamp
            </th>
            <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider text-xs">
              Level
            </th>
            <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider text-xs">
              Event
            </th>
            <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider text-xs">
              Actor
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {logs.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                No audit logs found.
              </td>
            </tr>
          ) : (
            logs.map((log, index) => (
              <tr key={log.id || index} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-3 text-slate-500 text-xs font-mono whitespace-nowrap">
                  {formatDate(log.timestamp)}
                </td>
                <td className="px-6 py-3">
                  <LogLevelBadge level={log.level} />
                </td>
                <td className="px-6 py-3 text-slate-700 max-w-md truncate">{log.message}</td>
                <td className="px-6 py-3 text-slate-500 text-xs">{log.actor || "System"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLogTable;
