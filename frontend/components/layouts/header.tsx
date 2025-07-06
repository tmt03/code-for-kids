"use client";

import { useAuth } from "@/hooks/useAuth";
import { usePermission } from "@/hooks/usePermission";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import {
    faArrowLeft,
    faBars,
    faChartBar,
    faGear,
    faHouse,
    faSignOut,
    faUser
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
config.autoAddCss = false;

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isMobileProfileDropdownOpen, setIsMobileProfileDropdownOpen] = useState(false);
    const { user, logout } = useAuth();
    const router = useRouter();
    const canViewDashboard = usePermission("viewDashboard");
    const pathname = usePathname();

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
        setIsMobileProfileDropdownOpen(false);
    };

    const toggleProfileDropdown = () => {
        setIsProfileDropdownOpen((prev) => !prev);
    };

    const toggleMobileProfileDropdown = () => {
        setIsMobileProfileDropdownOpen((prev) => !prev);
        setIsMenuOpen(false);
    };

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMenuOpen(false);
                setIsMobileProfileDropdownOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div>
            <header className="fixed top-0 left-0 w-full z-50 text-white bg-gradient-to-r from-[#006D77] to-[#0A3D62] backdrop-blur-md shadow-lg">
                <nav className="flex items-center justify-between px-6 h-16 max-w-7xl mx-auto">
                    {/* Logo */}
                    <div className="flex items-center gap-4">
                        <img
                            src="/assets/logo_scriptbies.png"
                            alt="Scriptbies Logo"
                            className="h-10 w-auto transition-transform duration-300 hover:scale-105"
                        />
                        <Link
                            href="/"
                            className={`text-2xl font-extrabold text-white hover:text-blue-200 transition-colors`}
                        >
                            Scriptbies
                        </Link>
                    </div>

                    {/* Nav links */}
                    <ul className="hidden lg:flex gap-6 items-center">
                        {user && (
                            <Link
                                href="/home"
                                className={`text-md font-semibold px-4 py-2 rounded-lg transition-all duration-200 flex items-center ${pathname === "/home" ? "bg-white/20 text-blue-300" : "hover:bg-[#008080]/20 hover:text-blue-300"}`}
                            >
                                <FontAwesomeIcon icon={faHouse} className="mr-2" /> Trang chủ
                            </Link>
                        )}
                        {canViewDashboard && (
                            <Link
                                href="/dashboard/order-management"
                                className={`text-md font-semibold px-4 py-2 rounded-lg transition-all duration-200 flex items-center ${pathname.startsWith("/dashboard") ? "bg-white/20 text-blue-300" : "hover:bg-[#008080]/20 hover:text-blue-300"}`}
                            >
                                <FontAwesomeIcon icon={faChartBar} className="mr-2" /> Trung tâm quản lý
                            </Link>
                        )}
                        <Link
                            href="/learn/courses"
                            className={`text-md font-semibold px-4 py-2 rounded-lg transition-all duration-200 ${pathname.startsWith("/learn/courses") ? "bg-white/20 text-blue-300" : "hover:bg-[#008080]/20 hover:text-blue-300"}`}
                        >
                            Khóa học
                        </Link>
                        <Link
                            href="/community"
                            className={`text-md font-semibold px-4 py-2 rounded-lg transition-all duration-200 ${pathname.startsWith("/community") ? "bg-white/20 text-blue-300" : "hover:bg-[#008080]/20 hover:text-blue-300"}`}
                        >
                            Cộng đồng
                        </Link>
                        <Link
                            href="/shop"
                            className={`text-md font-semibold px-4 py-2 rounded-lg transition-all duration-200 ${pathname.startsWith("/shop") ? "bg-white/20 text-blue-300" : "hover:bg-[#008080]/20 hover:text-blue-300"}`}
                        >
                            Cửa hàng
                        </Link>
                    </ul>

                    {/* Right-side buttons */}
                    <div className="flex items-center gap-4">
                        {!user && (
                            <Link
                                href="/login"
                                className={`hidden lg:block bg-[#00A8B5] font-bold px-4 py-2 rounded-lg transition-all duration-200 ${pathname === "/login" ? "bg-white/20 text-blue-300" : "hover:bg-[#0096A5]"}`}
                            >
                                Đăng nhập
                            </Link>
                        )}

                        {/* Avatar ở header (desktop) */}
                        {user && (
                            <div className="relative hidden lg:block">
                                <button
                                    onClick={toggleProfileDropdown}
                                    className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all duration-200 ${
                                        user.isActivated ? "border-yellow-400" : "border-blue-400"
                                    }`}
                                >
                                    <img
                                        src={user?.avatarUrl || "/assets/mascots/original.png"}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                                {isProfileDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg overflow-hidden shadow-xl text-sm font-semibold text-gray-800 z-50">
                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
                                        >
                                            <FontAwesomeIcon icon={faUser} /> Hồ sơ
                                        </Link>
                                        <Link
                                            href="/settings"
                                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
                                        >
                                            <FontAwesomeIcon icon={faGear} /> Đổi mật khẩu
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-3 w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
                                        >
                                            <FontAwesomeIcon icon={faSignOut} /> Đăng xuất
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Mobile menu toggle */}
                        <button className="lg:hidden text-white hover:text-blue-200" onClick={toggleMenu}>
                            <FontAwesomeIcon icon={faBars} className="text-xl" />
                        </button>
                    </div>
                </nav>
                {/* <TrialBanner /> */}
            </header>

            {/* Mobile dropdown */}
            {isMenuOpen && (
                <div className="fixed top-16 left-0 w-full z-50 bg-[#006D77]/90 text-white flex flex-col items-start shadow-lg">
                    <ul className="flex flex-col items-start w-full">
                        {user && (
                            <Link
                                href="/home"
                                className={`w-full text-left px-4 py-3 font-semibold transition-all duration-200 flex items-center ${pathname === "/home" ? "bg-white/20 text-blue-300" : "hover:bg-[#008080]/40"}`}
                            >
                                <FontAwesomeIcon icon={faHouse} className="mr-2" /> Trang chủ
                            </Link>
                        )}
                        {canViewDashboard && (
                            <Link
                                href="/dashboard/order-management"
                                className={`w-full text-left px-4 py-3 font-semibold transition-all duration-200 flex items-center ${pathname.startsWith("/dashboard") ? "bg-white/20 text-blue-300" : "hover:bg-[#008080]/40"}`}
                            >
                                <FontAwesomeIcon icon={faChartBar} className="mr-2" /> Trung tâm quản lý
                            </Link>
                        )}
                        <Link
                            href="/learn/courses"
                            className={`w-full text-left px-4 py-3 font-semibold transition-all duration-200 ${pathname.startsWith("/learn/courses") ? "bg-white/20 text-blue-300" : "hover:bg-[#008080]/40"}`}
                        >
                            Khóa học
                        </Link>
                        <Link
                            href="/community"
                            className={`w-full text-left px-4 py-3 font-semibold transition-all duration-200 ${pathname.startsWith("/community") ? "bg-white/20 text-blue-300" : "hover:bg-[#008080]/40"}`}
                        >
                            Cộng đồng
                        </Link>
                        <Link
                            href="/shop"
                            className={`w-full text-left px-4 py-3 font-semibold transition-all duration-200 ${pathname.startsWith("/shop") ? "bg-white/20 text-blue-300" : "hover:bg-[#008080]/40"}`}
                        >
                            Cửa hàng
                        </Link>
                        {!user ? (
                            <Link
                                href="/login"
                                className={`w-full text-left px-4 py-3 font-semibold transition-all duration-200 ${pathname === "/login" ? "bg-white/20 text-blue-300" : "hover:bg-[#008080]/40"}`}
                            >
                                Đăng nhập
                            </Link>
                        ) : (
                            <button
                                onClick={toggleMobileProfileDropdown}
                                className="w-full flex items-center justify-start gap-3 px-4 py-2 font-semibold hover:bg-[#008080]/40 transition-all duration-200"
                            >
                                {/* Avatar ở header (mobile menu) */}
                                <span
                                    className={`h-8 w-8 rounded-full overflow-hidden border-2 ${
                                        user.isActivated ? "border-yellow-400" : "border-blue-400"
                                    }`}
                                >
                                    <img
                                        src={user.avatarUrl || "/assets/mascots/original.png"}
                                        alt="User Avatar"
                                        className="h-full w-full object-cover"
                                    />
                                </span>
                                <span>Tài khoản</span>
                            </button>
                        )}
                    </ul>
                </div>
            )}

            {/* Mobile profile dropdown */}
            {isMobileProfileDropdownOpen && (
                <div className="fixed top-16 left-0 w-full z-50 bg-[#006D77]/90 text-white flex flex-col items-start shadow-lg">
                    <button
                        className="w-full text-left px-4 py-3 font-semibold text-blue-200 hover:text-blue-100 transition-colors duration-200"
                        onClick={() => {
                            setIsMobileProfileDropdownOpen(false);
                            setIsMenuOpen(true);
                        }}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} /> Quay lại
                    </button>

                    <Link
                        href="/profile"
                        className="w-full flex items-center justify-start gap-3 font-bold px-4 py-3 hover:bg-[#008080]/40 transition-all duration-200"
                    >
                        <FontAwesomeIcon icon={faUser} /> Hồ sơ
                    </Link>
                    <Link
                        href="/settings"
                        className="w-full flex items-center justify-start gap-3 font-bold px-4 py-3 hover:bg-[#008080]/40 transition-all duration-200"
                    >
                        <FontAwesomeIcon icon={faGear} /> Cài đặt
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-start gap-3 font-bold px-4 py-3 hover:bg-[#008080]/40 transition-all duration-200"
                    >
                        <FontAwesomeIcon icon={faSignOut} /> Đăng xuất
                    </button>
                </div>
            )}

        </div>
    );
}