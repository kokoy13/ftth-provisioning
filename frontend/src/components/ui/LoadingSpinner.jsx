import { Loader2 } from "lucide-react";

/**
 * Loading spinner component.
 * @param {boolean} fullPage - If true, renders a full-page centered spinner.
 * @param {string} size - Icon size class ("sm", "md", "lg").
 */
const LoadingSpinner = ({ fullPage = false, size = "md" }) => {
    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-8 w-8",
        lg: "h-12 w-12",
    };

    const spinner = (
        <Loader2 className={`animate-spin text-blue-600 ${sizeClasses[size]}`} aria-label="Loading" />
    );

    if (fullPage) {
        return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-3">
            {spinner}
            <p className="text-sm text-slate-500">Loading…</p>
            </div>
        </div>
        );
    }

    return (
        <div className="flex items-center justify-center py-8">
        <div className="flex flex-col items-center gap-2">
            {spinner}
            <p className="text-xs text-slate-400">Loading…</p>
        </div>
        </div>
    );
};

export default LoadingSpinner;
