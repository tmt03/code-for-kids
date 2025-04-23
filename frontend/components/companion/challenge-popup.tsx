"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface ChallengeLevel {
    level: "easy" | "medium" | "hard";
    difficulty: string;
    points: number;
    color: string;
    details: string;
    timeLimit: string;
}

interface ChallengePopupProps {
    challengeTitle: string;
    onClose: () => void;
}

export default function ChallengePopup({ challengeTitle, onClose }: ChallengePopupProps) {
    const [hoveredLevel, setHoveredLevel] = useState<string | null>(null);
    const router = useRouter();

    // Hàm xử lý chuyển hướng khi nhấn nút
    const handleButtonClick = (chapterId: number) => {
        router.push(`/learn/chapters/${chapterId}`);
    };

    const challengeLevels: ChallengeLevel[] = [
        {
            level: "easy",
            difficulty: "Dễ",
            points: 10,
            color: "bg-[#32CD32]",
            details: "Hoàn thành thử thách trong 10 phút với ít nhất 80% độ chính xác.",
            timeLimit: "10 phút",
        },
        {
            level: "medium",
            difficulty: "Trung Bình",
            points: 20,
            color: "bg-[#FFD700]",
            details: "Hoàn thành thử thách trong 5 phút với ít nhất 90% độ chính xác.",
            timeLimit: "20 phút",
        },
        {
            level: "hard",
            difficulty: "Khó",
            points: 30,
            color: "bg-[#FF4040]",
            details: "Hoàn thành thử thách trong 3 phút với 100% độ chính xác.",
            timeLimit: "30 phút",
        },
    ];

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-[50px] bg-opacity-30">
            <div className="bg-[#B0E2FF] p-6 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#000000] w-[800px] max-w-[95vw]">
                {/* Tiêu đề */}
                <h3 className="text-2xl font-bold text-[#104A7A] mb-6 shadow-[0px_2px_0px_0px_#000000] text-center">
                    Challenge: {challengeTitle}
                </h3>

                {/* Danh sách mức độ - Xếp ngang */}
                <div className="flex justify-center gap-6">
                    {challengeLevels.map((level, index) => (
                        <div
                            key={level.level}
                            className={`w-36 h-52 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#000000] flex flex-col items-center justify-between p-4 transition-all duration-300 ${level.color} ${hoveredLevel === level.level
                                ? "scale-190 shadow-[6px_6px_0px_0px_#000000]"
                                : "hover:rotate-2 hover:shadow-[6px_6px_0px_0px_#000000]"
                                } cursor-pointer`}
                            onMouseEnter={() => setHoveredLevel(level.level)}
                            onMouseLeave={() => setHoveredLevel(null)}
                            onClick={() => handleButtonClick(index + 1)} // Thêm sự kiện onClick
                        >
                            {/* Tiêu đề mức độ */}
                            <h4 className="text-lg font-bold text-white text-center">
                                {level.difficulty}
                            </h4>

                            {/* Icon lá bài */}
                            <div className="w-12 h-12 bg-white rounded-full border-2 border-black flex items-center justify-center">
                                <span className="text-2xl">🎴</span>
                            </div>

                            {/* Điểm số */}
                            <p className="text-sm text-white text-center">
                                Điểm: {level.points}
                            </p>

                            {/* Giới hạn thời gian */}
                            <p className="text-sm text-white text-center">
                                Thời gian: {level.timeLimit}
                            </p>

                            {/* Thông tin chi tiết - Hiện khi hover */}
                            {hoveredLevel === level.level && (
                                <p className="text-xs text-white mt-2 text-center animate-fadeIn">
                                    {level.details}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Chú thích màu */}
                <div className="mt-6 flex justify-center gap-4 text-sm text-gray-700">
                    <p className="flex items-center gap-2">
                        <span className="w-4 h-4 bg-[#32CD32] rounded-full border-2 border-black"></span>
                        Dễ
                    </p>
                    <p className="flex items-center gap-2">
                        <span className="w-4 h-4 bg-[#FFD700] rounded-full border-2 border-black"></span>
                        Trung Bình
                    </p>
                    <p className="flex items-center gap-2">
                        <span className="w-4 h-4 bg-[#FF4040] rounded-full border-2 border-black"></span>
                        Khó
                    </p>
                </div>

                {/* Nút đóng */}
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={onClose}
                        className="px-4 py-1 bg-[#FF4040] text-white font-bold rounded-sm border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:bg-[#FF6666] transition-colors"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}