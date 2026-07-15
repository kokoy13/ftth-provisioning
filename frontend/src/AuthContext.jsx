import { createContext, useContext, useState, useCallback, useEffect } from "react";
import {useNavigate} from "react-router-dom";

const BASE_URL = "http://127.0.0.1:5001/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // ─── STATE ─────────────────────────────────────────────────────────
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ─── EFFECTS ───────────────────────────────────────────────────────
  // Memuat state autentikasi dari localStorage saat komponen pertama dirender
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (error) {
        // Jika data corrupt, bersihkan localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  // ─── ACTIONS ───────────────────────────────────────────────────────
  const login = useCallback(async (username, password) => {
    // Sesuaikan endpoint '/login' ini jika backend Anda menggunakan path lain (misal: '/auth/login')
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || `HTTP error ${response.status}`);
    }

    const result = await response.json();
    const userData = {
      username: result.user.username,
      role: result.user.role,
      fullName: result.user.fullName,
      email: result.user.email,
    };

    // Simpan sesi ke localStorage
    localStorage.setItem("token", result.token);
    localStorage.setItem("user", JSON.stringify(userData));

    // Update state React
    setUser(userData);
    setIsAuthenticated(true);

    return userData;
  }, []);

  const logout = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      // Sesuaikan endpoint '/logout' ini jika backend menggunakan path lain
      await fetch(`${BASE_URL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
    } catch (error) {
      console.warn("API Logout gagal, melanjutkan proses logout lokal.", error);
    } finally {
      // Blok finally memastikan data lokal terhapus meskipun request API di atas gagal/error
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setIsAuthenticated(false);

      window.location.href = "/login";
    }
  }, []);

  // ─── HELPER FUNCTIONS ──────────────────────────────────────────────
  const hasRole = useCallback((allowedRoles) => {
    if (!user) return false;
    if (!allowedRoles || allowedRoles.length === 0) return true;
    return allowedRoles.includes(user.role);
  }, [user]);

  // Menggantikan ROLES.SUPER_ADMIN dengan string hardcode
  const isSuperAdmin = useCallback(() => {
    return user?.role === "admin";
  }, [user]);

  // ─── PROVIDER VALUE ────────────────────────────────────────────────
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    hasRole,
    isSuperAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook untuk mengonsumsi AuthContext dengan validasi bawaan.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return context;
}