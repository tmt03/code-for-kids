"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import ChallengePopup from "./challenge-popup";

type ChapterStatus = "completed" | "in-progress" | "not-started";

interface Task {
    id: number;
    title: string;
    isChallenge?: boolean;
}

interface Chapter {
    id: number;
    title: string;
    description: string;
    status: ChapterStatus;
    isSpecial?: boolean;
    tasks: Task[];
}

interface ChapterListProps {
    chapters: Chapter[];
}

export default function ChapterList({ chapters }: ChapterListProps) {
    const [flipped, setFlipped] = useState<number | null>(null);
    const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
    const router = useRouter();

    const handleCardClick = (chapterId: number, e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).closest("button")) return;
        setFlipped(flipped === chapterId ? null : chapterId);
    };

    // Hàm xử lý chuyển hướng khi nhấn nút
    const handleButtonClick = (chapterId: number) => {
        router.push(`/learn/chapters/${chapterId}`);
    };

    // Hàm mở popup khi nhấn vào CHALLENGE
    const handleChallengeClick = (challengeTitle: string) => {
        setSelectedChallenge(challengeTitle);
    };

    // Hàm đóng popup
    const closePopup = () => {
        setSelectedChallenge(null);
    };

    return (
        <div className="w-full">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#104A7A] tracking-wide shadow-[0px_3px_0px_0px_#000000]">
                Chọn Chapter Để Học
            </h2>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {chapters.map((chapter) => (
                    <div
                        key={chapter.id}
                        className={`w-full h-40 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#000000] relative transition-transform duration-500 [transform-style:preserve-3d] cursor-pointer ${flipped === chapter.id ? "[transform:rotateY(180deg)]" : ""
                            } ${chapter.isSpecial
                                ? "bg-gradient-to-r from-[#FFD700] to-[#FFA500]"
                                : "bg-[#B0E2FF]"
                            }`}
                        onClick={(e) => handleCardClick(chapter.id, e)}
                    >
                        {/* Mặt trước của thẻ */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center [backface-visibility:hidden]">
                            {/* Ô trạng thái */}
                            <div
                                className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold border-2 border-black shadow-[2px_2px_0px_0px_#000000] ${chapter.status === "completed"
                                    ? "bg-[#32CD32] text-white"
                                    : chapter.status === "in-progress"
                                        ? "bg-[#FFD700] text-black"
                                        : "bg-[#D3D3D3] text-black"
                                    }`}
                            >
                                {chapter.status === "completed"
                                    ? "Đã Hoàn Thành"
                                    : chapter.status === "in-progress"
                                        ? "Đang Học"
                                        : "Chưa Học"}
                            </div>

                            {/* Nội dung mặt trước */}
                            <h3 className="text-xl font-bold text-[#104A7A]">{chapter.title}</h3>
                            <p className="text-sm text-gray-700">{chapter.description}</p>
                            <Button
                                className={`mt-2 px-4 py-1 font-bold rounded-sm shadow-[2px_2px_0px_0px_#000000] transition-colors ${chapter.isSpecial
                                    ? "bg-[#FF1493] text-white hover:bg-[#FF69B4]"
                                    : "bg-[#FF4040] text-white hover:bg-[#FF6666]"
                                    }`}
                                onClick={() => handleButtonClick(chapter.id)} // Thêm sự kiện onClick
                            >
                                {chapter.isSpecial ? "Thử Thách Đặc Biệt" : "Bắt Đầu"}
                            </Button>

                            {/* Hiệu ứng đặc biệt cho chapter cuối */}
                            {chapter.isSpecial && (
                                <div className="absolute -top-2 -left-2 w-8 h-8 bg-[#FF1493] rounded-full border-2 border-black shadow-[2px_2px_0px_0px_#000000] flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">★</span>
                                </div>
                            )}
                        </div>

                        {/* Mặt sau của thẻ */}
                        <div
                            className={`absolute inset-0 flex flex-col items-center justify-center p-4 bg-[#E6F0FA] border-2 border-black rounded-lg [backface-visibility:hidden] [transform:rotateY(180deg)]`}
                        >
                            <h3 className="text-lg font-bold text-[#104A7A] mb-2">
                                Nhiệm Vụ - {chapter.title}
                            </h3>
                            <ul className="w-full text-sm text-gray-700 space-y-1">
                                {chapter.tasks.map((task) => (
                                    <li
                                        key={task.id}
                                        className={`flex items-center gap-2 ${task.isChallenge ? "text-[#FF1493] font-bold cursor-pointer hover:underline" : ""
                                            }`}
                                        onClick={() => task.isChallenge && handleChallengeClick(task.title)}
                                    >
                                        <span className="w-4 h-4 rounded-full border-2 border-black flex-shrink-0"></span>
                                        {task.isChallenge ? "CHALLENGE: " : ""}
                                        {task.title}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
            {/* Hiển thị popup nếu có CHALLENGE được chọn */}
            {selectedChallenge && (
                <ChallengePopup challengeTitle={selectedChallenge} onClose={closePopup} />
            )}
        </div>
    );
}