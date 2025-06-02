"use client";

import { useProgress } from "@/hooks/useProgress";
import { useMemo } from "react";

// Định nghĩa type cho chapters
interface Chapter {
    id: string;
    quests: { id: number; type: "quest" | "challenge"; point?: number }[];
    status: string;
}

type ProgressBarProps = {
    chapters?: Chapter[]; // Tùy chọn, chỉ cần khi tự tính toán
    percentage?: number;  // Tùy chọn, dùng khi truyền trực tiếp
};

export default function ProgressBar({ chapters, percentage }: ProgressBarProps) {
    const { progressSummary } = useProgress();

    // Nếu có percentage từ prop, sử dụng nó; nếu không, tự tính toán
    const calculatedPercentage = typeof percentage === "number" ? percentage : 0;
    const useCalculated = typeof percentage === "number";

    // Tính tổng số Quests và Challenges từ chapters nếu cần
    const totalQuests = useMemo(() => {
        return chapters?.reduce((total, chapter) => {
            return total + chapter.quests.filter((quest) => quest.type === "quest").length;
        }, 0) ?? 0;
    }, [chapters]);

    const totalChallenges = useMemo(() => {
        return chapters?.reduce((total, chapter) => {
            return total + chapter.quests.filter((quest) => quest.type === "challenge").length;
        }, 0) ?? 0;
    }, [chapters]);

    // Lấy completedQuests và completedChallenges
    const completedQuests = progressSummary?.completedQuests ?? 0;
    const completedChallenges = progressSummary?.completedChallenges ?? 0;

    // Tính percentage nếu không có từ prop
    const internalPercentage = !useCalculated && (totalQuests + totalChallenges) > 0
        ? ((completedQuests + completedChallenges) / (totalQuests + totalChallenges)) * 100
        : 0;

    // Sử dụng percentage từ prop hoặc tự tính
    const finalPercentage = useCalculated ? calculatedPercentage : internalPercentage;

    // Đảm bảo phần trăm nằm trong khoảng 0-100
    const clampedPercentage = Math.min(100, Math.max(0, finalPercentage));

    // Điều chỉnh vị trí của hiệp sĩ để không vượt ra ngoài khi percentage = 100
    const knightPosition = clampedPercentage === 100
        ? "calc(100% - 64px)"
        : `calc(${clampedPercentage}% - 40px)`; // Tinh chỉnh khoảng cách

    return (
        <div className="relative w-full h-full max-w-md py-8 flex items-center">
            {/* Thanh Progress */}
            <div className="w-full h-8 bg-[#D3D3D3] border-2 border-black shadow-[2px_2px_0px_0px_#000000] rounded-lg overflow-hidden">
                {/* Phần trăm hoàn thành */}
                <div
                    className="h-full bg-[#FFE082] border-black transition-all duration-500"
                    style={{ width: `${clampedPercentage}%` }}
                >
                    <span className="absolute inset-0 flex items-center justify-center text-black text-sm">
                        {clampedPercentage.toFixed(2)}% {/* Chỉ hiển thị 2 chữ số sau dấu chấm */}
                    </span>
                </div>
            </div>
            {/* Hiệp sĩ di chuyển theo tiến độ */}
            <div
                className="absolute top-[-12px] transition-all duration-500 animate-bounce z-10"
                style={{ left: knightPosition }}
            >
                <img
                    src="/assets/knight-avatar.png"
                    alt="Knight"
                    className="w-16 h-20 object-contain"
                    style={{ imageRendering: "pixelated" }}
                />
            </div>
        </div>
    );
}