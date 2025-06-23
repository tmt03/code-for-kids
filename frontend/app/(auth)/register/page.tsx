'use client';

import { registerUser, verifyEmail } from "@/apis";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    escapeEmail,
    escapeOtp,
    escapeUsername,
    isValidEmail,
    isValidOtp,
    isValidPassword,
    isValidUsername,
} from "@/lib/utils/validateInput";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
    const [passwordError, setPasswordError] = useState("");
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

    // Validate password
    const handlePasswordChange = (val: string) => {
        setPassword(val);
        if (!isValidPassword(val)) {
            setPasswordError("Mật khẩu phải tối thiểu 6 ký tự, có chữ và số, không chứa khoảng trắng.");
        } else {
            setPasswordError("");
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
        if (!isValidPassword(password)) {
            setPasswordError("Mật khẩu phải tối thiểu 6 ký tự, có chữ và số, không chứa khoảng trắng.");
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
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#E8F1F2] to-[#D3E0E1]">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-300 hover:scale-105">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Đăng ký tài khoản</h2>
                {step === 1 && (
                    <form onSubmit={handleRegister} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                Tên đăng nhập
                            </label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Nhập tên đăng nhập"
                                value={username}
                                onChange={e => handleUsernameChange(e.target.value)}
                                disabled={loading}
                                className="w-full border-gray-300 focus:ring-2 focus:ring-[#00A8B5] focus:border-[#00A8B5]"
                                required
                            />
                            {usernameError && (
                                <div className="text-xs text-red-600 mt-1">{usernameError}</div>
                            )}
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Nhập email"
                                value={email}
                                onChange={e => handleEmailChange(e.target.value)}
                                disabled={loading}
                                className="w-full border-gray-300 focus:ring-2 focus:ring-[#00A8B5] focus:border-[#00A8B5]"
                                required
                            />
                            {emailError && (
                                <div className="text-xs text-red-600 mt-1">{emailError}</div>
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
                                onChange={e => handlePasswordChange(e.target.value)}
                                disabled={loading}
                                className="w-full border-gray-300 focus:ring-2 focus:ring-[#00A8B5] focus:border-[#00A8B5]"
                                required
                            />
                            {passwordError && (
                                <div className="text-xs text-red-600 mt-1">{passwordError}</div>
                            )}
                        </div>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#00A8B5] text-white py-2 rounded-lg hover:bg-[#0096A5] disabled:bg-gray-300 transition-colors duration-200"
                        >
                            {loading ? "Đang đăng ký..." : "Đăng ký"}
                        </Button>
                        <Button
                            type="button"
                            onClick={() => router.back()}
                            disabled={loading}
                            className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 transition-colors duration-200"
                        >
                            Trở về
                        </Button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerify} className="space-y-6">
                        <div>
                            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                                Mã OTP (gửi về email)
                            </label>
                            <Input
                                id="otp"
                                type="text"
                                placeholder="Nhập mã OTP gồm 6 số"
                                value={otp}
                                onChange={e => handleOtpChange(e.target.value)}
                                disabled={loading}
                                className="w-full border-gray-300 focus:ring-2 focus:ring-[#00A8B5] focus:border-[#00A8B5]"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={6}
                                required
                            />
                            {otpError && (
                                <div className="text-xs text-red-600 mt-1">{otpError}</div>
                            )}
                        </div>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#00A8B5] text-white py-2 rounded-lg hover:bg-[#0096A5] disabled:bg-gray-300 transition-colors duration-200"
                        >
                            {loading ? "Đang xác minh..." : "Xác minh"}
                        </Button>
                        <Button
                            type="button"
                            onClick={() => router.back()}
                            disabled={loading}
                            className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 transition-colors duration-200"
                        >
                            Trở về
                        </Button>
                    </form>
                )}

                {message && <div className="mt-6 p-3 bg-green-100 text-green-700 rounded-lg text-center">{message}</div>}
                {error && <div className="mt-6 p-3 bg-red-100 text-red-700 rounded-lg text-center">{error}</div>}
            </div>
        </div>
    );
}