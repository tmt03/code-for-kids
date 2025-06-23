"use client"

import { fetchInitUserProgress } from "@/apis";
import { Button } from "@/components/ui/button";
import { useTrial } from "@/hooks/useTrial";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CourseCard() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { isTrialMode } = useTrial();
    const [isFlipped, setIsFlipped] = useState(false);

    const handleButtonClick = async () => {
        setIsLoading(true);
        try {
            if (isTrialMode) {
                router.push("/learn/chapters");
            } else {
                const progress = await fetchInitUserProgress();
                router.push(`/learn/chapters`);
            }
        } catch (error: any) {
            setIsLoading(false);
        }
    };

    const handleFlip = () => {
        setIsFlipped((prev) => !prev);
    };

    return (
        <div
            className="relative w-full aspect-[2/3] cursor-pointer group"
            onClick={handleFlip}
        >
            <div
                className={`relative w-full h-full transition-transform duration-500 [perspective:1000px]`}
            >
                <div
                    className={`absolute inset-0 w-full h-full [backface-visibility:hidden] transition-transform duration-500 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#000000] overflow-hidden bg-[#1C2526] ${isFlipped ? 'rotate-y-180' : ''}`}
                    style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                >
                    {/* Front Side */}
                    <div className="absolute inset-0">
                        <img
                            src="/assets/book_1/bia_truoc.png"
                            alt="Bìa trước"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    {/* Tag Độ khó & Thể loại */}
                    <div className="absolute top-3 right-3 flex flex-row gap-2 z-20">
                        <span className="inline-block bg-[#A3E635]/90 text-black text-xs font-semibold px-3 py-1 rounded-md shadow-[2px_2px_0px_0px_#000000]">Làm quen</span>
                        <span className="inline-block bg-[#A5B4FC]/90 text-black text-xs font-semibold px-3 py-1 rounded-md shadow-[2px_2px_0px_0px_#000000]">Code Game</span>
                        <span className="inline-block bg-[#FDBA74]/90 text-black text-xs font-semibold px-3 py-1 rounded-md shadow-[2px_2px_0px_0px_#000000]">Kể chuyện</span>
                    </div>
                    <div className="relative z-10 flex flex-col h-full p-3 text-white">
                        <div className="flex items-center justify-between gap-2">
                            {/* Có thể thêm tên sách ở đây nếu muốn */}
                        </div>
                        <div className="mt-auto flex justify-center">
                            <Button
                                onClick={(e) => { e.stopPropagation(); handleButtonClick(); }}
                                variant="pixelDanger"
                                className="text-white font-bold px-4 py-1 rounded-sm shadow-[2px_2px_0px_0px_#000000] hover:bg-[#FF6666] transition-colors"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Đang xử lý...' : 'Bắt đầu khóa học'}
                            </Button>
                        </div>
                    </div>
                </div>
                {/* Back Side */}
                <div
                    className={`absolute inset-0 w-full h-full [backface-visibility:hidden] transition-transform duration-500 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#000000] overflow-hidden bg-[#222C36] flex flex-col items-center justify-center text-white p-6 ${isFlipped ? '' : 'rotate-y-180'}`}
                    style={{ transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)' }}
                >
                    <h2 className="text-2xl font-bold mb-2 text-center">Khóa học Lập trình game sáng tạo</h2>
                    <p className="mb-4 text-center text-sm opacity-80">
                        Khám phá thế giới lập trình qua các chương truyện hấp dẫn, bài tập tương tác và trò chơi thú vị! Phù hợp cho trẻ em bắt đầu học code.
                    </p>
                    <Button
                        onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}
                        variant="default"
                        className="border-white text-white hover:bg-white hover:text-[#222C36] font-bold px-3 py-1 rounded-sm shadow-[2px_2px_0px_0px_#000000] transition-colors"
                    >
                        Quay lại
                    </Button>
                </div>
            </div>
        </div>
    );
}