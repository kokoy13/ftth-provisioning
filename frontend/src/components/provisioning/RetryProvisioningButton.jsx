import { useState } from "react";
import { RotateCcw, Loader2 } from "lucide-react";

const RetryProvisioningButton = ({ recordId, onRetry }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        setIsLoading(true);
        try {
        await onRetry(recordId);
        } finally {
        setIsLoading(false);
        }
    };

    return (
        <button
        onClick={handleClick}
        disabled={isLoading}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Retry Provisioning"
        >
        {isLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
            <RotateCcw className="h-3.5 w-3.5" />
        )}
        Retry
        </button>
    );
};

export default RetryProvisioningButton;
