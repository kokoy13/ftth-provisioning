import { useState } from "react";
import { Loader2, CheckCircle, XCircle, Zap } from "lucide-react";

/**
 * Test Connection button — validates credentials against the target device.
 */
const TestConnectionButton = ({ type, onTest }) => {
  const [status, setStatus] = useState(null); // null | "loading" | "success" | "error"
  const [message, setMessage] = useState("");

  const handleClick = async () => {
    setStatus("loading");
    setMessage("");
    try {
      const result = await onTest(type);
      setStatus("success");
      setMessage(result?.message || "Connection successful!");
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "Connection failed.");
    }
  };

  return (
    <div className="flex items-center gap-3">
      {status === "success" && (
        <span className="inline-flex items-center gap-1 text-sm text-emerald-600">
          <CheckCircle className="h-4 w-4" />
          {message}
        </span>
      )}
      {status === "error" && (
        <span className="inline-flex items-center gap-1 text-sm text-rose-600">
          <XCircle className="h-4 w-4" />
          {message}
        </span>
      )}
      <button
        type="button"
        onClick={handleClick}
        disabled={status === "loading"}
        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg border border-slate-300 transition-colors text-sm disabled:opacity-50"
      >
        {status === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Zap className="h-4 w-4" />
        )}
        Test Connection
      </button>
    </div>
  );
};

export default TestConnectionButton;
