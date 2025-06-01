"use client"

import { fetchAllChapters } from "@/apis";
import ProgressBar from "@/components/progressbar";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
    const params = useParams(); // Lấy params từ URL
    const { questId } = params as { questId: string }; // Ép kiểu để lấy questId
    const [quests, setQuests] = useState<Quest[]>([]); // State để lưu danh sách quests
    const [currentIndex, setCurrentIndex] = useState<number | null>(null); // Index của quest hiện tại

    // Giả lập fetch danh sách quests (thay bằng API thực tế)
    useEffect(() => {
        const fetchQuests = async () => {
            try {
                const chapters = await fetchAllChapters();
                if (!Array.isArray(chapters)) {
                    throw new Error("Dữ liệu từ API không phải là mảng chapters");
                }

                //flatMap lấy các mảng (bao gồm các quests) của từng chapter gộp lại thành 1 mảng
                const allQuests = chapters.flatMap((chapter: Chapter) => chapter.quests);
                setQuests(allQuests);


                //Tìm vị trí của questId hiện tại
                const index = allQuests.findIndex((quest: Quest) => quest.id === questId);
                setCurrentIndex(index >= 0 ? index : null);
            } catch (error: any) {
                console.error("Lỗi khi fetch chapters:", error);
            }
        };
        fetchQuests();
    }, [questId]);

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
        <div className="lg:block h-20 w-full border-slate-200 p-2">
            <div className="max-w-screen-lg flex items-center justify-around h-full mx-auto">
                <Button
                    variant="pixel"
                    className="w-20"
                    onClick={() => handleButtonClick("prev")}
                    disabled={currentIndex === 0 || currentIndex === null}
                >
                    Trở Về
                </Button>
                <ProgressBar percentage={50} />
                <Button
                    variant="pixel"
                    className="w-20"
                    onClick={() => handleButtonClick("next")}
                    disabled={currentIndex === quests.length - 1 || currentIndex === null}
                >
                    Tiếp Theo
                </Button>
            </div>
        </div>
    );
}