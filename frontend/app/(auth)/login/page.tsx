"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { escapeUsername, isValidUsername } from "@/lib/utils/validateInput";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const handleUsernameChange = (val: string) => {
    // Kiểm tra có ký tự đặc biệt không
    if (/[^a-zA-Z0-9._]/.test(val)) {
      setUsernameError("Tên đăng nhập không được chứa ký tự đặc biệt.");
    } else if (val && !isValidUsername(val)) {
      setUsernameError("Tên đăng nhập không được bắt đầu/kết thúc bằng dấu chấm hoặc gạch dưới.");
    } else {
      setUsernameError("");
    }
    setUsername(escapeUsername(val));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!isValidUsername(username)) {
      setUsernameError("Tên đăng nhập không hợp lệ.");
      return;
    }

    try {
      await login(username, password);
    } catch (err) {
      // Error đã được xử lý trong AuthProvider
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#E8F1F2] to-[#D3E0E1]">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Đăng Nhập</h1>
          <p className="text-sm text-gray-600 mt-2">Chào mừng bạn đến với thế giới học lập trình!</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Tên đăng nhập
            </label>
            <Input
              id="username"
              type="text"
              placeholder="Nhập tên đăng nhập"
              value={username}
              onChange={(e) => handleUsernameChange(e.target.value)}
              disabled={isLoading}
              className="w-full border-gray-300 focus:ring-2 focus:ring-[#00A8B5] focus:border-[#00A8B5]"
            />
            {usernameError && (
              <div className="text-xs text-red-600 mt-1">{usernameError}</div>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full border-gray-300 focus:ring-2 focus:ring-[#00A8B5] focus:border-[#00A8B5]"
            />
            <div className="text-right text-sm text-gray-600">
              <a href="/reset-password" className="text-[#00A8B5] hover:underline">
                Bạn quên mật khẩu?
              </a>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            variant="pixel"
            className="w-full bg-[#00A8B5] text-white py-2 rounded-lg hover:bg-[#0096A5] disabled:bg-gray-300 transition-colors duration-200"
          >
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>

          <Button
            type="button"
            onClick={() => router.push("/")}
            disabled={isLoading}
            variant="default"
            className="w-full mt-4 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 transition-colors duration-200"
          >
            Về trang chủ
          </Button>
        </form>

        <div className="text-center mt-4 text-sm text-gray-600">
          Chưa có tài khoản?{" "}
          <a href="/register" className="text-[#00A8B5] hover:underline">
            Đăng ký ngay
          </a>
        </div>
      </div>
    </div>
  );
}