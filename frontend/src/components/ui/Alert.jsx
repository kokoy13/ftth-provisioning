import { CheckCircle, AlertTriangle, XCircle, Info, X } from "lucide-react";
import { useState } from "react";

const typeConfig = {
    success: {
        icon: CheckCircle,
        classes: "bg-emerald-50 border-emerald-200 text-emerald-800",
        iconColor: "text-emerald-500",
    },
    error: {
        icon: XCircle,
        classes: "bg-rose-50 border-rose-200 text-rose-800",
        iconColor: "text-rose-500",
    },
    warning: {
        icon: AlertTriangle,
        classes: "bg-amber-50 border-amber-200 text-amber-800",
        iconColor: "text-amber-500",
    },
    info: {
        icon: Info,
        classes: "bg-blue-50 border-blue-200 text-blue-800",
        iconColor: "text-blue-500",
    },
};

/**
 * Alert / Toast notification component.
 */
const Alert = ({ type = "info", message, dismissible = true, onDismiss }) => {
    const [visible, setVisible] = useState(true);
    const config = typeConfig[type] || typeConfig.info;
    const Icon = config.icon;

    if (!visible) return null;

    const handleDismiss = () => {
        setVisible(false);
        if (onDismiss) onDismiss();
    };

    return (
        <div
        className={`flex items-start gap-3 p-4 rounded-lg border ${config.classes}`}
        role="alert"
        >
        <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${config.iconColor}`} />
        <p className="text-sm flex-1">{message}</p>
        {dismissible && (
            <button
            onClick={handleDismiss}
            className="flex-shrink-0 h-5 w-5 text-current opacity-50 hover:opacity-80 transition-opacity"
            aria-label="Dismiss"
            >
            <X className="h-4 w-4" />
            </button>
        )}
        </div>
    );
};

export default Alert;
