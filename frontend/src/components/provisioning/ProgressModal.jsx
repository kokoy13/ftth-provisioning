import { useState, useEffect, useRef } from "react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

const PROVISIONING_STEPS = [
  "🔌 Connecting to MikroTik...",
  "📡 Creating PPPoE secret on MikroTik...",
  "🔗 Connecting to OLT...",
  "⚙️",
  "📨 Sending Telegram notification...",
  "✅ Completed",
];

const ProgressModal = ({ isOpen, provisioningId, onComplete }) => {
  const [step, setStep] = useState("Queued");
  const [status, setStatus] = useState("PENDING");
  const [error, setError] = useState("");
  const pollRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !provisioningId) return;

    setStep("Queued");
    setStatus("PENDING");
    setError("");

    const poll = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://127.0.0.1:5001/api/provisioning/${provisioningId}/progress`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch progress");
        const data = await res.json();

        setStep(data.step || "Queued");
        setStatus(data.status);

        if (data.status === "ACTIVE" || data.status === "FAILED") {
          clearInterval(pollRef.current);
          if (data.status === "FAILED") {
            setError(data.errorMessage || "Provisioning failed");
          }
          if (onComplete) onComplete(data.status);
        }
      } catch (err) {
        console.error("Poll error:", err);
      }
    };

    // Poll every 1.5 seconds
    poll();
    pollRef.current = setInterval(poll, 1500);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [isOpen, provisioningId]);

  if (!isOpen) return null;

  const isDone = status === "ACTIVE";
  const isFailed = status === "FAILED";
  const isCurrent = (s) => step.startsWith(s.replace("⚙️", "").trim()) || step.includes(s.replace("⚙️", "").trim());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            {isDone ? (
              <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
            ) : isFailed ? (
              <div className="h-12 w-12 rounded-full bg-rose-100 flex items-center justify-center">
                <XCircle className="h-6 w-6 text-rose-600" />
              </div>
            ) : (
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
              </div>
            )}
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            {isDone ? "Provisioning Complete" : isFailed ? "Provisioning Failed" : "Provisioning in Progress"}
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            {isDone
              ? "All steps completed successfully."
              : isFailed
              ? error || "An error occurred"
              : "Please wait while we configure your service..."}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="space-y-3">
          {PROVISIONING_STEPS.map((s, i) => {
            const isActive = isCurrent(s) && !isDone && !isFailed;
            const isPastStep = PROVISIONING_STEPS.indexOf(
              PROVISIONING_STEPS.find((ps) => isCurrent(ps)) || step
            ) > i;
            const done = isPastStep || (isDone && i < PROVISIONING_STEPS.length - 1) || (isDone && s === "✅ Completed");

            // Skip showing if step is an ⚙️ command variant
            if (s === "⚙️") return null;

            return (
              <div key={i} className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {isFailed && isActive ? (
                    <XCircle className="h-5 w-5 text-rose-500" />
                  ) : done || (isDone && s === "✅ Completed") ? (
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                  ) : isActive ? (
                    <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                  ) : isFailed && !isActive ? (
                    <div className="h-5 w-5 rounded-full border-2 border-slate-300" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-slate-300" />
                  )}
                </div>
                <span
                  className={`text-sm ${
                    done || (isDone && s === "✅ Completed")
                      ? "text-emerald-700 font-medium"
                      : isActive
                      ? "text-blue-700 font-medium"
                      : "text-slate-400"
                  }`}
                >
                  {s}
                </span>
              </div>
            );
          })}
        </div>

        {/* Current action */}
        {!isDone && !isFailed && (
          <div className="mt-4 p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 font-mono truncate">
              {step}
            </p>
          </div>
        )}

        {/* Close button */}
        {(isDone || isFailed) && (
          <button
            onClick={onComplete}
            className="mt-4 w-full py-2.5 bg-gray-900 hover:bg-gray-950 text-white font-medium rounded-lg text-sm transition-colors"
          >
            {isDone ? "Done" : "Close"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProgressModal;
