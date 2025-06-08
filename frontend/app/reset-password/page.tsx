'use client';

import { useState } from "react";
import { forgotPassword, resetPassword } from "@/apis";

export default function ResetPasswordPage() {
    const [step, setStep] = useState<1 | 2>(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Bước 1: Gửi email nhận OTP
    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");
        try {
            await forgotPassword(email);
            setMessage("Đã gửi mã OTP về email của bạn.");
            setStep(2);
        } catch (err: any) {
            setError(err.response?.data?.error || "Có lỗi xảy ra!");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");
        try {
            await resetPassword(email, otp, newPassword, confirmPassword);
            setMessage("Đổi mật khẩu thành công! Bạn có thể đăng nhập lại.");
        } catch (err: any) {
            setError(err.response?.data?.error || "Có lỗi xảy ra!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-200 to-blue-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Quên mật khẩu</h2>
                {step === 1 && (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                        <div>
                            <label className="block mb-1 font-medium">Email</label>
                            <input
                                type="email"
                                className="w-full border rounded px-3 py-2"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-500 transition"
                            disabled={loading}
                        >
                            {loading ? "Đang gửi..." : "Gửi mã OTP"}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div>
                            <label className="block mb-1 font-medium">Mã OTP</label>
                            <input
                                type="text"
                                className="w-full border rounded px-3 py-2"
                                value={otp}
                                onChange={e => setOtp(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Mật khẩu mới</label>
                            <input
                                type="password"
                                className="w-full border rounded px-3 py-2"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Nhập lại mật khẩu mới</label>
                            <input
                                type="password"
                                className="w-full border rounded px-3 py-2"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-500 transition"
                            disabled={loading}
                        >
                            {loading ? "Đang đổi mật khẩu..." : "Đổi mật khẩu"}
                        </button>
                    </form>
                )}

                {message && <div className="mt-4 text-green-600 text-center">{message}</div>}
                {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
            </div>
        </div>
    );
}