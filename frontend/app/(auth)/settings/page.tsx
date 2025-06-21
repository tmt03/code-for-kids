'use client'

import { changeUserPassword } from "@/apis";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function SettingsPage() {
    const router = useRouter();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            await changeUserPassword(oldPassword, newPassword);
            setMessage("Đổi mật khẩu thành công!");
            setOldPassword("");
            setNewPassword("");
        } catch (err: any) {
            setMessage(err?.response?.data?.error || "Đổi mật khẩu thất bại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#E8F1F2] to-[#D3E0E1]">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-300 hover:scale-105">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Đổi mật khẩu</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Mật khẩu cũ
                        </label>
                        <Input
                            id="oldPassword"
                            type="password"
                            placeholder="Nhập mật khẩu cũ"
                            value={oldPassword}
                            onChange={e => setOldPassword(e.target.value)}
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
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#00A8B5] text-white py-2 rounded-lg hover:bg-[#0096A5] disabled:bg-gray-300 transition-colors duration-200"
                    >
                        {loading ? "Đang đổi..." : "Đổi mật khẩu"}
                    </Button>
                </form>
                {message && (
                    <div className="mt-6 p-3 rounded-lg text-center text-sm font-semibold" style={{ backgroundColor: message.includes("thành công") ? "#DCFCE7" : "#FEE2E2", color: message.includes("thành công") ? "#15803D" : "#B91C1C" }}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}