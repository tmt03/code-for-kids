"use client";

import ChallengePopup from "@/components/companion/challenge-popup";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, MenuIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SidebarChapter() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [expandedChapters, setExpandedChapters] = useState<string[]>([]); // Theo dõi các chương được mở rộng
    const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
    const router = useRouter();

    // Danh sách các chương học (dữ liệu mẫu sau sẽ lấy dữ liệu từ DB)
    const chapters = [
        { section: "Hướng dẫn tân thủ", lessons: [] },
        { section: "Chương 1", lessons: ["01. Nhiệm vụ 1", "02. Nhiệm vụ 2", "03. Nhiệm vụ 3", "CHALLENGE"] },
        { section: "Chương 2", lessons: ["01. Nhiệm vụ 1"] },
        { section: "Chương 3", lessons: [] },
        { section: "Chương 4", lessons: [] },
        { section: "Chương 5", lessons: [] },
        { section: "Chương 6", lessons: [] },
        { section: "Chương 7", lessons: [] },
    ];

    // Hàm toggle mở rộng/thu gọn chương
    const toggleChapter = (section: string) => {
        if (expandedChapters.includes(section)) {
            setExpandedChapters(expandedChapters.filter((s) => s !== section));
        } else {
            setExpandedChapters([...expandedChapters, section]);
        }
    };

    // Hàm xử lý chuyển hướng khi nhấn vào lesson (ngoại trừ CHALLENGE)
    const handleLessonClick = (lesson: string, chapterIndex: number) => {
        if (lesson === "CHALLENGE") {
            // Mở popup khi nhấn vào CHALLENGE
            handleChallengeClick(`Thử thách ${chapters[chapterIndex].section}`);
        } else {
            // Điều hướng cho các lesson khác
            router.push(`/learn/chapters/${chapterIndex + 1}`);
        }
    };

    // Hàm mở popup khi nhấn vào CHALLENGE
    const handleChallengeClick = (challengeTitle: string) => {
        setSelectedChallenge(challengeTitle);
    };

    // Hàm đóng popup
    const closePopup = () => {
        setSelectedChallenge(null);
    };

    return (
        <div className="relative">
            {/* Nút Menu Hamburger */}
            <Button
                variant="default"
                className="w-20 mr-2 shadow-[0px_0px_0px_0px_#000000]"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                {isSidebarOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </Button>

            {/* Sidebar */}
            {isSidebarOpen && (
                <div className="absolute bottom-20 left-0 w-64 bg-[#1C2526] text-white rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#000000] z-50 p-4 max-h-[70vh] overflow-y-auto">
                    <h2 className="text-lg font-bold mb-2">Book 1: Phưu Lưu Ở Thế Giới Coder</h2>
                    {chapters.map((chapter, index) => (
                        <div key={index} className="mb-2">
                            {/* Tiêu đề chương với nút toggle */}
                            <div
                                className="flex items-center justify-between cursor-pointer"
                                onClick={() => toggleChapter(chapter.section)}
                            >
                                <h3 className="text-md font-semibold">{chapter.section}</h3>
                                {chapter.lessons.length > 0 && (
                                    expandedChapters.includes(chapter.section) ? (
                                        <ChevronDown className="w-4 h-4 mr-2" />
                                    ) : (
                                        <ChevronRight className="w-4 h-4 mr-2" />
                                    )
                                )}
                            </div>

                            {/* Danh sách nhiệm vụ (hiển thị nếu chương được mở rộng) */}
                            {chapter.lessons.length > 0 && expandedChapters.includes(chapter.section) && (
                                <ul className="ml-6 mt-1">
                                    {chapter.lessons.map((lesson, lessonIndex) => (
                                        <li
                                            key={lessonIndex}
                                            className={`text-sm py-1 px-2 rounded-lg cursor-pointer ${lesson === "01. Nhiệm vụ 1"
                                                    ? "bg-yellow-500 text-black"
                                                    : "hover:bg-gray-600"
                                                }`}
                                            onClick={() => handleLessonClick(lesson, index)}
                                        >
                                            {lesson}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Hiển thị ChallengePopup khi selectedChallenge không null */}
            {selectedChallenge && (
                <ChallengePopup challengeTitle={selectedChallenge} onClose={closePopup} />
            )}
        </div>
    );
}