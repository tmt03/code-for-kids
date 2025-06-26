'use client';

import { fetchAllChapters, updateQuestVideoUrl } from "@/apis";
import { useEffect, useRef, useState } from "react";

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

export default function VideoTutorialPage() {
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingQuestId, setEditingQuestId] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState("");
    const [saving, setSaving] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        fetchAllChapters()
            .then((data) => setChapters(data))
            .catch(() => setError("Không thể tải danh sách quest"))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (editingQuestId && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingQuestId]);

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

    const handleDelete = async (questId: string) => {
        if (!window.confirm("Bạn có chắc muốn xóa video này khỏi quest?")) return;
        setDeleting(questId);
        setSuccess(null);
        setError("");
        try {
            await updateQuestVideoUrl(questId, "");
            setSuccess(questId + "-delete");
            setChapters(prev =>
                prev.map(ch => ({
                    ...ch,
                    quests: ch.quests.map(q =>
                        q.id === questId ? { ...q, videoUrl: "" } : q
                    )
                }))
            );
            if (editingQuestId === questId) setEditingQuestId(null);
        } catch (err: any) {
            setError(err.message || "Có lỗi xảy ra khi xóa!");
        } finally {
            setDeleting(null);
        }
    };

    // Helper: get YouTube videoId from url
    function getYoutubeId(url: string) {
        const match = url.match(/(?:youtu.be\/|youtube.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
        return match ? match[1] : null;
    }

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
                        {chapter.quests.map(quest => {
                            const isEditing = editingQuestId === quest.id;
                            const isSaving = saving === quest.id;
                            const isDeleting = deleting === quest.id;
                            const videoId = getYoutubeId(isEditing ? videoUrl : quest.videoUrl || "");
                            return (
                                <div
                                    key={quest.id}
                                    className={`flex flex-col md:flex-row md:items-center gap-2 border-b pb-3 ${isSaving || isDeleting ? "opacity-60 pointer-events-none" : ""}`}
                                >
                                    <div className="flex-1">
                                        <span className="font-semibold">{quest.name}</span>
                                        <span className="ml-2 text-gray-500 text-xs">(ID: {quest.id})</span>
                                    </div>
                                    {isEditing ? (
                                        <>
                                            <input
                                                ref={inputRef}
                                                type="text"
                                                className="flex-1 border rounded px-3 py-2"
                                                placeholder="Nhập hoặc dán link video YouTube cho quest này..."
                                                value={videoUrl}
                                                onChange={e => setVideoUrl(e.target.value)}
                                                disabled={isSaving}
                                            />
                                            <button
                                                onClick={() => handleSave(quest.id)}
                                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition"
                                                disabled={isSaving}
                                            >
                                                {isSaving ? "Đang lưu..." : "Lưu"}
                                            </button>
                                            <button
                                                onClick={() => setEditingQuestId(null)}
                                                className="px-3 py-2 rounded border ml-2"
                                                disabled={isSaving}
                                            >
                                                Hủy
                                            </button>
                                            {videoId && (
                                                <div className="w-full md:w-60 mt-2">
                                                    <iframe
                                                        width="100%"
                                                        height="120"
                                                        src={`https://www.youtube.com/embed/${videoId}`}
                                                        title="YouTube video preview"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                        className="rounded border"
                                                    ></iframe>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <span className="flex-1 text-gray-700 truncate">
                                                {quest.videoUrl ? (
                                                    <a href={quest.videoUrl} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">{quest.videoUrl}</a>
                                                ) : (
                                                    <span className="italic text-gray-400">Chưa có video</span>
                                                )}
                                            </span>
                                            <button
                                                onClick={() => handleEdit(quest)}
                                                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
                                            >
                                                Sửa
                                            </button>
                                            {quest.videoUrl && (
                                                <button
                                                    onClick={() => handleDelete(quest.id)}
                                                    className="bg-red-100 text-red-700 px-3 py-2 rounded hover:bg-red-200 transition ml-2"
                                                    disabled={isDeleting}
                                                >
                                                    {isDeleting ? "Đang xóa..." : "Xóa"}
                                                </button>
                                            )}
                                            {success === quest.id && (
                                                <span className="text-green-600 ml-2">✔ Đã lưu</span>
                                            )}
                                            {success === quest.id + "-delete" && (
                                                <span className="text-green-600 ml-2">✔ Đã xóa</span>
                                            )}
                                            {videoId && (
                                                <div className="w-full md:w-60 mt-2">
                                                    <iframe
                                                        width="100%"
                                                        height="120"
                                                        src={`https://www.youtube.com/embed/${videoId}`}
                                                        title="YouTube video preview"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                        className="rounded border"
                                                    ></iframe>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}