import { useState } from "react";
import { Loader2 } from "lucide-react";
import Modal from "../ui/Modal";
import Alert from "../ui/Alert";

const CreateProvisioningModal = ({ isOpen, onClose, onSubmit }) => {
  //DATA FORM STATE
  const [formData, setFormData] = useState({
    customerName: "",
    customerUsername: "",
    pppoePassword: "",
    oltPort: "",
    serialNumber: "",
    profile: "",
    onuNumber: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await onSubmit(formData);
      setFormData({ customerName: "", customerUsername: "", pppoePassword: "", oltPort: "", serialNumber: "", profile: "", onuNumber: "" });
      onClose();
    } catch (err) {
      setError(err.message || "Failed to create provisioning record.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Provisioning" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert type="error" message={error} />}

        {/* Customer Name */}
        <div>
          <label htmlFor="customerName" className="block text-sm font-medium text-slate-700 mb-1">
            Customer Name <span className="text-rose-500">*</span>
          </label>
          <input
            id="customerName"
            name="customerName"
            type="text"
            value={formData.customerName}
            onChange={handleChange}
            required
            placeholder="John Doe"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        {/* PPPoE Username */}
        <div>
          <label htmlFor="customerUsername" className="block text-sm font-medium text-slate-700 mb-1">
            PPPoE Username <span className="text-rose-500">*</span>
          </label>
          <input
            id="customerUsername"
            name="customerUsername"
            type="text"
            value={formData.customerUsername}
            onChange={handleChange}
            required
            placeholder="user_pppoe01"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        {/* PPPoE Password */}
        <div>
          <label htmlFor="pppoePassword" className="block text-sm font-medium text-slate-700 mb-1">
            PPPoE Password <span className="text-rose-500">*</span>
          </label>
          <input
            id="pppoePassword"
            name="pppoePassword"
            type="text"
            value={formData.pppoePassword}
            onChange={handleChange}
            required
            placeholder="••••••••"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        {/* OLT Port */}
        <div>
          <label htmlFor="oltPort" className="block text-sm font-medium text-slate-700 mb-1">
            OLT Port <span className="text-rose-500">*</span>
          </label>
          <input
            id="oltPort"
            name="oltPort"
            type="text"
            value={formData.oltPort}
            onChange={handleChange}
            required
            placeholder="1/1/1"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        {/* ONU Number */}
        <div>
          <label htmlFor="onuNumber" className="block text-sm font-medium text-slate-700 mb-1">
            ONU Number <span className="text-rose-500">*</span>
          </label>
          <input
            id="onuNumber"
            name="onuNumber"
            type="number"
            value={formData.onuNumber}
            onChange={handleChange}
            required
            placeholder="1"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        {/* ONU Serial Number */}
        <div>
          <label htmlFor="serialNumber" className="block text-sm font-medium text-slate-700 mb-1">
            ONU Serial Number
          </label>
          <input
            id="serialNumber"
            name="serialNumber"
            type="text"
            value={formData.serialNumber}
            onChange={handleChange}
            placeholder="ZTEGXXXXXXXX"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        {/* Profile */}
        <div>
          <label htmlFor="profile" className="block text-sm font-medium text-slate-700 mb-1">
            Service Profile
          </label>
          <select
            id="profile"
            name="profile"
            value={formData.profile}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-700 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="">Select Profile</option>
            <option value="10Mbps">10 Mbps</option>
            <option value="20Mbps">20 Mbps</option>
            <option value="50Mbps">50 Mbps</option>
            <option value="100Mbps">100 Mbps</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg border border-slate-300 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-gray-900 hover:bg-gray-950 text-white font-medium rounded-lg shadow-sm transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating…
              </>
            ) : (
              "Create Record"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProvisioningModal;
