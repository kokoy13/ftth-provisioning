import { useState, useEffect } from "react";
import { Server, Network, Send, Loader2 } from "lucide-react";

import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Alert from "../../components/ui/Alert";
import CredentialCard from "../../components/credentials/CredentialCard";
import PasswordField from "../../components/credentials/PasswordField";
import TestConnectionButton from "../../components/credentials/TestConnectionButton";
import DashboardLayout from "../../components/layouts/DashboardLayout";

const BASE_URL = "http://127.0.0.1:5001/api";

const TABS = [
  { key: "mikrotik", label: "MikroTik CCR", icon: Server },
  { key: "olt", label: "ZTE OLT", icon: Network },
  { key: "telegram", label: "Telegram Bot", icon: Send },
];

/**
 * Device Credentials Portal — MikroTik CCR, ZTE OLT, Telegram Bot.
 * Super Admin only.
 */
const Credentials = () => {
  const [activeTab, setActiveTab] = useState("mikrotik");
  const [isLoading, setIsLoading] = useState(true);
  const [savingType, setSavingType] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [mikrotik, setMikrotik] = useState({ host: "", username: "", password: "", port: "8728" });
  const [olt, setOlt] = useState({ host: "", username: "", password: "", port: "22" });
  const [telegram, setTelegram] = useState({ botToken: "", chatId: "" });

  // Load credentials on mount
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/credentials`, {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        
        if (!res.ok) throw new Error("Failed to load credentials");
        
        const data = await res.json();
        if (data.mikrotik) setMikrotik((prev) => ({ ...prev, ...data.mikrotik }));
        if (data.olt) setOlt((prev) => ({ ...prev, ...data.olt }));
        if (data.telegram) setTelegram((prev) => ({ ...prev, ...data.telegram }));
      } catch {
        // Use default empty values
      } finally {
        setIsLoading(false);
      }
    };
    
    load();
  }, []);

  const handleSave = async (type, data) => {
    setSavingType(type);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/credentials/${type}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(err.message || `HTTP ${res.status}`);
      }
      
      setSuccess(`"${type}" credentials saved successfully.`);
    } catch (err) {
      setError(err.message || "Failed to save credentials.");
    } finally {
      setSavingType(null);
    }
  };

  const handleTestConnection = async (type) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/credentials/${type}/test`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message || `HTTP ${res.status}`);
    }
    
    return res.json();
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Device Credentials</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage hardware and service connection credentials.
          </p>
        </div>

        {/* Alerts */}
        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}

        {/* Tabs */}
        <div className="border-b border-slate-200">
          <nav className="flex gap-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? "border-blue-600 text-blue-700"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-2">
          {activeTab === "mikrotik" && (
            <CredentialCard title="MikroTik CCR" icon={Server} headerRight={<TestConnectionButton type="mikrotik" onTest={handleTestConnection} />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Host</label>
                  <input
                    type="text"
                    value={mikrotik.host}
                    onChange={(e) => setMikrotik((prev) => ({ ...prev, host: e.target.value }))}
                    placeholder="192.168.1.1"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">API Port</label>
                  <input
                    type="text"
                    value={mikrotik.port}
                    onChange={(e) => setMikrotik((prev) => ({ ...prev, port: e.target.value }))}
                    placeholder="8728"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                <input
                  type="text"
                  value={mikrotik.username}
                  onChange={(e) => setMikrotik((prev) => ({ ...prev, username: e.target.value }))}
                  placeholder="admin"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <PasswordField
                id="mikrotik-password"
                name="password"
                label="Password"
                value={mikrotik.password}
                onChange={(e) => setMikrotik((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="••••••••"
              />
              <div className="pt-4 border-t border-slate-200">
                <button
                  onClick={() => handleSave("mikrotik", mikrotik)}
                  disabled={savingType === "mikrotik"}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-950 text-white font-medium rounded-lg shadow-sm transition-colors text-sm disabled:opacity-50"
                >
                  {savingType === "mikrotik" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Save
                </button>
              </div>
            </CredentialCard>
          )}

          {activeTab === "olt" && (
            <CredentialCard title="ZTE OLT" icon={Network} headerRight={<TestConnectionButton type="olt" onTest={handleTestConnection} />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Host</label>
                  <input
                    type="text"
                    value={olt.host}
                    onChange={(e) => setOlt((prev) => ({ ...prev, host: e.target.value }))}
                    placeholder="192.168.1.2"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">SSH Port</label>
                  <input
                    type="text"
                    value={olt.port}
                    onChange={(e) => setOlt((prev) => ({ ...prev, port: e.target.value }))}
                    placeholder="22"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                <input
                  type="text"
                  value={olt.username}
                  onChange={(e) => setOlt((prev) => ({ ...prev, username: e.target.value }))}
                  placeholder="admin"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <PasswordField
                id="olt-password"
                name="password"
                label="Password"
                value={olt.password}
                onChange={(e) => setOlt((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="••••••••"
              />
              <div className="pt-4 border-t border-slate-200">
                <button
                  onClick={() => handleSave("olt", olt)}
                  disabled={savingType === "olt"}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-950 text-white font-medium rounded-lg shadow-sm transition-colors text-sm disabled:opacity-50"
                >
                  {savingType === "olt" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Save
                </button>
              </div>
            </CredentialCard>
          )}

          {activeTab === "telegram" && (
            <CredentialCard title="Telegram Bot" icon={Send} headerRight={<TestConnectionButton type="telegram" onTest={handleTestConnection} />}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bot Token</label>
                <input
                  type="text"
                  value={telegram.botToken}
                  onChange={(e) => setTelegram((prev) => ({ ...prev, botToken: e.target.value }))}
                  placeholder="123456:ABC-DEF..."
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Chat ID</label>
                <input
                  type="text"
                  value={telegram.chatId}
                  onChange={(e) => setTelegram((prev) => ({ ...prev, chatId: e.target.value }))}
                  placeholder="-1001234567890"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="pt-4 border-t border-slate-200">
                <button
                  onClick={() => handleSave("telegram", telegram)}
                  disabled={savingType === "telegram"}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-950 text-white font-medium rounded-lg shadow-sm transition-colors text-sm disabled:opacity-50"
                >
                  {savingType === "telegram" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Save
                </button>
              </div>
            </CredentialCard>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Credentials;