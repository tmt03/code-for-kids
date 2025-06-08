"use client";

import GameCanvas from "@/components/game-canvas";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/utils/axiosInstance";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SharedGame {
    title: string;
    username: string;
    description: string;
    code: string;
    updatedAt: string;
    mode: "creative" | "learning";
}

interface Quest {
    id: string;
    title: string;
    description: string;
    mode: "creative" | "learning";
    code: string;
    previewCode: string;
    hint: string;
    solution: string;
    nextQuestId: string | null;
    prevQuestId: string | null;
    order: number;
    isCompleted: boolean;
    isLocked: boolean;
    isHidden: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export default function SharedGamePage() {
    const router = useRouter();
    const { slug } = useParams();
    const [gameData, setGameData] = useState<SharedGame | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [quest, setQuest] = useState<Quest | null>(null);

    // Load game data
    useEffect(() => {
        const loadGame = async () => {
            if (!slug) return;

            console.log("Fetching game with slug:", slug);
            try {
                setIsLoading(true);
                const response = await axiosInstance.get(`/v1/user-game/shared-game/${slug}`);
                console.log("API Response status:", response.status);
                console.log("API Response headers:", response.headers);
                console.log("API Response data:", response.data);

                if (response.data) {
                    setGameData(response.data);
                    const newQuest: Quest = {
                        id: "creative",
                        title: response.data.title,
                        description: response.data.description,
                        mode: response.data.mode,
                        code: response.data.code,
                        previewCode: response.data.code, // Use the same code for preview
                        hint: "",
                        solution: "",
                        nextQuestId: null,
                        prevQuestId: null,
                        order: 0,
                        isCompleted: false,
                        isLocked: false,
                        isHidden: false,
                        isDeleted: false,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    };
                    setQuest(newQuest);
                }
            } catch (error: any) {
                console.error("Error loading game - Full error:", error);
                console.error("Error response data:", error.response?.data);
                console.error("Error response status:", error.response?.status);
                console.error("Error response headers:", error.response?.headers);
                setError(error.response?.data?.message || "Failed to load game");
            } finally {
                setIsLoading(false);
            }
        };

        loadGame();
    }, [slug]);

    if (isLoading) {
        return (
            <div className="w-full h-screen flex flex-col justify-center items-center bg-gradient-to-b from-[#B0E2FF] to-[#E6F0FA]">
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
            <div className="w-full h-screen flex flex-col justify-center items-center bg-gradient-to-b from-[#B0E2FF] to-[#E6F0FA]">
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
                    <p className="text-sm text-gray-400 mt-2">{gameData.description}</p>
                    <p className="text-xs text-gray-500 mt-2">
                        Cập nhật: {new Date(gameData.updatedAt).toLocaleDateString("vi-VN")}
                    </p>
                </div>

                {/* Game Canvas */}
                <div className="w-full aspect-[2/1] min-h-[360px] max-h-[1440px]">
                    <GameCanvas quest={{ id: "shared", mode: "creative", code: gameData.code }} />
                </div>

                {/* Actions */}
                <div className="mt-4 flex justify-center">
                    <Button
                        onClick={() => router.push("/")}
                        variant="pixel"
                        size="lg"
                    >
                        Quay lại trang chủ
                    </Button>
                </div>
            </div>
        </div>
    );
}