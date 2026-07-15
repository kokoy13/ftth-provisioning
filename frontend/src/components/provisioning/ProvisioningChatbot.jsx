import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Bot, User, Loader2 } from "lucide-react";

const STEPS = {
  ASK_NAME: "ASK_NAME",
  ASK_USERNAME: "ASK_USERNAME",
  ASK_PASSWORD: "ASK_PASSWORD",
  ASK_OLT_PORT: "ASK_OLT_PORT",
  ASK_ONU: "ASK_ONU",
  ASK_SERIAL: "ASK_SERIAL",
  ASK_PROFILE: "ASK_PROFILE",
  CONFIRM: "CONFIRM",
  DONE: "DONE",
};

const PROFILE_OPTIONS = ["10Mbps", "20Mbps", "50Mbps", "100Mbps"];

const ProvisioningChatbot = ({ isOpen, onClose, onSubmit }) => {
  const [step, setStep] = useState(STEPS.ASK_NAME);
  const [data, setData] = useState({});
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setStep(STEPS.ASK_NAME);
      setData({});
      setMessages([
        {
          from: "bot",
          text: "Halo! Saya akan membantu Anda membuat provisioning baru.\n\nSilakan masukkan **Nama Pelanggan**:",
        },
      ]);
      setInput("");
      setError("");
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addBotMessage = (text) => {
    setMessages((prev) => [...prev, { from: "bot", text }]);
  };

  const addUserMessage = (text) => {
    setMessages((prev) => [...prev, { from: "user", text }]);
  };

  const askNext = (nextStep) => {
    switch (nextStep) {
      case STEPS.ASK_USERNAME:
        addBotMessage("Oke! Sekarang masukkan **PPPoE Username**:");
        break;
      case STEPS.ASK_PASSWORD:
        addBotMessage("Sekarang masukkan **PPPoE Password**:");
        break;
      case STEPS.ASK_OLT_PORT:
        addBotMessage("Bagus! Masukkan **OLT Port** (contoh: 1/1/1):");
        break;
      case STEPS.ASK_ONU:
        addBotMessage("Masukkan **ONU Number** (contoh: 1):");
        break;
      case STEPS.ASK_SERIAL:
        addBotMessage("Masukkan **ONU Serial Number** (kosongkan jika tidak ada):");
        break;
      case STEPS.ASK_PROFILE: {
        const opts = PROFILE_OPTIONS.map((p, i) => `${i + 1}. ${p}`).join("\n");
        addBotMessage(`Pilih **Service Profile**:\n\n${opts}\n\nKetik angka atau nama profile:`);
        break;
      }
      case STEPS.CONFIRM: {
        const summary = Object.entries(data)
          .map(([key, val]) => `• **${key}**: ${val || "—"}`)
          .join("\n");
        addBotMessage(
          `Berikut ringkasan data:\n\n${summary}\n\nKetik **ya** untuk konfirmasi dan membuat provisioning, atau **tidak** untuk membatalkan.`
        );
        break;
      }
      default:
        break;
    }
    setStep(nextStep);
  };

  const handleSend = async () => {
    const value = input.trim();
    if (!value && step !== STEPS.ASK_SERIAL) return;
    setInput("");
    setError("");

    addUserMessage(value || "(dilewati)");

    switch (step) {
      case STEPS.ASK_NAME:
        if (value.length < 2) {
          setError("Nama minimal 2 karakter.");
          return;
        }
        setData((prev) => ({ ...prev, customerName: value }));
        askNext(STEPS.ASK_USERNAME);
        break;

      case STEPS.ASK_USERNAME:
        if (value.length < 2) {
          setError("Username minimal 2 karakter.");
          return;
        }
        setData((prev) => ({ ...prev, customerUsername: value }));
        askNext(STEPS.ASK_PASSWORD);
        break;

      case STEPS.ASK_PASSWORD:
        if (value.length < 3) {
          setError("Password minimal 3 karakter.");
          return;
        }
        setData((prev) => ({ ...prev, pppoePassword: value }));
        askNext(STEPS.ASK_OLT_PORT);
        break;

      case STEPS.ASK_OLT_PORT:
        if (value.length < 3) {
          setError("OLT Port tidak valid.");
          return;
        }
        setData((prev) => ({ ...prev, oltPort: value }));
        askNext(STEPS.ASK_ONU);
        break;

      case STEPS.ASK_ONU:
        if (!value || isNaN(parseInt(value))) {
          setError("ONU Number harus berupa angka.");
          return;
        }
        setData((prev) => ({ ...prev, onuNumber: value }));
        askNext(STEPS.ASK_SERIAL);
        break;

      case STEPS.ASK_SERIAL:
        setData((prev) => ({ ...prev, serialNumber: value || "" }));
        askNext(STEPS.ASK_PROFILE);
        break;

      case STEPS.ASK_PROFILE: {
        const idx = parseInt(value) - 1;
        const profile = PROFILE_OPTIONS.includes(value)
          ? value
          : idx >= 0 && idx < PROFILE_OPTIONS.length
          ? PROFILE_OPTIONS[idx]
          : null;
        if (!profile) {
          setError("Profile tidak valid. Pilih dari daftar.");
          return;
        }
        setData((prev) => ({ ...prev, profile }));
        askNext(STEPS.CONFIRM);
        break;
      }

      case STEPS.CONFIRM:
        if (value.toLowerCase() === "ya") {
          setIsLoading(true);
          try {
            await onSubmit(data);
            addBotMessage("✅ **Provisioning berhasil dibuat!**");
            setStep(STEPS.DONE);
          } catch (err) {
            setError(err.message || "Gagal membuat provisioning.");
            addBotMessage("❌ Gagal membuat provisioning. Silakan coba lagi.");
            setStep(STEPS.CONFIRM);
          } finally {
            setIsLoading(false);
          }
        } else {
          addBotMessage("❌ Pembatalan dibatalkan. Silakan mulai ulang kapan saja.");
          setTimeout(() => onClose(), 1500);
        }
        break;

      default:
        break;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleRestart = () => {
    setStep(STEPS.ASK_NAME);
    setData({});
    setMessages([
      {
        from: "bot",
        text: "Halo! Saya akan membantu Anda membuat provisioning baru.\n\nSilakan masukkan **Nama Pelanggan**:",
      },
    ]);
    setInput("");
    setError("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 cursor-pointer" onClick={onClose} />

      {/* Chat Panel */}
      <div className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[80vh] sm:max-h-[600px]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Provisioning Assistant</h3>
              <p className="text-xs text-blue-100">Rule-based chatbot</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-slate-50">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                  msg.from === "user"
                    ? "bg-blue-600 text-white rounded-br-md"
                    : "bg-white border border-slate-200 text-slate-700 rounded-bl-md shadow-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-4 py-2.5 shadow-sm">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Error */}
        {error && (
          <div className="px-5 py-2 bg-rose-50 border-t border-rose-200">
            <p className="text-xs text-rose-600">{error}</p>
          </div>
        )}

        {/* Input */}
        {step !== STEPS.DONE && (
          <div className="border-t border-slate-200 px-4 py-3 bg-white">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  step === STEPS.ASK_SERIAL
                    ? "Ketik serial number atau kosongkan lalu kirim..."
                    : step === STEPS.ASK_PROFILE
                    ? "Ketik angka atau nama profile..."
                    : step === STEPS.CONFIRM
                    ? "Ketik 'ya' atau 'tidak'..."
                    : "Ketik jawaban Anda..."
                }
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="h-10 w-10 rounded-xl bg-gray-900 hover:bg-gray-950 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
        )}

        {/* Done Actions */}
        {step === STEPS.DONE && (
          <div className="border-t border-slate-200 px-4 py-3 bg-white flex gap-2">
            <button
              onClick={handleRestart}
              className="flex-1 px-4 py-2.5 bg-gray-900 hover:bg-gray-950 text-white font-medium rounded-xl text-sm transition-colors"
            >
              Buat Lagi
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-sm transition-colors"
            >
              Tutup
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProvisioningChatbot;
