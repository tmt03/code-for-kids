"use client";

import { useProgress } from "@/hooks/useProgress";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ChapterQuestPopup from "./quest-popup"; // <- Import component mới

type Quest = {
    id: string;
    name: string;
    description: string;
    point: number;
    baseCode?: string;
    solution?: string;
    type: string;
    imageUrl?: string;
    videoUrl?: string;
};

type Chapter = {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    isSpecial: boolean;
    quests: Quest[];
};

type Props = {
    chapters: Chapter[];
};

export default function ChapterList({ chapters }: Props) {
    const { progressSummary } = useProgress();
    const [selectedChapterForPopup, setSelectedChapterForPopup] = useState<Chapter | null>(null);
    const router = useRouter();

    const chapterStatus = progressSummary.badgeChapters

    const handleCardClick = (chapter: Chapter, e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).closest("button")) {
            return;
        }
        setSelectedChapterForPopup(chapter);
    };

    // Hàm đóng popup giờ đơn giản chỉ là set state về null
    const closePopup = () => {
        setSelectedChapterForPopup(null);
    };

    return (
        <div className="w-full p-4 bg-gradient-to-b from-[#B0E2FF] to-[#E6F0FA] rounded-lg shadow-[4px_4px_0px_0px_#1C6CA8]">
            <h2 className="text-4xl font-extrabold text-[#104A7A] text-center mb-6 animate-bounce">
                Chọn Chương Bạn Muốn Học
            </h2>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {chapters.map((chapter) => (
                    <div
                        key={chapter.id}
                        className={`w-full h-52 rounded-2xl border-4 border-[#1C6CA8] shadow-[6px_6px_0px_0px_#104A7A] relative flex flex-col items-center justify-center p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg 
                            ${chapter.isSpecial
                                ? "bg-gradient-to-r from-[#FFD700] to-[#FFB6C1]"
                                : "bg-gradient-to-r from-[#FFFACD] to-[#B0E2FF]"
                            }`}
                        onClick={(e) => handleCardClick(chapter, e)}
                    >
                        {/* Ô trạng thái - Đã giữ nguyên code bạn thêm */}
                        {chapterStatus.find((c) => c.chapterId === chapter.id)?.status && (
                            <div
                                className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold border-2 border-black shadow-[2px_2px_0px_0px_#000000] ${chapterStatus.find((c) => c.chapterId === chapter.id)?.status === "completed"
                                    ? "bg-[#32CD32] text-white"
                                    : chapterStatus.find((c) => c.chapterId === chapter.id)?.status === "in-progress"
                                        ? "bg-[#FFA500] text-white"
                                        : "bg-[#FF4500] text-white"
                                    }`}
                            >
                                {chapterStatus.find((c) => c.chapterId === chapter.id)?.status === "completed"
                                    ? "Đã Hoàn Thành"
                                    : chapterStatus.find((c) => c.chapterId === chapter.id)?.status === "in-progress"
                                        ? "Đang Tiến Hành"
                                        : "Chưa Bắt Đầu"}
                            </div>
                        )}

                        {/* Nội dung */}
                        <div className="flex flex-col items-center justify-center h-full pt-6">
                            <h3 className="text-2xl font-bold text-[#104A7A] text-center mb-2">{chapter.name}</h3>
                            <p className="text-base text-gray-700 text-center flex-1">{chapter.description}</p>
                        </div>

                        {/* Hiệu ứng đặc biệt cho chapter cuối - Đã giữ nguyên code comment */}
                        {chapter.isSpecial && (
                            <div className="absolute -top-3 -left-3 w-10 h-10 bg-[#FF1493] rounded-full border-2 border-black shadow-[2px_2px_0px_0px_#104A7A] flex items-center justify-center">
                                <span className="text-white text-base font-bold">★</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Sử dụng component Popup mới */}
            {/* Component này chỉ render khi selectedChapterForPopup có giá trị */}
            <ChapterQuestPopup chapter={selectedChapterForPopup} onClose={closePopup} />
        </div>
    );
}