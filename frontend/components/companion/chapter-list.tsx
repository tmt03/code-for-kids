"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import ChapterTaskPopup from "./chapter-task-popup"; // <- Import component mới

// Định nghĩa kiểu dữ liệu (có thể import nếu đã tách ra file riêng)
type ChapterStatus = "completed" | "in-progress" | "not-started";
interface Task { id: number; title: string; isChallenge?: boolean; }
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
    const [selectedChapterForPopup, setSelectedChapterForPopup] = useState<Chapter | null>(null);
    const router = useRouter();

    const handleCardClick = (chapter: Chapter, e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).closest('button')) {
            return;
        }
        setSelectedChapterForPopup(chapter);
    };

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>, chapterId: number) => {
        e.stopPropagation();
        router.push(`/learn/chapters/${chapterId}`);
    };

    // Hàm đóng popup giờ đơn giản chỉ là set state về null
    const closePopup = () => {
        setSelectedChapterForPopup(null);
    };

    return (
        <div className="w-full">
            <h2 className="text-3xl font-bold text-[#104A7A]">
                Chọn Chapter Để Học
            </h2>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {chapters.map((chapter) => (
                    <div
                        key={chapter.id}
                        // Giữ nguyên phần hiển thị thẻ chapter như trước
                        className={`w-full h-40 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#000000] relative flex flex-col items-center justify-center p-4 cursor-pointer transition-colors duration-200 hover:bg-opacity-80 ${
                            chapter.isSpecial
                                ? "bg-gradient-to-r from-[#FFD700] to-[#FFA500]"
                                : "bg-[#B0E2FF]"
                        }`}
                        onClick={(e) => handleCardClick(chapter, e)}
                    >
                        {/* Ô trạng thái */}
                         <div
                            className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold border-2 border-black shadow-[2px_2px_0px_0px_#000000] ${
                                chapter.status === "completed"
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

                        {/* Nội dung */}
                        <h3 className="text-xl font-bold text-[#104A7A] text-center">{chapter.title}</h3>
                        <p className="text-sm text-gray-700 text-center mt-1">{chapter.description}</p>
                        <Button
                            className={`mt-3 px-4 py-1 font-bold rounded-sm shadow-[2px_2px_0px_0px_#000000] transition-colors ${
                                chapter.isSpecial
                                    ? "bg-[#FF1493] text-white hover:bg-[#FF69B4]"
                                    : "bg-[#FF4040] text-white hover:bg-[#FF6666]"
                            }`}
                            onClick={(e) => handleButtonClick(e, chapter.id)}
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
                ))}
            </div>

            {/* Sử dụng component Popup mới */}
            {/* Component này chỉ render khi selectedChapterForPopup có giá trị */}
            <ChapterTaskPopup
                chapter={selectedChapterForPopup}
                onClose={closePopup}
            />
        </div>
    );
}