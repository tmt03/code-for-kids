"use client";

import axiosInstance from "@/lib/utils/axiosInstance";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useEffect, useState } from "react";

export interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    isLoading: boolean;
    error: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
    refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
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
            setError(null);

            const { data } = await axiosInstance.post("/v1/auth/login", {
                username,
                password,
            });

            localStorage.setItem("accessToken", data.accessToken);
            setAccessToken(data.accessToken);
            setUser(data.user);
            router.push("/home");
        } catch (err: any) {
            setError(err.response?.data?.error || "Đăng nhập thất bại");
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            setIsLoading(true);
            await axiosInstance.post("/v1/auth/logout");
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            localStorage.removeItem("accessToken");
            setAccessToken(null);
            setUser(null);
            setIsLoading(false);
            router.push("/login");
        }
    };

    const clearError = () => setError(null);

    const refreshUser = fetchUser;

    const value: AuthContextType = {
        user,
        accessToken,
        isLoading,
        error,
        login,
        logout,
        clearError,
        refreshUser, // Cung cấp hàm refreshUser để làm mới thông tin người dùng
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
