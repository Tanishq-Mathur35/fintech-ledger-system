import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";
import { authService } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored && token) {
            try {
                setUser(JSON.parse(stored));
            } catch {
                localStorage.clear();
            }
        }
    }, [token]);

    const login = useCallback(async (email, password) => {
        try {
            const res = await authService.login({ email, password });
            const { user, token } = res.data;
            setUser(user);
            setToken(token);
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            return { success: true };
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || "Login failed",
            };
        }
    }, []);

    const register = useCallback(async (name, email, password) => {
        try {
            const res = await authService.register({ name, email, password });
            const { user, token } = res.data;
            setUser(user);
            setToken(token);
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            return { success: true };
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || "Registration failed",
            };
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await authService.logout();
        } catch (_) {}
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                register,
                logout,
                isAuthenticated: !!user && !!token,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
