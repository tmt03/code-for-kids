"use client";

import { fetchAllChapters } from "@/apis";
import ProgressBar from "@/components/progressbar";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

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
    _destroy?: boolean;
    quests: Quest[];
};

export default function FooterChapter() {
    const router = useRouter();
    const params = useParams();
    const { questId } = params as { questId: string };
    const [quests, setQuests] = useState<Quest[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);

    useEffect(() => {
        const fetchQuests = async () => {
            try {
                const chapters = await fetchAllChapters();
                if (!Array.isArray(chapters)) {
                    throw new Error("Dữ liệu từ API không phải là mảng chapters");
                }

                const allQuests = chapters.flatMap((chapter: Chapter) => chapter.quests);
                setQuests(allQuests);

                const index = allQuests.findIndex((quest: Quest) => quest.id === questId);
                setCurrentIndex(index >= 0 ? index : null);
            } catch (error: any) {
                console.error("Lỗi khi fetch chapters:", error);
            }
        };
        fetchQuests();
    }, [questId]);

    // Chuyển đổi quests thành mảng chapters giả lập
    const chaptersFromQuests = useMemo(() => {
        return [{
            id: "all-quests",
            quests: quests.map(quest => ({
                id: parseInt(quest.id),
                type: quest.type as "quest" | "challenge",
                point: quest.point,
            })),
            status: "active",
        }];
    }, [quests]);

    // Hàm xử lý chuyển hướng khi nhấn nút
    const handleButtonClick = (direction: "prev" | "next") => {
        if (currentIndex === null || quests.length === 0) return;

        let newIndex;
        if (direction === "prev") {
            newIndex = currentIndex > 0 ? currentIndex - 1 : 0;
        } else {
            newIndex = currentIndex < quests.length - 1 ? currentIndex + 1 : quests.length - 1;
        }

        const newQuestId = quests[newIndex]?.id;
        if (newQuestId) {
            router.push(`/learn/quests/${newQuestId}`);
        }
    };

    return (
        <div className="lg:block h-20 w-full border-[#006D77] p-2">
            <div className="max-w-screen-lg flex items-center justify-around h-full mx-auto">
                <Button
                    variant="pixel"
                    className="w-20 bg-[#00A8B5] text-white hover:bg-[#0096A5] transition-colors duration-200"
                    onClick={() => handleButtonClick("prev")}
                    disabled={currentIndex === 0 || currentIndex === null}
                >
                    Trở Về
                </Button>
                <ProgressBar chapters={chaptersFromQuests} /> {/* Truyền chapters giả lập */}
                <Button
                    variant="pixel"
                    className="w-20 bg-[#00A8B5] text-white hover:bg-[#0096A5] transition-colors duration-200"
                    onClick={() => handleButtonClick("next")}
                    disabled={currentIndex === quests.length - 1 || currentIndex === null}
                >
                    Tiếp Theo
                </Button>
            </div>
        </div>
    );
}