'use client';

import { useEffect, useState } from "react";
import { fetchAllChapters, updateQuestVideoUrl } from "@/apis";

type Quest = {
    id: string;
    name: string;
    videoUrl?: string;
};

type Chapter = {
    id: string;
    name: string;
    quests: Quest[];
};

export default function DashboardPage() {
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingQuestId, setEditingQuestId] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState("");
    const [saving, setSaving] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        fetchAllChapters()
            .then((data) => setChapters(data))
            .catch(() => setError("Không thể tải danh sách quest"))
            .finally(() => setLoading(false));
    }, []);

    const handleEdit = (quest: Quest) => {
        setEditingQuestId(quest.id);
        setVideoUrl(quest.videoUrl || "");
        setSuccess(null);
        setError("");
    };

    const handleSave = async (questId: string) => {
        setSaving(questId);
        setSuccess(null);
        setError("");
        try {
            await updateQuestVideoUrl(questId, videoUrl);
            setSuccess(questId);
            // Cập nhật lại videoUrl trong chapters state
            setChapters(prev =>
                prev.map(ch => ({
                    ...ch,
                    quests: ch.quests.map(q =>
                        q.id === questId ? { ...q, videoUrl } : q
                    )
                }))
            );
            setEditingQuestId(null);
        } catch (err: any) {
            setError(err.message || "Có lỗi xảy ra!");
        } finally {
            setSaving(null);
        }
    };

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div>Đang tải danh sách quest...</div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pt-20 py-10 px-4">
            <h1 className="text-2xl font-bold mb-8 text-center">Quản lý video cho các Quest</h1>
            {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
            {chapters.map(chapter => (
                <div key={chapter.id} className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-blue-700">{chapter.name}</h2>
                    <div className="space-y-4">
                        {chapter.quests.map(quest => (
                            <div
                                key={quest.id}
                                className="flex flex-col md:flex-row md:items-center gap-2 border-b pb-3"
                            >
                                <div className="flex-1">
                                    <span className="font-semibold">{quest.name}</span>
                                    <span className="ml-2 text-gray-500 text-xs">(ID: {quest.id})</span>
                                </div>
                                {editingQuestId === quest.id ? (
                                    <>
                                        <input
                                            type="text"
                                            className="flex-1 border rounded px-3 py-2"
                                            placeholder="Nhập hoặc dán link video YouTube cho quest này..."
                                            value={videoUrl}
                                            onChange={e => setVideoUrl(e.target.value)}
                                            disabled={saving === quest.id}
                                        />
                                        <button
                                            onClick={() => handleSave(quest.id)}
                                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition"
                                            disabled={saving === quest.id}
                                        >
                                            {saving === quest.id ? "Đang lưu..." : "Lưu"}
                                        </button>
                                        <button
                                            onClick={() => setEditingQuestId(null)}
                                            className="px-3 py-2 rounded border ml-2"
                                            disabled={saving === quest.id}
                                        >
                                            Hủy
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <span className="flex-1 text-gray-700 truncate">
                                            {quest.videoUrl || <span className="italic text-gray-400">Chưa có video</span>}
                                        </span>
                                        <button
                                            onClick={() => handleEdit(quest)}
                                            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
                                        >
                                            Sửa
                                        </button>
                                        {success === quest.id && (
                                            <span className="text-green-600 ml-2">✔</span>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}