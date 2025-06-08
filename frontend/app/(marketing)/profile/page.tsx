"use client";

import { fetchLearnProgress } from "@/apis"; // Giả sử API này có sẵn
import EditProfilePopup from "@/components/edit-profile-popup";
import { useAuth } from "@/hooks/useAuth";
import { useProgress } from "@/hooks/useProgress";
import { faCircle, faClock, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState("Bài đăng");
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { user, isLoading: isAuthLoading } = useAuth();
    const { progressSummary, setProgressSummary } = useProgress();


    // Mảng icon cho huy hiệu
    const badgeIcons = ["🔵", "🟣", "🔴", "🟡", "🟢", "🟠", "⭐"];
    // Tính số huy hiệu đã kiếm được
    const earnedBadges = progressSummary.badgeChapters.filter((ch) => ch.badgeEarned).length;
    const totalBadges = progressSummary.badgeChapters.length;

    // Tải dữ liệu tiến trình
    useEffect(() => {
        let isMounted = true;

        const loadProgress = async () => {
            try {
                setIsLoading(true);
                const progress = await fetchLearnProgress();
                if (isMounted) {
                    setProgressSummary(progress || {
                        totalScore: 0,
                        completedQuests: 0,
                        completedChallenges: 0,
                        badgeChapters: [],
                    });
                    setIsLoading(false);
                }
            } catch (error) {
                if (isMounted) {
                    console.error("Error loading progress:", error);
                    setIsLoading(false);
                }
            }
        };

        if (!isAuthLoading) {
            loadProgress();
        }

        return () => {
            isMounted = false;
        };
    }, [isAuthLoading, setProgressSummary]);

    // Giao diện tải
    if (isLoading || isAuthLoading) {
        return (
            <div className="w-full h-screen flex flex-col justify-center items-center bg-gray-50">
                <div className="text-lg font-semibold text-gray-700">Đang tải hồ sơ...</div>
                <svg
                    className="animate-spin h-8 w-8 text-blue-500 mt-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                    ></path>
                </svg>
            </div>
        );
    }

    // Kiểm tra user
    if (!user) {
        return (
            <div className="w-full h-screen flex flex-col justify-center items-center bg-gray-50">
                <div className="text-lg font-semibold text-gray-700">Không tìm thấy thông tin người dùng</div>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-hidden bg-gradient-to-b from-[#B0E2FF] to-[#E6F0FA] font-mono text-white min-h-screen flex flex-col">
            <div className="w-full max-w-6xl px-6 mx-auto pt-18">
                {/* Banner */}
                <div className="relative h-44 rounded-t-[5px] overflow-hidden">
                    <img
                        src={user?.bannerUrl || "assets/9285000.jpg"}
                        alt="Banner"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Avatar + name */}
                <div className="bg-[#1c1c2e] relative px-6 py-6 rounded-b-[5px]">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-4">
                            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden [box-shadow:0_0_10px_rgba(3,155,229),0_0_15px_rgba(79,195,247)]">
                                <img src={user?.avatarUrl || "/assets/default-avatar.png"} alt="Avatar" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-shadow">{user?.displayName}</h1>
                                <div className="text-md text-gray-300 text-shadow-sm">@{user?.username}</div>
                                <div className="text-sm text-gray-400 text-shadow-sm">
                                    <span>0 đang theo dõi</span>
                                    <span>
                                        <FontAwesomeIcon icon={faCircle} className="text-white fa-2xs px-2" />
                                    </span>
                                    <span>0 người theo dõi</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <button
                                onClick={() => setIsEditOpen(true)}
                                className="border border-[#4f4f6a] bg-[#1c1c2e] px-4 py-1.5 rounded text-sm hover:bg-[#2a2a4a] transition whitespace-nowrap shadow-md"
                            >
                                <FontAwesomeIcon icon={faPen} className="pr-2" /> Chỉnh sửa trang cá nhân
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="w-full pt-6 pb-10 flex-grow">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1 space-y-6">
                            <div className="bg-[#1c1c2e] rounded p-4 border border-[#3a3a5a] shadow-sm">
                                <h2 className="text-sm font-semibold mb-3 pb-2 border-b border-[#3a3a5a]">Tiểu sử</h2>
                                <p className="text-sm text-gray-400 mb-3">
                                    {user?.bio?.trim() || "Bạn chưa có gì trong tiểu sử. Hãy chỉnh sửa trang cá nhân để giới thiệu những điều thú vị về bản thân nhé!"}
                                </p>
                                <p className="text-sm text-gray-500">
                                    <FontAwesomeIcon icon={faClock} className="pr-2" />
                                    <span>Tham gia vào ngày 19 tháng 4, 2025</span>
                                </p>
                            </div>

                            {/* Phần hiển thị huy hiệu */}
                            <div className="bg-[#1c1c2e] rounded p-4 border border-[#3a3a5a] shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className="text-sm font-semibold text-white">Huy Hiệu</h2>
                                    <span className="text-sm text-white">{earnedBadges}/{totalBadges}</span>
                                </div>
                                <p className="text-sm text-gray-400 mb-3">
                                    Hoàn thành các Chapter để nhận được tất cả các huy hiệu
                                </p>
                                {earnedBadges > 0 ? (
                                    <div className="grid grid-cols-3 gap-3">
                                        {progressSummary.badgeChapters
                                            .filter((chapter) => chapter.badgeEarned)
                                            .map((chapter, index) => (
                                                <div key={chapter.chapterId} className="flex flex-col items-center">
                                                    <div
                                                        className={`w-10 h-10 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_#000000] flex items-center justify-center transition-transform hover:scale-110 ${chapter.isSpecial
                                                            ? "bg-gradient-to-r from-[#FFD700] to-[#FFA500]"
                                                            : "bg-[#FFD700]"
                                                            }`}
                                                    >
                                                        <span className="text-xl">{badgeIcons[index % badgeIcons.length]}</span>
                                                    </div>
                                                    <span className="text-xs text-gray-300 mt-2 text-center">
                                                        {chapter.isSpecial ? "Huy hiệu Đặc biệt" : `Chương ${chapter.chapterId}`}
                                                    </span>
                                                </div>
                                            ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400">Chưa có huy hiệu nào. Hoàn thành các chương để nhận huy hiệu!</p>
                                )}
                            </div>

                            <div className="bg-[#1c1c2e] rounded p-4 border border-[#3a3a5a] shadow-sm">
                                <h2 className="text-sm font-semibold mb-3 pb-2 border-b border-[#3a3a5a]">🏆 Bảng xếp hạng</h2>
                                <div className="flex items-center mt-4">
                                    <div className="w-6 text-white font-bold text-center">47</div>
                                    <div className="w-8 h-8 bg-gray-500 rounded-full mx-3"></div>
                                    <div className="flex flex-col text-sm text-white">
                                        <span className="font-semibold">{user?.displayName}</span>
                                        <span className="text-gray-400">@{user?.username}</span>
                                    </div>
                                    <div className="ml-auto font-semibold text-blue-400 text-sm">
                                        {user.ratingPoints} XP
                                    </div>
                                </div>
                                <Link
                                    href="/leaderboard"
                                    className="block text-center text-md text-blue-400 mt-4 hover:underline transition"
                                >
                                    Xem bảng xếp hạng
                                </Link>
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-6">
                            <div className="bg-[#1c1c2e] rounded p-4 border border-[#3a3a5a] shadow-sm">
                                <h2 className="text-sm font-semibold mb-3 pb-2 border-b border-[#3a3a5a]">Game đã ghim</h2>
                                <div className="border-2 border-dashed border-gray-600 rounded p-6 flex items-center justify-center min-h-[80px]">
                                    <div className="text-center text-gray-500 text-sm">Ghim một dự án game của bạn!</div>
                                </div>
                            </div>

                            {/* Phần thành tích */}
                            <div className="bg-[#1c1c2e] rounded p-4 border border-[#3a3a5a] shadow-sm">
                                <h2 className="text-sm font-semibold mb-3 pb-2 border-b border-[#3a3a5a]">Thành tích, thành tựu</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                                    <div>
                                        <div className="text-2xl font-bold text-blue-300">{progressSummary.completedQuests}</div>
                                        <div className="text-xs text-gray-400 uppercase mt-1">Nhiệm vụ đã học</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-blue-300">{progressSummary.completedChallenges}</div>
                                        <div className="text-xs text-gray-400 uppercase mt-1">Thử thách đã học</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-[#f0c419]">{user.ratingPoints}</div>
                                        <div className="text-xs text-gray-400 uppercase mt-1">Điểm kinh nghiệm</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-green-400">
                                            {progressSummary.badgeChapters.filter((b) => b.badgeEarned).length}
                                        </div>
                                        <div className="text-xs text-gray-400 uppercase mt-1">Số huy hiệu</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#1c1c2e] rounded p-4 border border-[#3a3a5a] shadow-sm">
                                <div className="flex space-x-1 mb-4 border-b border-[#3a3a5a]">
                                    {["Bài đăng", "Dự án", "Chứng chỉ"].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`px-4 py-2 text-sm border-b-2 transition-colors duration-150 ${activeTab === tab ? "border-[#f0c419] text-white" : "border-transparent text-gray-400 hover:text-gray-200"
                                                }`}
                                        >
                                            {`${tab} (0)`}
                                        </button>
                                    ))}
                                </div>
                                <div className="text-center text-sm text-gray-400 py-4 min-h-[50px]">
                                    {activeTab === "Bài đăng" && (
                                        <>
                                            Bạn chưa có bài đăng nào.{" "}
                                            <a href="#" className="text-blue-400 hover:underline">
                                                Hãy gửi lời chào tới cộng đồng nhé!
                                            </a>
                                        </>
                                    )}
                                    {activeTab === "Dự án" && <>Bạn chưa có dự án nào.</>}
                                    {activeTab === "Chứng chỉ" && <>Bạn chưa có chứng chỉ nào.</>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <EditProfilePopup isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />
        </div>
    );
}