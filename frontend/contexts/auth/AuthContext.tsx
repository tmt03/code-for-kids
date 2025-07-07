"use client";

import axiosInstance from "@/lib/utils/axiosInstance";
import { TrialInfo, User } from "@/types/user";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useEffect, useState } from "react";
import { useOnlineSocket } from "@/hooks/useOnlineSocket";

export interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    isLoading: boolean;
    error: string | null;
    errorLogin: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
    clearErrorLogin: () => void;
    refreshUser: () => Promise<void>;
    isTrialMode: boolean;
    trialInfo: TrialInfo | null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [errorLogin, setErrorLogin] = useState<string | null>(null);
    const router = useRouter();

    const fetchUser = useCallback(async () => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                setUser(null);
                return;
            }

            const { data } = await axiosInstance.get("/v1/auth/me");
            setUser(data.user);
            setAccessToken(token);
            setError(null);
        } catch (err: any) {
            console.error("Auth check failed:", err);
            setUser(null);
            setAccessToken(null);
            setError(err.response?.data?.error || "Không thể xác thực người dùng");
            localStorage.removeItem("accessToken");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const login = async (username: string, password: string) => {
        try {
            setIsLoading(true);
            setErrorLogin(null);

            const { data } = await axiosInstance.post("/v1/auth/login", {
                username,
                password,
            });

            localStorage.setItem("accessToken", data.accessToken);
            setAccessToken(data.accessToken);
            setUser(data.user);
            console.log(data.user.role)

            // Redirect based on user role
            if (data?.user.role === 'admin') {
                router.push("/dashboard/order-management");
            } else {
                router.push("/home");
            }
        } catch (err: any) {
            setErrorLogin(err.response?.data?.error || "Đăng nhập thất bại, server đang quá tải!");
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await axiosInstance.post("/v1/auth/logout");
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem("accessToken");
            setUser(null);
            setAccessToken(null);
            router.push("/login");
        }
    };

    const clearError = () => setError(null);
    const clearErrorLogin = () => setErrorLogin(null);

    const refreshUser = async () => {
        await fetchUser();
    };

    // TRIAL MODE COMPUTED VALUES
    const isTrialMode = !user?.isActivated;
    const trialInfo = user?.trialInfo || null;

    useOnlineSocket(user?.userId);

    return (
        <AuthContext.Provider
            value={{
                user,
                accessToken,
                isLoading,
                error,
                errorLogin,
                login,
                logout,
                clearError,
                clearErrorLogin,
                refreshUser,
                isTrialMode,
                trialInfo,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

const AuthContext = createContext<AuthContextType | null>(null);

export { AuthContext };

