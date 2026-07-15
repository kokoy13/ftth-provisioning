import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Alert from "../../components/ui/Alert";
import logo from "/img/logo.png"

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        
        try{
            const res = await fetch("http://localhost:5001/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            })

            if (!res.ok) {
                const errorData = await res.json();
                setError(errorData.message || "Login gagal. Silakan coba lagi.");
                return;
            }

            const result = await res.json();
            const { token } = result;
            const userData = {
                username: result.user.username,
                role: result.user.role,
                fullName: result.user.fullName,
                email: result.user.email,
            };

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(userData));

            window.location.href = "/";
        }catch(err){
            setError("Terjadi kesalahan saat mencoba masuk. Silakan coba lagi.");
            setIsLoading(false);
        }finally{
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
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Selamat Datang</h2>
                            <p className="text-slate-500 mb-8">Masuk untuk melanjutkan</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Username */}
                            <div>
                            <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1.5">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                required
                                autoComplete="username"
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            />
                            </div>

                            {/* Password */}
                            <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                autoComplete="current-password"
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            />
                            </div>

                            {error && <Alert type="error" message={error} />}

                            {/* Forgot Password Link */}
                            <div className="flex justify-end">
                            <Link
                                to="/forgot-password"
                                className="text-sm text-blue-500 hover:text-blue-700 font-medium"
                            >
                                Lupa password?
                            </Link>
                            </div>

                            {/* Submit Button */}
                            <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-gray-900 hover:bg-gray-950 hover:cursor-pointer text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                            {isLoading ? (
                                <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Masuk sedang dilakukan…
                                </>
                            ) : (
                                "Masuk"
                            )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        
    );
};

export default Login;
