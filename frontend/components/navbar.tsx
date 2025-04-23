'use client';
import React, { useEffect, useState } from 'react';
import localFont from 'next/font/local';
import { usePathname } from 'next/navigation';

import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBars, faGear, faGears, faSignOut, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';

const pixelFont = localFont({
    src: '../app/fonts/SVNDeterminationSans.otf',
});

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isMobileProfileDropdownOpen, setIsMobileProfileDropdownOpen] = useState(false);

    const pathname = usePathname();
    const isLoggedIn = pathname === '/home';

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
        setIsMobileProfileDropdownOpen(false); // Close mobile profile dropdown when toggling menu
    };

    const toggleProfileDropdown = () => {
        setIsProfileDropdownOpen(prev => !prev);
    };

    const toggleMobileProfileDropdown = () => {
        setIsMobileProfileDropdownOpen(prev => !prev);
        setIsMenuOpen(false); // Hide main dropdown
    };

    // Auto-close dropdown on window resize
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
                        <a className={`${pixelFont.className} text-2xl`} href="/">Scriptbies</a>
                    </div>

                    {/* Nav links */}
                    <ul className="hidden lg:flex gap-6">
                        <li className="text-md font-semibold px-3 py-2 rounded hover:bg-gray-600 hover:text-blue-300">
                            <a href="/learn/courses">Khóa học</a>
                        </li>
                        <li className="text-md font-semibold px-3 py-2 rounded hover:bg-gray-600 hover:text-blue-300">
                            <a href="/">Cộng đồng</a>
                        </li>
                        <li className="text-md font-semibold px-3 py-2 rounded hover:bg-gray-600 hover:text-blue-300">
                            <a href="/shop">Cửa hàng</a>
                        </li>
                    </ul>

                    {/* Right-side buttons */}
                    <div className="flex items-center gap-4">
                        {!isLoggedIn && (
                            <button className="hidden lg:block bg-blue-500 font-bold px-3 py-2 rounded hover:bg-blue-400 transition-colors">
                                Đăng nhập
                            </button>
                        )}

                        {isLoggedIn && (
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
                                        <a href="/" className="flex items-center gap-2 block px-4 py-2 hover:bg-gray-100">
                                            <FontAwesomeIcon icon={faUser} /> Hồ sơ
                                        </a>
                                        <a href="/" className="flex items-center gap-2 block px-4 py-2 hover:bg-gray-100">
                                            <FontAwesomeIcon icon={faGear}/> Cài đặt
                                        </a>
                                        <button className="flex items-center gap-2 block w-full text-left px-4 py-2 hover:bg-gray-100">
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

            {/* Main dropdown for mobile */}
            {isMenuOpen && (
                // Thay items-center thành items-start trên div nếu muốn cả khối menu căn trái tuyệt đối
                <div className="fixed top-14 left-0 w-full z-10 bg-[#28284f]/90 text-white flex flex-col items-start">
                    {/* Thay items-center thành items-start trên ul */}
                    <ul className="flex flex-col items-start w-full"> {/* Thay đổi ở đây */}
                        {/* Thay text-center thành text-left và xóa justify-start khỏi <a> */}
                        <li className="w-full text-left px-3 py-2 font-semibold hover:bg-gray-600 hover:text-blue-300 transition-colors"> {/* Thay đổi ở đây */}
                            <a href="/learn/courses">Khóa học</a> {/* Xóa justify-start */}
                        </li>
                        <li className="w-full text-left px-3 py-2 font-semibold hover:bg-gray-600 hover:text-blue-300 transition-colors"> {/* Thay đổi ở đây */}
                            <a href="/">Cộng đồng</a> {/* Xóa justify-start */}
                        </li>
                        <li className="w-full text-left px-3 py-2 font-semibold hover:bg-gray-600 hover:text-blue-300 transition-colors"> {/* Thay đổi ở đây */}
                            <a href="/shop">Cửa hàng</a> {/* Xóa justify-start */}
                        </li>
                        {!isLoggedIn ? (
                            <button className="w-full text-left px-3 py-2 font-semibold hover:bg-gray-600 hover:text-blue-300 transition-colors">
                                Đăng nhập/Đăng ký
                            </button>
                        ) : (
                            // Nút này đã dùng flex và justify-start đúng cách rồi
                            <button
                                onClick={toggleMobileProfileDropdown}
                                className="w-full flex items-center justify-start gap-2 px-3 py-2 font-semibold hover:bg-gray-600 hover:text-blue-300 transition-colors"
                            >
                                <img
                                    src="/assets/globe.svg" // Bạn có thể muốn dùng default_profile.png như ở trên
                                    alt="User Avatar"
                                    className="h-6 w-6 rounded-full"
                                />
                                <span>Tài khoản</span>
                            </button>
                        )}
                    </ul>
                </div>
            )}

            {/* Mobile profile dropdown (replaces menu) */}
            {isMobileProfileDropdownOpen && (
                <div className="fixed top-14 left-0 w-full z-20 bg-[#28284f]/90 text-white flex flex-col items-start">
                    {/* Back Button */}
                    <button
                        className="w-full text-left px-2 py-2 font-semibold text-blue-400 hover:text-blue-200"
                        onClick={() => {
                            setIsMobileProfileDropdownOpen(false);
                            setIsMenuOpen(true);
                        }}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} /> Quay lại
                    </button>

                    {/* Profile Menu Items */}
                    <a href="/" className="w-full flex items-center justify-start gap-3 font-bold px-2 py-2 hover:bg-gray-600 hover:text-blue-300 transition-colors">
                        <FontAwesomeIcon icon={faUser} /> Hồ sơ
                    </a>
                    <a href="/" className="w-full flex items-center justify-start gap-3 font-bold px-2 py-2 hover:bg-gray-600 hover:text-blue-300 transition-colors">
                        <FontAwesomeIcon icon={faGear}/> Cài đặt
                    </a>
                    <button className="w-full flex items-center justify-start gap-3 font-bold px-2 py-2 hover:bg-gray-600 hover:text-blue-300 transition-colors">
                        <FontAwesomeIcon icon={faSignOut} /> Đăng xuất
                    </button>
                </div>
            )}
        </div>
    );
}