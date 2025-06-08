"use client";

import { fetchLeaderboard, fetchLearnProgress } from "@/apis";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useProgress } from "@/hooks/useProgress";
import { faArrowRight, faFlagCheckered } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const { progressSummary, setProgressSummary } = useProgress();
    const [isLoading, setIsLoading] = useState(true);

    type LeaderboardUser = {
        username?: string;
        displayName?: string;
        avatarUrl?: string;
        ratingPoints?: number;
    };
    const [topUsers, setTopUsers] = useState<LeaderboardUser[]>([]);

    useEffect(() => {
        fetchLeaderboard()
            .then((users) => setTopUsers((users || []).slice(0, 3)))
            .catch(() => setTopUsers([]));
    }, []);

    // Tải dữ liệu tiến trình
    useEffect(() => {
        let isMounted = true;

        const loadProgress = async () => {
            try {
                setIsLoading(true);
                const progress = await fetchLearnProgress();
                if (isMounted) {
                    setProgressSummary(
                        progress || {
                            totalScore: 0,
                            completedQuests: 0,
                            completedChallenges: 0,
                            badgeChapters: [],
                        }
                    );
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
            <div className="w-full h-screen flex flex-col justify-center items-center bg-[#E8F1F2]">
                <div className="text-lg font-semibold text-gray-700">Đang tải trang chủ...</div>
                <svg
                    className="animate-spin h-8 w-8 text-[#00A8B5] mt-4"
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
            <div className="w-full h-screen flex flex-col justify-center items-center bg-[#E8F1F2]">
                <div className="text-lg font-semibold text-gray-700">Không tìm thấy thông tin người dùng</div>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-[#00A8B5] text-white rounded hover:bg-[#0096A5]"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    // Tính số huy hiệu đã kiếm được
    const earnedBadges = progressSummary.badgeChapters.filter((ch) => ch.badgeEarned).length;
    // Tính cấp độ dựa trên totalScore (100 XP = 1 level)
    const level = Math.floor(user.ratingPoints / 100) || 1;

    return (
        <div className="w-full overflow-x-hidden">
            <div className="pt-14 bg-gradient-to-b from-[#E8F1F2] to-[#D3E0E1]">
                {/* Nút chế độ sáng tạo */}
                <div className="flex justify-center mt-10">
                    <Link href="/learn/quests/creative">
                        <Button
                            variant="pixelGreen"
                            size="lg"
                            className="shadow-lg text-lg px-8 py-3 rounded-full border-2 border-[#00A8B5] hover:scale-105 transition-transform duration-200 bg-[#00A8B5] text-white hover:bg-[#0096A5]"
                        >
                            🚀 Chế độ sáng tạo
                        </Button>
                    </Link>
                </div>

                {/* Welcome Section (Luôn ở đầu) */}
                <section className="text-white py-4 px-4">
                    <div className="max-w-7xl mx-auto flex items-center">
                        <img src="/assets/knight-avatar.png" alt="Computer Icon" className="w-20 h-20" />
                        <div className="bg-[#0A3D62] border border-white rounded px-4 py-2 text-sm">
                            Chào mừng bạn quay trở lại, <span className="font-bold">{user?.displayName}</span> Cùng học thôi nào!
                        </div>
                    </div>
                </section>

                {/* Main Dashboard Section */}
                <section className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Jump Back In (Course) */}
                    <section className="bg-[#1b1b35] border border-white rounded-md p-4 text-white relative order-1 md:order-1 md:col-span-2 md:row-span-1">
                        <p className="text-sm mb-2 uppercase font-bold">Khóa học</p>
                        <h2 className="text-2xl font-bold">Sách 1: Hành trình phiêu lưu ở vương quốc Code-Land</h2>
                        <div className="flex gap-3 mt-5">
                            <Button
                                variant="pixel"
                                className="bg-[#00A8B5] text-white px-4 py-2 rounded hover:bg-[#0096A5] font-semibold"
                            >
                                <Link href="/learn/courses">Tiếp tục học</Link>
                            </Button>
                            <Button
                                variant="pixel"
                                className="bg-[#00A8B5] text-white px-4 py-2 rounded hover:bg-[#0096A5] font-semibold"
                            >
                                <Link href="/learn/chapters">Chi tiết khóa học</Link>
                            </Button>
                        </div>
                    </section>

                    {/* Profile Card */}
                    <div className="bg-[#0A3D62] border border-white rounded-lg p-4 text-white shadow-lg order-2 md:order-2 md:col-start-3 md:row-start-1 md:row-span-1">
                        <div className="flex items-center mb-4">
                            <img
                                src={user?.avatarUrl || "/images/avatar.png"}
                                alt="User Avatar"
                                className="w-12 h-12 rounded-full border-2 border-[#00A8B5] mr-4"
                            />
                            <div>
                                <h2 className="text-lg font-bold">{user?.displayName}</h2>
                                <p className="text-sm text-gray-300">Cấp {level}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-center mb-4">
                            <div>
                                <p className="text-[#00A8B5] font-semibold">{user.ratingPoints}</p>
                                <p className="text-gray-300">Điểm kinh nghiệm</p>
                            </div>
                            <div>
                                <p className="text-yellow-500 font-semibold">Unrank</p>
                                <p className="text-gray-300">Hạng</p>
                            </div>
                            <div>
                                <p className="text-purple-400 font-semibold">{earnedBadges}</p>
                                <p className="text-gray-300">Huy hiệu</p>
                            </div>
                        </div>
                        <Link
                            href="/profile"
                            className="w-full text-center bg-[#00A8B5] hover:bg-[#0096A5] transition rounded-md py-1.5 font-semibold text-white block"
                        >
                            Xem trang cá nhân
                        </Link>
                    </div>

                    {/* Upcoming Events */}
                    <div className="bg-[#0A3D62] border border-white rounded-lg p-4 text-white shadow-lg order-3 md:order-3 md:col-start-3 md:row-start-2 md:row-span-1 flex flex-col justify-between">
                        <h3 className="text-center text-lg font-bold mb-4">🏆 Bảng xếp hạng - Top 3 toàn thời gian</h3>
                        <ol className="space-y-2">
                            {topUsers.map((u, i) => (
                                <li key={u.username || i} className="flex items-center gap-2">
                                    <span
                                        className={`font-bold ${i === 0 ? "text-yellow-400"
                                            : i === 1 ? "text-gray-300"
                                                : i === 2 ? "text-orange-500" : "text-white"}`}
                                    >
                                        {i + 1}
                                    </span>
                                    <img
                                        src={u.avatarUrl || "/assets/knight-avatar.png"}
                                        alt={u.displayName || u.username}
                                        className="w-8 h-8 rounded-full border"
                                    />
                                    <span className="font-semibold">{u.displayName || u.username}</span>
                                    <span className="ml-auto text-[#00A8B5]">{u.ratingPoints} điểm</span>
                                </li>
                            ))}
                            {topUsers.length === 0 && <li className="text-gray-300">Chưa có dữ liệu</li>}
                        </ol>
                        <h4 className="text-center text-lg py-2">
                            <FontAwesomeIcon icon={faFlagCheckered} className="px-1 text-[#00A8B5]" /> Bạn đang ở đâu trong cuộc đua này?
                        </h4>
                        <Link
                            href="/leaderboard"
                            className="mt-4 block text-center bg-[#00A8B5] hover:bg-[#0096A5] transition rounded-md py-1.5 font-semibold text-white"
                        >
                            Hãy cùng xem bảng xếp hạng nhé!
                        </Link>
                    </div>

                    {/* New Tutorials */}
                    <section className="order-3 md:order-3 md:col-span-2 md:row-start-2 md:row-span-1">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">Hướng dẫn các khóa học mới</h2>
                            <a href="#" className="text-[#00A8B5] hover:text-[#0096A5] text-xl font-bold">
                                Xem tất cả <FontAwesomeIcon icon={faArrowRight} />
                            </a>
                        </div>
                        <div className="text-white grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                { title: "Thêm hiệu ứng cho ảnh với CSS keyframes", tag: "HTML", level: "Nhập môn" },
                                { title: "Clone và pull dự án trên GitHub với GitBash", tag: "Git", level: "Cơ bản" },
                                { title: "Lập trình game 2D với Phaser.js", tag: "JavaScript", level: "Nâng cao" },
                            ].map((tutorial, i) => (
                                <Link
                                    key={i}
                                    href="/"
                                    className="border border-white rounded-md p-4 bg-[#1b1b35] hover:bg-[#2a2a4a] transition duration-200"
                                >
                                    <div className="h-32 bg-gray-700 mb-2 rounded"></div>
                                    <p className="text-xs mb-1 uppercase">Tutorial</p>
                                    <h3 className="font-bold text-sm mb-2">{tutorial.title}</h3>
                                    <div className="flex gap-2 text-xs">
                                        <span className="bg-gray-600 px-2 py-1 rounded">{tutorial.level}</span>
                                        <span className="bg-[#00A8B5] px-2 py-1 rounded">{tutorial.tag}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                </section>

                {/* Club Promo (Luôn ở gần cuối, trước Footer) */}
                <section className="max-w-5xl mx-auto py-8 px-4 text-white">
                    <div className="bg-[#0A3D62] border border-white rounded-md p-4 text-center">
                        <p className="text-[#00A8B5] font-bold mb-2">HỘI VIÊN CAO CẤP (PREMIUM MEMBERSHIP)</p>
                        <h3 className="text-lg font-bold mb-2">Trải nghiệm học tập không giới hạn</h3>
                        <p className="text-sm mb-4">Hãy tham gia ngay để mở khóa tất cả các khóa học, nhận sự trợ giúp từ các chuyên gia lập trình hàng đầu, và hơn nữa.</p>
                        <button className="border border-[#00A8B5] py-2 font-bold px-4 rounded hover:bg-[#00A8B5] hover:text-white transition">
                            Tìm hiểu thêm
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}