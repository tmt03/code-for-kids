"use client";

import { fetchAllChapters, fetchLearnProgress } from "@/apis";
import Footer from "@/components/layouts/footer";
import Header from "@/components/layouts/header";
import ChapterList from "@/components/learn/chapters/chapter-list";
import CourseBadges from "@/components/learn/chapters/course-badges";
import CourseProgress from "@/components/learn/chapters/course-progress";
import { TrialBanner } from "@/components/trial/TrialBanner";
import { useProgress } from "@/hooks/useProgress";
import { useTrial } from "@/hooks/useTrial";
import { useEffect, useRef, useState } from "react";

export default function ChapterPage() {
    const { setProgressSummary } = useProgress();
    const [chapters, setChapters] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { isTrialMode, canAccessChapter } = useTrial();
    const hasLoadedRef = useRef(false);

    useEffect(() => {
        // Chỉ load một lần
        if (hasLoadedRef.current) return;
        hasLoadedRef.current = true;

        const loadData = async () => {
            try {
                setIsLoading(true);

                // Lấy tất cả chapters
                const chaptersData = await fetchAllChapters();

                // Lọc chapters cho trial mode
                let filteredChapters = chaptersData || [];
                if (isTrialMode) {
                    filteredChapters = chaptersData.filter((chapter: any) =>
                        canAccessChapter(chapter.id)
                    );
                }

                // Chỉ load progress nếu không phải trial mode
                let progress = null;
                if (!isTrialMode) {
                    progress = await fetchLearnProgress();
                } else {
                    // Set progress giả cho trial mode
                    progress = {
                        totalScore: 0,
                        completedQuests: 0,
                        completedChallenges: 0,
                        badgeChapters: [],
                        trialMode: true
                    };
                }

                setChapters(filteredChapters);
                setProgressSummary(progress);
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    if (isLoading) {
        return <div className="p-4 text-gray-700">Đang tải dữ liệu...</div>;
    }

    return (
        <div className="w-full flex flex-col min-h-screen">
            <Header />
            <div className="pt-16">
                <TrialBanner />
            </div>
            {/* Header Background */}
            <div
                className="w-full h-106 bg-cover bg-center"
                style={{
                    backgroundImage: "url('/assets/book_1/full_bia_to.png')",
                    backgroundPosition: "center 10%", // hoặc "50% 20%" để crop lên trên một chút
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat"
                }}
            ></div>
            <main className="w-full px-4 py-6 bg-gradient-to-b from-[#E8F1F2] to-[#D3E0E1]">
                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row flex-1 w-full">
                    {/* Phần hiển thị các chapter */}
                    <div className="w-full lg:w-4/5">
                        <ChapterList chapters={chapters} />
                    </div>

                    {/* Phần CourseProgress và CourseBadges */}
                    <div className="w-full lg:w-1/5 mt-6 lg:mt-0 lg:pl-6">
                        <div className="sticky top-6 flex flex-col gap-6">
                            <div>
                                <CourseProgress chapters={chapters} />
                            </div>
                            <div>
                                <CourseBadges />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <div className="w-full h-40 bg-gradient-to-r from-[#006D77] to-[#0A3D62]">
                <Footer />
            </div>
        </div>
    );
}