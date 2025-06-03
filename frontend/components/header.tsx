'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import {
    faArrowLeft, faBars, faGear,
    faHouse,
    faSignOut, faUser
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
config.autoAddCss = false;

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isMobileProfileDropdownOpen, setIsMobileProfileDropdownOpen] = useState(false);
    const { user, logout } = useAuth();
    const router = useRouter();

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
        setIsMobileProfileDropdownOpen(false);
    };

    const toggleProfileDropdown = () => {
        setIsProfileDropdownOpen(prev => !prev);
    };

    const toggleMobileProfileDropdown = () => {
        setIsMobileProfileDropdownOpen(prev => !prev);
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
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div>
            <header className="fixed top-0 left-0 w-full z-10 text-white bg-[#28284f] backdrop-blur-md">
                <nav className="flex items-center justify-between px-6 h-14">
                    {/* Logo */}
                    <div className="flex items-center gap-4">
                        <img src="/assets/logo_scriptbies.png" alt="Scriptbies Logo" className="h-10 w-auto" />
                        <Link href="/" className={`text-2xl`}>Scriptbies</Link>
                    </div>

                    {/* Nav links */}
                    <ul className="hidden lg:flex gap-6">
                        {user && (
                            <Link href="/home" className="text-md font-semibold px-3 py-2 rounded hover:bg-gray-600 hover:text-blue-300">
                                <FontAwesomeIcon icon={faHouse} className='pr-1' /> Trang chủ
                            </Link>
                        )}
                        <Link href="/learn/courses" className="text-md font-semibold px-3 py-2 rounded hover:bg-gray-600 hover:text-blue-300">
                            Khóa học
                        </Link>
                        <Link href="/" className="text-md font-semibold px-3 py-2 rounded hover:bg-gray-600 hover:text-blue-300">
                            Cộng đồng
                        </Link>
                        <Link href="/shop" className="text-md font-semibold px-3 py-2 rounded hover:bg-gray-600 hover:text-blue-300">
                            Cửa hàng
                        </Link>
                    </ul>

                    {/* Right-side buttons */}
                    <div className="flex items-center gap-4">
                        {!user && (
                            <Link href="/login" className="hidden lg:block bg-blue-500 font-bold px-3 py-2 rounded hover:bg-blue-400 transition-colors">
                                Đăng nhập
                            </Link>
                        )}

                        {user && (
                            <div className="relative hidden lg:block">
                                <button
                                    onClick={toggleProfileDropdown}
                                    className="w-9 h-9 rounded-full overflow-hidden border-2 border-white hover:border-blue-400 transition-all"
                                >
                                    <img
                                        src="/assets/globe.svg"
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </button>

                                {isProfileDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg text-sm font-semibold text-gray-800 z-20">
                                        <Link href="/profile" className="flex items-center gap-2 block px-4 py-2 hover:bg-gray-100">
                                            <FontAwesomeIcon icon={faUser} /> Hồ sơ
                                        </Link>
                                        <Link href="/settings" className="flex items-center gap-2 block px-4 py-2 hover:bg-gray-100">
                                            <FontAwesomeIcon icon={faGear} /> Cài đặt
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-2 block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            <FontAwesomeIcon icon={faSignOut} /> Đăng xuất
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Mobile menu toggle */}
                        <button className="lg:hidden" onClick={toggleMenu}>
                            <FontAwesomeIcon icon={faBars} className="fa-lg" />
                        </button>
                    </div>
                </nav>
            </header>

            {/* Mobile dropdown */}
            {isMenuOpen && (
                <div className="fixed top-14 left-0 w-full z-10 bg-[#28284f]/90 text-white flex flex-col items-start">
                    <ul className="flex flex-col items-start w-full">
                        {user && (
                            <Link href="/home" className="w-full text-left px-3 py-2 font-semibold hover:bg-gray-600 hover:text-blue-300 transition-colors">
                                <FontAwesomeIcon icon={faHouse} className='pr-1' /> Trang chủ
                            </Link>
                        )}
                        <Link href="/learn/courses" className="w-full text-left px-3 py-2 font-semibold hover:bg-gray-600 hover:text-blue-300 transition-colors">
                            Khóa học
                        </Link>
                        <Link href="/" className="w-full text-left px-3 py-2 font-semibold hover:bg-gray-600 hover:text-blue-300 transition-colors">
                            Cộng đồng
                        </Link>
                        <Link href="/shop" className="w-full text-left px-3 py-2 font-semibold hover:bg-gray-600 hover:text-blue-300 transition-colors">
                            Cửa hàng
                        </Link>
                        {!user ? (
                            <Link href="/login" className="w-full text-left px-3 py-2 font-semibold hover:bg-gray-600 hover:text-blue-300 transition-colors">
                                Đăng nhập
                            </Link>
                        ) : (
                            <button
                                onClick={toggleMobileProfileDropdown}
                                className="w-full flex items-center justify-start gap-2 px-3 py-2 font-semibold hover:bg-gray-600 hover:text-blue-300 transition-colors"
                            >
                                <img src="/assets/globe.svg" alt="User Avatar" className="h-6 w-6 rounded-full" />
                                <span>Tài khoản</span>
                            </button>
                        )}
                    </ul>
                </div>
            )}

            {/* Mobile profile dropdown */}
            {isMobileProfileDropdownOpen && (
                <div className="fixed top-14 left-0 w-full z-20 bg-[#28284f]/90 text-white flex flex-col items-start">
                    <button
                        className="w-full text-left px-2 py-2 font-semibold text-blue-400 hover:text-blue-200"
                        onClick={() => {
                            setIsMobileProfileDropdownOpen(false);
                            setIsMenuOpen(true);
                        }}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} /> Quay lại
                    </button>

                    <Link href="/profile" className="w-full flex items-center justify-start gap-3 font-bold px-2 py-2 hover:bg-gray-600 hover:text-blue-300 transition-colors">
                        <FontAwesomeIcon icon={faUser} /> Hồ sơ
                    </Link>
                    <Link href="/settings" className="w-full flex items-center justify-start gap-3 font-bold px-2 py-2 hover:bg-gray-600 hover:text-blue-300 transition-colors">
                        <FontAwesomeIcon icon={faGear} /> Cài đặt
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-start gap-3 font-bold px-2 py-2 hover:bg-gray-600 hover:text-blue-300 transition-colors cursor-pointer"
                    >
                        <FontAwesomeIcon icon={faSignOut} /> Đăng xuất
                    </button>
                </div>
            )}
        </div>
    );
}
