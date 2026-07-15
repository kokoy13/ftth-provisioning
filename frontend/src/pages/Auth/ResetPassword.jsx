import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";
import Alert from "../../components/ui/Alert";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { API_ENDPOINTS } from "../../constants";
import logo from "/img/logo.png";

const BASE_URL = "http://127.0.0.1:5001/api";

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [verifying, setVerifying] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setVerifying(false);
                return;
            }

            try {
                const res = await fetch(`${BASE_URL}${API_ENDPOINTS.VERIFY_RESET_TOKEN}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token }),
                });
                const data = await res.json();
                setTokenValid(data.valid === true);
            } catch {
                setTokenValid(false);
            } finally {
                setVerifying(false);
            }
        };

        verifyToken();
    }, [token]);

    if (verifying) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-200 px-4">
                <LoadingSpinner />
            </div>
        );
    }

    if (!token || !tokenValid) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-200 px-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center space-y-4">
                        <div className="mb-5 flex justify-center">
                            <img className="w-16" src={logo} alt="" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">Akses Ditolak</h2>
                        <Alert
                            type="error"
                            message="Token reset tidak valid atau sudah kedaluwarsa. Silakan minta link reset password baru."
                        />
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
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        if (newPassword !== confirmPassword) {
            setError("Password dan konfirmasi password tidak cocok.");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password harus memiliki minimal 6 karakter.");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch(`${BASE_URL}${API_ENDPOINTS.RESET_PASSWORD}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword, confirmPassword }),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({ message: res.statusText }));
                throw new Error(err.message || `HTTP ${res.status}`);
            }

            setSuccess(true);
            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            setError(err.message || "Gagal mereset password.");
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
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Reset Password</h2>
                            <p className="text-slate-500 mb-8">Buat password baru untuk akun Anda</p>
                        </div>

                        {success && (
                            <Alert
                                type="success"
                                message="Password berhasil direset! Anda akan dialihkan ke halaman login."
                            />
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* New Password */}
                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Password Baru
                                </label>
                                <input
                                    id="newPassword"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Masukkan password baru"
                                    required
                                    autoComplete="new-password"
                                    className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            {/* Confirm New Password */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Konfirmasi Password Baru
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Konfirmasi password baru"
                                    required
                                    autoComplete="new-password"
                                    className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            {error && <Alert type="error" message={error} />}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading || success}
                                className="w-full py-3 bg-gray-900 hover:bg-gray-950 hover:cursor-pointer text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Mereset…
                                    </>
                                ) : (
                                    "Reset Password"
                                )}
                            </button>
                        </form>

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

export default ResetPassword;
