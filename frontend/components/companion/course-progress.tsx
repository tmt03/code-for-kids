interface CourseProgressProps {
    chapters: Array<{
        id: number;
        title: string;
        description: string;
        status: "completed" | "in-progress" | "not-started";
        isSpecial?: boolean;
        tasks: Array<{ id: number; title: string; isChallenge?: boolean }>;
    }>;
}

export default function CourseProgress({ chapters }: CourseProgressProps) {
    // Tính toán số Nhiệm Vụ (SỬA SAU)
    const totalExercises = chapters.reduce((total, chapter) => total + (chapter.tasks.length - 1), 0); //Tính tổng Nhiệm Vụ
    const completedExercises = chapters
        .filter((chapter) => chapter.status === "completed")
        .reduce((total, chapter) => total + (chapter.tasks.length - 1), 0); // 2 chapters hoàn thành × 4 tasks = 8

    // Tính toán số Thử Thách (SỬA SAU)
    const totalChallenge = 10; // Chapter 4 và Chapter 7
    const completedProjects = chapters.filter(
        (chapter) => (chapter.id === 4 || chapter.id === 7) && chapter.status === "completed"
    ).length; // Chapter 4 hoàn thành, Chapter 7 chưa hoàn thành

    // Tính toán XP - Giả sử: 5 XP/task, 50 XP/chapter hoàn thành
    const totalXP = 605; // Tổng XP tối đa
    const earnedXP =
        completedExercises * 5 + // XP từ tasks
        chapters.filter((chapter) => chapter.status === "completed").length * 50; // XP từ chapters

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
                            {completedExercises}/{totalExercises}
                        </span>
                    </div>
                    <div className="w-full bg-[#4682B4] rounded-full h-2 border-2 border-black mt-1">
                        <div
                            className="bg-[#FFD700] h-1 rounded-full border-r-2 border-black transition-all duration-500"
                            style={{ width: `${(completedExercises / totalExercises) * 100}%` }}
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
                            {completedProjects}/{totalChallenge}
                        </span>
                    </div>
                    <div className="w-full bg-[#4682B4] rounded-full h-2 border-2 border-black mt-1">
                        <div
                            className="bg-[#FFD700] h-1 rounded-full border-r-2 border-black transition-all duration-500"
                            style={{ width: `${(completedProjects / totalChallenge) * 100}%` }}
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
                            {earnedXP}/{totalXP}
                        </span>
                    </div>
                    <div className="w-full bg-[#4682B4] rounded-full h-2 border-2 border-black mt-1">
                        <div
                            className="bg-[#FFD700] h-1 rounded-full border-r-2 border-black transition-all duration-500"
                            style={{ width: `${(earnedXP / totalXP) * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
}