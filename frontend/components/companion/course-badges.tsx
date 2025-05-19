interface CourseBadgesProps {
    chapters: Array<{
        id: number;
        title: string;
        description: string;
        status: "completed" | "in-progress" | "not-started";
        isSpecial?: boolean;
        tasks: Array<{ id: number; title: string; isChallenge?: boolean }>;
    }>;
}

export default function CourseBadges({ chapters }: CourseBadgesProps) {
    const totalBadges = chapters.length; // 7 chapters = 7 badges
    const earnedBadges = chapters.filter((chapter) => chapter.status === "completed").length; // 2 badges

    // Danh sách icon placeholder cho huy hiệu (có thể thay bằng hình ảnh thực tế)
    const badgeIcons = ["🔵", "🟣", "🔴", "🟡", "🟢", "🟠", "⭐"];

    return (
        <div className="mt-4 p-4 bg-[#1C6CA8] rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#000000]">
            {/* Tiêu đề */}
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-white">
                    Huy Hiệu
                </h3>
                <span className="text-sm text-white">
                    {earnedBadges}/{totalBadges}
                </span>
            </div>

            {/* Mô tả */}
            <p className="text-1sm text-white mb-4">
                Hoàn thành các Chapter để nhận được tất cả các huy hiệu
            </p>

            {/* Danh sách huy hiệu */}
            <div className="grid grid-cols-4 gap-3">
                {chapters.map((chapter, index) => (
                    <div key={chapter.id} className="flex flex-col items-center">
                        <div
                            className={`w-10 h-10 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_#000000] flex items-center justify-center transition-transform hover:scale-110 ${chapter.status === "completed"
                                ? chapter.isSpecial
                                    ? "bg-gradient-to-r from-[#FFD700] to-[#FFA500]"
                                    : "bg-[#FFD700]"
                                : "bg-gray-400 opacity-50"
                                }`}
                        >
                            <span className="text-xl">{badgeIcons[index]}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}