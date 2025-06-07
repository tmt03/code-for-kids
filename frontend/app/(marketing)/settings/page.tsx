'use client'

import React, { useState } from "react";
import { changeUserPassword } from "@/apis";

export default function SettingsPage() {
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
        <div className="w-full overflow-x-hidden bg-gradient-to-b from-[#B0E2FF] to-[#E6F0FA] font-mono text-white min-h-screen flex flex-col items-center pt-20">
            <form
                onSubmit={handleSubmit}
                className="bg-[#1c1c2e] p-8 rounded-lg shadow-lg w-full max-w-md flex flex-col gap-4"
            >
                <h2 className="text-xl font-bold mb-2 text-center">Đổi mật khẩu</h2>
                <input
                    type="password"
                    placeholder="Mật khẩu cũ"
                    className="px-4 py-2 rounded bg-[#23234a] border border-[#3a3a5a] text-white"
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Mật khẩu mới"
                    className="px-4 py-2 rounded bg-[#23234a] border border-[#3a3a5a] text-white"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded"
                    disabled={loading}
                >
                    {loading ? "Đang đổi..." : "Đổi mật khẩu"}
                </button>
                {message && (
                    <div className="text-center text-sm mt-2" style={{ color: message.includes("thành công") ? "#4ade80" : "#f87171" }}>
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
}