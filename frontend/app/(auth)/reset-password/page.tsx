'use client';

import { forgotPassword, resetPassword } from "@/apis";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
    const router = useRouter();

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
            setMessage("Đổi mật khẩu thành công! Đang chuyển hướng tới trang đăng nhập.");
            setTimeout(() => {
                router.push("/login");
            }, 1500);
        } catch (err: any) {
            setError(err.response?.data?.error || "Có lỗi xảy ra!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#E8F1F2] to-[#D3E0E1]">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-300 hover:scale-105">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Quên mật khẩu</h2>
                {step === 1 && (
                    <form onSubmit={handleSendOtp} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email bạn sử dụng để đăng ký
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Nhập email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                disabled={loading}
                                className="w-full border-gray-300 focus:ring-2 focus:ring-[#00A8B5] focus:border-[#00A8B5]"
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#00A8B5] text-white py-2 rounded-lg hover:bg-[#0096A5] disabled:bg-gray-300 transition-colors duration-200"
                        >
                            {loading ? "Đang gửi..." : "Gửi mã OTP"}
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
                    <form onSubmit={handleResetPassword} className="space-y-6">
                        <div>
                            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                                Mã OTP
                            </label>
                            <Input
                                id="otp"
                                type="text"
                                placeholder="Nhập mã OTP"
                                value={otp}
                                onChange={e => setOtp(e.target.value)}
                                disabled={loading}
                                className="w-full border-gray-300 focus:ring-2 focus:ring-[#00A8B5] focus:border-[#00A8B5]"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Mật khẩu mới
                            </label>
                            <Input
                                id="newPassword"
                                type="password"
                                placeholder="Nhập mật khẩu mới"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                disabled={loading}
                                className="w-full border-gray-300 focus:ring-2 focus:ring-[#00A8B5] focus:border-[#00A8B5]"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Nhập lại mật khẩu mới
                            </label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Nhập lại mật khẩu mới"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                disabled={loading}
                                className="w-full border-gray-300 focus:ring-2 focus:ring-[#00A8B5] focus:border-[#00A8B5]"
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#00A8B5] text-white py-2 rounded-lg hover:bg-[#0096A5] disabled:bg-gray-300 transition-colors duration-200"
                        >
                            {loading ? "Đang đổi mật khẩu..." : "Đổi mật khẩu"}
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