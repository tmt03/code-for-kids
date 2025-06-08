"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import GameCanvas from "@/components/game-canvas";
import { Button } from "@/components/ui/button";

interface SharedGame {
    title: string;
    username: string;
    description: string;
    code: string;
    updatedAt: string;
    mode: "creative" | "learning";
}

export default function SharedGamePage() {
    const router = useRouter();
    const { slug } = router.query;
    const [gameData, setGameData] = useState<SharedGame | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load game data
    useEffect(() => {
        if (!slug) return;

        const loadGame = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/v1/user-game/share-game/${slug}`);
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || "Lỗi khi tải game");
                }
                setGameData(data);
                // Load code vào GameCanvas
                window.dispatchEvent(
                    new CustomEvent("run-user-code", {
                        detail: { code: data.code },
                    })
                );
            } catch (err: any) {
                setError(err.message || "Không thể tải game");
            } finally {
                setIsLoading(false);
            }
        };

        loadGame();
    }, [slug]);

    if (isLoading) {
        return (
            <div className="w-full h-screen flex flex-col justify-center items-center bg-gray-50">
                <div className="text-lg font-semibold text-gray-700">Đang tải game...</div>
                <svg
                    className="animate-spin h-8 w-8 text-blue-500 mt-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                    ></path>
                </svg>
            </div>
        );
    }

    if (error || !gameData) {
        return (
            <div className="w-full h-screen flex flex-col justify-center items-center bg-gray-50">
                <div className="text-lg font-semibold text-gray-700">{error || "Không tìm thấy game"}</div>
                <Button
                    onClick={() => router.push("/")}
                    variant="pixel"
                    size="lg"
                    className="mt-4"
                >
                    Quay lại trang chủ
                </Button>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gradient-to-b from-[#B0E2FF] to-[#E6F0FA] p-4">
            <div className="max-w-7xl mx-auto">
                {/* Game Info */}
                <div className="bg-[#1c1c2e] rounded-lg p-6 border border-[#3a3a5a] mb-4">
                    <h1 className="text-2xl font-bold text-white">{gameData.title}</h1>
                    <p className="text-sm text-gray-300 mt-2">Tạo bởi: {gameData.username}</p>
                    <p className="text-sm text-gray-300 mt-2">
                        Chế độ: {gameData.mode === "creative" ? "Sáng tạo" : "Học tập"}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">{gameData.description}</p>
                    <p className="text-xs text-gray-500 mt-2">
                        Cập nhật: {new Date(gameData.updatedAt).toLocaleDateString("vi-VN")}
                    </p>
                </div>

                {/* Game Canvas */}
                <div className="w-full aspect-[2/1] min-h-[360px] max-h-[1440px]">
                    <GameCanvas quest={{ id: gameData.mode, mode: gameData.mode, code: gameData.code }} />
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-4">
                    <Button
                        onClick={() => router.push("/")}
                        variant="pixel"
                        size="lg"
                    >
                        Quay lại
                    </Button>
                    <Button
                        onClick={() => {
                            alert("Tính năng Remix đang được phát triển!");
                        }}
                        variant="pixelYellow"
                        size="lg"
                    >
                        Remix game
                    </Button>
                </div>
            </div>
        </div>
    );
}