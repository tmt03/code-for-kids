'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser, verifyEmail } from "@/apis";
import {
  escapeUsername,
  escapeEmail,
  escapeOtp,
  isValidUsername,
  isValidEmail,
  isValidOtp,
} from "@/lib/utils/validateInput";

export default function RegisterPage() {
    const [step, setStep] = useState<1 | 2>(1);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [otpError, setOtpError] = useState("");
    const router = useRouter();

    // Validate username
    const handleUsernameChange = (val: string) => {
        const escaped = escapeUsername(val);
        setUsername(escaped);
        if (/[^a-zA-Z0-9._]/.test(val)) {
            setUsernameError("Chỉ cho phép chữ, số, dấu chấm, dấu gạch dưới.");
        } else if (escaped && !isValidUsername(escaped)) {
            setUsernameError("Không được bắt đầu/kết thúc bằng dấu chấm hoặc gạch dưới.");
        } else {
            setUsernameError("");
        }
    };

    // Validate email
    const handleEmailChange = (val: string) => {
        const escaped = escapeEmail(val);
        setEmail(escaped);
        if (/[^a-zA-Z0-9@._\-+]/.test(val)) {
            setEmailError("Email chỉ cho phép chữ, số, @, ., _, -, +.");
        } else if (escaped && !isValidEmail(escaped)) {
            setEmailError("Email không hợp lệ.");
        } else {
            setEmailError("");
        }
    };

    // Validate OTP
    const handleOtpChange = (val: string) => {
        const escaped = escapeOtp(val);
        setOtp(escaped);
        if (/[^0-9]/.test(val)) {
            setOtpError("OTP chỉ được nhập số.");
        } else if (escaped && !isValidOtp(escaped)) {
            setOtpError("OTP phải gồm 6 số.");
        } else {
            setOtpError("");
        }
    };

    // Bước 1: Đăng ký
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");

        // Validate trước khi submit
        if (!isValidUsername(username)) {
            setUsernameError("Tên đăng nhập không hợp lệ.");
            return;
        }
        if (!isValidEmail(email)) {
            setEmailError("Email không hợp lệ.");
            return;
        }

        setLoading(true);
        try {
            await registerUser(username, email, password);
            setMessage("Đăng ký thành công! Vui lòng kiểm tra email để lấy mã OTP.");
            setStep(2);
        } catch (err: any) {
            setError(err.message || "Có lỗi xảy ra!");
        } finally {
            setLoading(false);
        }
    };

    // Bước 2: Xác minh OTP
    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!isValidOtp(otp)) {
            setOtpError("OTP phải gồm 6 số.");
            return;
        }

        setLoading(true);
        try {
            await verifyEmail(email, otp);
            setMessage("Xác minh thành công! Đang chuyển hướng...");
            setTimeout(() => router.push("/login"), 1500);
        } catch (err: any) {
            setError(err.message || "Có lỗi xảy ra!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-200 to-blue-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Đăng ký tài khoản</h2>
                {step === 1 && (
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label className="block mb-1 font-medium">Tên đăng nhập</label>
                            <input
                                type="text"
                                className="w-full border rounded px-3 py-2"
                                value={username}
                                onChange={e => handleUsernameChange(e.target.value)}
                                required
                                disabled={loading}
                                placeholder="Chỉ chữ, số, dấu chấm, dấu gạch dưới"
                            />
                            {usernameError && (
                                <div className="text-xs text-red-600 mt-1">{usernameError}</div>
                            )}
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Email</label>
                            <input
                                type="email"
                                className="w-full border rounded px-3 py-2"
                                value={email}
                                onChange={e => handleEmailChange(e.target.value)}
                                required
                                disabled={loading}
                                placeholder="example@email.com"
                            />
                            {emailError && (
                                <div className="text-xs text-red-600 mt-1">{emailError}</div>
                            )}
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Mật khẩu</label>
                            <input
                                type="password"
                                className="w-full border rounded px-3 py-2"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-500 transition"
                            disabled={loading}
                        >
                            {loading ? "Đang đăng ký..." : "Đăng ký"}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerify} className="space-y-4">
                        <div>
                            <label className="block mb-1 font-medium">Mã OTP (gửi về email)</label>
                            <input
                                type="text"
                                className="w-full border rounded px-3 py-2"
                                value={otp}
                                onChange={e => handleOtpChange(e.target.value)}
                                required
                                disabled={loading}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={6}
                                placeholder="Nhập mã OTP gồm 6 số"
                            />
                            {otpError && (
                                <div className="text-xs text-red-600 mt-1">{otpError}</div>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-500 transition"
                            disabled={loading}
                        >
                            {loading ? "Đang xác minh..." : "Xác minh"}
                        </button>
                    </form>
                )}

                {message && <div className="mt-4 text-green-600 text-center">{message}</div>}
                {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
            </div>
        </div>
    );
}