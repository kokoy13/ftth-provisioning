import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";
import Alert from "../../components/ui/Alert";
import { API_ENDPOINTS } from "../../constants";
import logo from "/img/logo.png";

const BASE_URL = "http://127.0.0.1:5001/api";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess(false);
        setIsLoading(true);

        try {
            const res = await fetch(`${BASE_URL}${API_ENDPOINTS.FORGOT_PASSWORD}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({ message: res.statusText }));
                throw new Error(err.message || `HTTP ${res.status}`);
            }

            setSuccess(true);
        } catch (err) {
            setError(err.message || "Failed to send recovery email.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-200 px-4">
            <div className="w-full max-w-md">
                {/* Auth Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="space-y-5">
                        <div className="text-center mb-2">
                            {/* Logo */}
                            <div className="mb-5 flex justify-center">
                                <img className="w-16" src={logo} alt="" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Lupa Password</h2>
                            <p className="text-slate-500 mb-8">Masukkan email Anda untuk mengatur ulang password</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    autoComplete="email"
                                    className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            {error && <Alert type="error" message={error} />}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-gray-900 hover:bg-gray-950 hover:cursor-pointer text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Sending…
                                </>
                                ) : (
                                "Send Recovery Link"
                                )}
                            </button>
                        </form>

                        {success && (
                            <Alert
                                type="success"
                                message="Link reset password telah dikirim ke email Anda jika terdaftar sebagai admin. Silakan cek inbox email Anda."
                            />
                        )}

                        {/* Back to Login */}
                        <div className="flex justify-center">
                            <Link
                            to="/login"
                            className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
