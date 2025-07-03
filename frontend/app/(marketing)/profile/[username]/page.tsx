"use client";

import { fetchLearnProgress, fetchUserProfileByUsername } from "@/apis";
import EditProfilePopup from "@/components/edit-profile-popup";
import { useAuth } from "@/hooks/useAuth";
import { useProgress } from "@/hooks/useProgress";
import axiosInstance from "@/lib/utils/axiosInstance";
import { faCircle, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUserOnlineStatus } from "@/hooks/useUserOnlineStatus";

interface SharedGame {
    slug: string;
    title: string;
    description: string;
    updatedAt: string;
}

export default function AdvancedProfilePage() {
    const params = useParams();
    const usernameParam = params.username as string;
    const [profileUser, setProfileUser] = useState<any>(null);
    const [activeTab, setActiveTab] = useState("Bài đăng");
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { user, isLoading: isAuthLoading } = useAuth();
    const { progressSummary, setProgressSummary } = useProgress();
    const [sharedGames, setSharedGames] = useState<SharedGame[]>([]);
    const router = useRouter();

    // Lấy trạng thái online của user đang xem
    const isOnline = useUserOnlineStatus(profileUser?._id ?? "");

    // Mảng icon cho huy hiệu
    const badgeIcons = ["🔵", "🟣", "🔴", "🟡", "🟢", "🟠", "⭐"];

    // Kiểm tra có phải profile của chính mình không
    const isOwnProfile = user?.username === usernameParam;

    // Tải dữ liệu user profile
    useEffect(() => {
        let isMounted = true;
        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                const userData = await fetchUserProfileByUsername(usernameParam);
                if (isMounted) setProfileUser(userData);
            } catch (error) {
                if (isMounted) setProfileUser(null);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };
        if (usernameParam) fetchProfile();
        return () => { isMounted = false; };
    }, [usernameParam]);

    // Tải dữ liệu tiến trình (nếu là profile của chính mình)
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
                }
            } catch (error) {
                if (isMounted) {
                    setProgressSummary({
                        totalScore: 0,
                        completedQuests: 0,
                        completedChallenges: 0,
                        badgeChapters: [],
                    });
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };
        if (isOwnProfile) loadProgress();
        return () => { isMounted = false; };
    }, [isOwnProfile, setProgressSummary]);

    // Tải game đã chia sẻ của bất kỳ user nào (không chỉ của mình)
    useEffect(() => {
        const fetchSharedGames = async () => {
            try {
                const res = await axiosInstance.get(`/v1/user-game/shared-games/${usernameParam}`);
                setSharedGames(res.data || []);
            } catch (e) {
                setSharedGames([]);
            }
        };
        if (usernameParam) fetchSharedGames();
    }, [usernameParam]);

    // Giao diện tải
    if (isLoading || isAuthLoading) {
        return (
            <div className="w-full h-screen flex flex-col justify-center items-center bg-[#E8F1F2]">
                <div className="text-lg font-semibold text-gray-700">Đang tải hồ sơ...</div>
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

    if (!profileUser) {
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
    const earnedBadges = isOwnProfile
        ? progressSummary.badgeChapters.filter((ch) => ch.badgeEarned).length
        : profileUser.badgesCount ?? 0;

    return (
        <div className="w-full overflow-x-hidden bg-gradient-to-b from-[#E8F1F2] to-[#D3E0E1] font-mono text-white min-h-screen flex flex-col">
            <div className="w-full max-w-6xl px-6 mx-auto pt-18">
                {/* Banner */}
                <div className="relative h-44 rounded-t-[5px] overflow-hidden">
                    <img
                        src={profileUser?.bannerUrl || "/assets/9285000.jpg"}
                        alt="Banner"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Avatar + name */}
                <div className="bg-[#0A3D62] relative px-6 py-6 rounded-b-[5px]">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <div
                                    className={`w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden ${
                                        profileUser.isActivated
                                            ? "ring-4 ring-yellow-400"
                                            : "ring-4 ring-blue-400"
                                    }`}
                                >
                                    <img src={profileUser?.avatarUrl || "/assets/mascots/original.png"} alt="Avatar" />
                                </div>
                                {/* Chấm tròn trạng thái online */}
                                <span
                                    className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 ${
                                        isOnline
                                            ? "bg-green-500 border-white"
                                            : "bg-gray-500 border-white"
                                    }`}
                                    title={isOnline ? "Đang online" : "Offline"}
                                ></span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-shadow">{profileUser.displayName ? profileUser.displayName : "Anh hùng ẩn danh"}</h1>
                                <div className="text-sm text-gray-400 text-shadow-sm">
                                    <span>0 đang theo dõi</span>
                                    <span>
                                        <FontAwesomeIcon icon={faCircle} className="text-white fa-2xs px-2" />
                                    </span>
                                    <span>0 người theo dõi</span>
                                </div>
                            </div>
                        </div>
                        {isOwnProfile && (
                            <div>
                                <button
                                    onClick={() => setIsEditOpen(true)}
                                    className="border border-[#00A8B5] bg-[#0A3D62] px-4 py-1.5 rounded text-sm hover:bg-[#006D77] transition whitespace-nowrap shadow-md"
                                >
                                    <FontAwesomeIcon icon={faPen} className="pr-2 text-[#00A8B5]" /> Chỉnh sửa trang cá nhân
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="w-full pt-6 pb-10 flex-grow">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1 space-y-6">
                            <div className="bg-[#0A3D62] rounded p-4 border border-[#006D77] shadow-sm">
                                <h2 className="text-sm font-semibold mb-3 pb-2 border-b border-[#006D77]">Tiểu sử</h2>
                                <p className="text-sm text-gray-300 mb-3">
                                    {isOwnProfile
                                        ? (profileUser?.bio?.trim()
                                            ? profileUser.bio
                                            : "Bạn chưa có tiểu sử, hãy chỉnh sửa trang cá nhân để thêm tiểu sử nhé!")
                                        : (profileUser?.bio?.trim()
                                            ? profileUser.bio
                                            : `${profileUser.displayName || "Anh hùng ẩn danh"} chưa có tiểu sử`)
                                    }
                                </p>
                            </div>

                            {/* Huy hiệu */}
                            <div className="bg-[#0A3D62] rounded p-4 border border-[#006D77] shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className="text-sm font-semibold text-white">Huy Hiệu</h2>
                                    <span className="text-sm text-white">{earnedBadges}</span>
                                </div>
                                {earnedBadges > 0 ? (
                                    <div className="grid grid-cols-3 gap-3">
                                        {Array.from({ length: earnedBadges }).map((_, index) => (
                                            <div key={index} className="flex flex-col items-center">
                                                <div
                                                    className={`w-10 h-10 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_#000000] flex items-center justify-center transition-transform hover:scale-110 bg-[#FFD700]`}
                                                >
                                                    <span className="text-xl">{badgeIcons[index % badgeIcons.length]}</span>
                                                </div>
                                                <span className="text-xs text-gray-300 mt-2 text-center">
                                                    {`Huy hiệu #${index + 1}`}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400">
                                        {isOwnProfile
                                            ? "Bạn chưa có huy hiệu nào"
                                            : `${profileUser.displayName || "Anh hùng ẩn danh"} chưa có huy hiệu nào`}
                                    </p>
                                )}
                            </div>

                            <div className="bg-[#0A3D62] rounded p-4 border border-[#006D77] shadow-sm">
                                <h2 className="text-sm font-semibold mb-3 pb-2 border-b border-[#006D77]">🏆 Bảng xếp hạng</h2>
                                <div className="flex items-center mt-4">
                                    <img className="w-8 h-8 bg-gray-500 rounded-full mx-3"
                                        src={profileUser?.avatarUrl || "/assets/mascots/original.png"}
                                    />
                                    <div className="flex flex-col text-sm text-white">
                                        <span className="font-semibold">{profileUser.displayName || "Anh hùng ẩn danh"}</span>
                                    </div>
                                    <div className="ml-auto font-semibold text-[#00A8B5] text-sm">
                                        {profileUser.ratingPoints} XP
                                    </div>
                                </div>
                                <Link
                                    href="/leaderboard"
                                    className="block text-center text-md text-[#00A8B5] mt-4 hover:underline transition"
                                >
                                    Xem bảng xếp hạng
                                </Link>
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-6">
                            {/* Game đã chia sẻ: ai cũng xem được */}
                            <div className="bg-[#0A3D62] rounded p-4 border border-[#006D77] shadow-sm">
                                <h2 className="text-sm font-semibold mb-3 pb-2 border-b border-[#006D77]">Game đã chia sẻ</h2>
                                {sharedGames.length === 0 ? (
                                    <div className="text-gray-400 text-center py-6 bg-[#0A3D62] rounded-lg border border-[#006D77]">
                                        {isOwnProfile
                                            ? "Bạn chưa chia sẻ game nào."
                                            : `${profileUser.displayName || "Anh hùng ẩn danh"} chưa chia sẻ game nào.`}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {sharedGames.map((game) => (
                                            <div
                                                key={game.slug}
                                                className="bg-[#0A3D62] rounded-lg border border-[#006D77] shadow-md p-5 flex flex-col justify-between hover:scale-[1.03] transition-transform"
                                            >
                                                <div>
                                                    <h3 className="text-lg font-bold text-white mb-2 truncate">{game.title}</h3>
                                                    <p className="text-sm text-gray-400 mb-2 truncate">{game.description}</p>
                                                    <p className="text-xs text-gray-500 mb-2">Cập nhật: {new Date(game.updatedAt).toLocaleDateString("vi-VN")}</p>
                                                </div>
                                                <div className="flex gap-2 mt-4">
                                                    <button
                                                        className="bg-[#00A8B5] hover:bg-[#0096A5] text-white font-bold py-2 px-4 rounded transition"
                                                        onClick={() => router.push(`/play/shared-game/${game.slug}`)}
                                                    >
                                                        Chơi ngay
                                                    </button>
                                                    <button
                                                        className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded transition"
                                                        onClick={() =>
                                                            navigator.clipboard.writeText(`${window.location.origin}/play/shared-game/${game.slug}`)
                                                        }
                                                    >
                                                        Sao chép link
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Phần thành tích */}
                            <div className="bg-[#0A3D62] rounded p-4 border border-[#006D77] shadow-sm">
                                <h2 className="text-sm font-semibold mb-3 pb-2 border-b border-[#006D77]">Thành tích, thành tựu</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                                    <div>
                                        <div className="text-2xl font-bold text-[#00A8B5]">
                                            {isOwnProfile ? progressSummary.completedQuests : profileUser.completedQuests ?? 0}
                                        </div>
                                        <div className="text-xs text-gray-400 uppercase mt-1">Nhiệm vụ đã học</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-[#00A8B5]">
                                            {isOwnProfile ? progressSummary.completedChallenges : profileUser.completedChallenges ?? 0}
                                        </div>
                                        <div className="text-xs text-gray-400 uppercase mt-1">Thử thách đã học</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-[#f0c419]">{profileUser.ratingPoints}</div>
                                        <div className="text-xs text-gray-400 uppercase mt-1">Điểm kinh nghiệm</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-[#00A8B5]">
                                            {earnedBadges}
                                        </div>
                                        <div className="text-xs text-gray-400 uppercase mt-1">Số huy hiệu</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {isOwnProfile && (
                    <EditProfilePopup isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />
                )}
            </div>
        </div>
    );
}