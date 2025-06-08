import { useProgress } from "@/hooks/useProgress";

interface CourseProgressProps {
    chapters: {
        id: string;
        quests: { id: number; type: "quest" | "challenge"; point?: number }[];
        status: string;
    }[];
}

export default function CourseProgress({ chapters }: CourseProgressProps) {
    const { progressSummary } = useProgress();

    // Tính toán tổng số Nhiệm Vụ hiện có
    const totalQuesst = chapters.reduce((total, chapter) => {
        return total + chapter.quests.filter((quest) => quest.type === "quest").length
    }, 0)

    // Tính toán tổng số Thử Thách hiện có
    const totalChallenge = chapters.reduce((total, chapter) => {
        return total + chapter.quests.filter((quest) => quest.type === "challenge").length
    }, 0)

    // Tính toán tổng số Score hiện có
    const totalScore = chapters.reduce((total, chapter) => {
        const chapterQuestsScore = chapter.quests.reduce(
            (questTotal, quest) => questTotal + (quest.point || 10), // Mặc định 10 nếu không có point
            0
        );
        return total + chapterQuestsScore;
    }, 0);

    const earnedScore = progressSummary.totalScore // Số score đang nhận được

    return (
        <div className="mt-4 p-4 bg-[#1C6CA8] rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#000000]">
            {/* Tiêu đề */}
            <h3 className="text-lg font-bold text-white tracking-wide mb-4">
                Tiến độ học tập
            </h3>

            {/* Exercises */}
            <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-[#B0E2FF] rounded-sm border-2 border-black flex items-center justify-center">
                    <span className="text-[#104A7A] text-sm font-bold">📘</span>
                </div>
                <div className="flex-1">
                    <div className="flex justify-between text-sm text-white">
                        <span>Nhiệm Vụ</span>
                        <span>
                            {progressSummary.completedQuests}/{totalQuesst}
                        </span>
                    </div>
                    <div className="w-full bg-[#4682B4] rounded-full h-2 border-2 border-black mt-1">
                        <div
                            className="bg-[#FFD700] h-1 rounded-full border-r-2 border-black transition-all duration-500"
                            style={{ width: `${(progressSummary.completedQuests / totalQuesst) * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Challenge Completed */}
            <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-[#B0E2FF] rounded-sm border-2 border-black flex items-center justify-center">
                    <span className="text-[#104A7A] text-sm font-bold">🖼️</span>
                </div>
                <div className="flex-1">
                    <div className="flex justify-between text-sm text-white">
                        <span>Thử Thách</span>
                        <span>
                            {progressSummary.completedChallenges}/{totalChallenge}
                        </span>
                    </div>
                    <div className="w-full bg-[#4682B4] rounded-full h-2 border-2 border-black mt-1">
                        <div
                            className="bg-[#FFD700] h-1 rounded-full border-r-2 border-black transition-all duration-500"
                            style={{ width: `${(progressSummary.completedChallenges / totalChallenge) * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* XP Earned */}
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#B0E2FF] rounded-sm border-2 border-black flex items-center justify-center">
                    <span className="text-[#104A7A] text-sm font-bold">⭐</span>
                </div>
                <div className="flex-1">
                    <div className="flex justify-between text-sm text-white">
                        <span>Điểm Thành Tựu</span>
                        <span>
                            {earnedScore}/{totalScore}
                        </span>
                    </div>
                    <div className="w-full bg-[#4682B4] rounded-full h-2 border-2 border-black mt-1">
                        <div
                            className="bg-[#FFD700] h-1 rounded-full border-r-2 border-black transition-all duration-500"
                            style={{ width: `${(earnedScore / totalScore) * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
}