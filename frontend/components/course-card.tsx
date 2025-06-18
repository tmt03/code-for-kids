"use client"

import { fetchInitUserProgress } from "@/apis";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTrial } from "@/hooks/useTrial";

export default function CourseCard() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { isTrialMode } = useTrial();

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

    return (
        <div className="relative w-full h-80 bg-[#1C2526] rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#000000] overflow-hidden">
            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/assets/book1-bg.png')" }}
            >
                <div className="absolute inset-0 bg-black opacity-60"></div>
            </div>

            <div className="relative z-10 flex flex-col h-full p-4 text-white">
                <div className="flex items-center justify-between gap-2">
                    <Button variant="pixelDanger" size="sm" className="bg-[#FF4040] shadow-[2px_2px_0px_0px_#000000]">
                        Sách 01
                    </Button>
                    <Button variant="pixelYellow" size="sm" className="shadow-[2px_2px_0px_0px_#000000]">
                        Độ khó: Làm quen
                    </Button>
                </div>
                <h3 className="mt-2 text-xl font-bold tracking-wide">Phiêu lưu ở thế giới code</h3>
                <p className="mt-1 text-[16px] leading-tight">Làm quen với việc học code thông qua trò chơi</p>
                <div className="mt-auto flex justify-end">
                    <Button
                        onClick={handleButtonClick}
                        variant="default"
                        className="bg-[#FF4040] text-white font-bold px-3 py-1 rounded-sm shadow-[2px_2px_0px_0px_#000000] hover:bg-[#FF6666] transition-colors"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Đang xử lý...' : 'Bắt đầu'}
                    </Button>
                </div>
            </div>
        </div>
    );
}