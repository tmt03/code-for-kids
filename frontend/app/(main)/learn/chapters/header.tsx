"use client";

import { MenuIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

export default function HeaderChapter() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="fixed w-full z-50 flex flex-row text-white bg-gradient-to-l from-[#2F5A8A] to-[#104A7A] backdrop-blur-md shadow-md items-center justify-between px-6 py-3">
            {/* Logo công ty */}
            <div className="flex items-center gap-4">
                <img src="/assets/logo-non-bg.png" alt="Scriptbies Logo" className="h-10 w-auto" />
                <a className="text-2xl font-bold tracking-wide hover:text-gray-200 transition-colors" href="/">
                    Scriptbies
                </a>
            </div>

            {/* Thông tin chapter */}
            <div className="text-sm font-semibold">
                <p>Book 1 / Chapter 1</p>
            </div>

            {/* Các nút navbar */}
            <nav className="hidden lg:flex items-center gap-6">
                <ul className="flex gap-6">
                    <li className="text-md font-semibold px-4 py-2 rounded-lg hover:bg-[#B0E2FF] hover:text-gray-800 transition-all duration-300">
                        <a href="/learn/courses">Khóa học</a>
                    </li>
                    <li className="text-md font-semibold px-4 py-2 rounded-lg hover:bg-[#B0E2FF] hover:text-gray-800 transition-all duration-300">
                        <a href="/">Cộng đồng</a>
                    </li>
                    <li className="text-md font-semibold px-4 py-2 rounded-lg hover:bg-[#B0E2FF] hover:text-gray-800 transition-all duration-300">
                        <a href="/shop">Cửa hàng</a>
                    </li>
                </ul>
            </nav>

            {/* Avatar người dùng (desktop) */}
            <div className="hidden lg:flex items-center gap-4">
                <img
                    src="/assets/knight-avatar.png"
                    alt="User Avatar"
                    className="h-10 w-10 rounded-full border-2 border-white object-cover hover:opacity-80 transition-opacity duration-300"
                />
            </div>

            {/* Menu hamburger cho màn hình nhỏ */}
            <div className="lg:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="focus:outline-none">
                    {isMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                </button>
            </div>

            {/* Menu dropdown cho màn hình nhỏ */}
            {isMenuOpen && (
                <div className="absolute top-16 left-0 w-full bg-[#87CEFA] shadow-md lg:hidden flex flex-col items-center gap-4 py-4">
                    <a
                        href="/learn/courses"
                        className="text-md font-semibold px-4 py-2 rounded-lg hover:bg-[#B0E2FF] hover:text-gray-800 transition-all duration-300"
                    >
                        Khóa học
                    </a>
                    <a
                        href="/"
                        className="text-md font-semibold px-4 py-2 rounded-lg hover:bg-[#B0E2FF] hover:text-gray-800 transition-all duration-300"
                    >
                        Cộng đồng
                    </a>
                    <a
                        href="/shop"
                        className="text-md font-semibold px-4 py-2 rounded-lg hover:bg-[#B0E2FF] hover:text-gray-800 transition-all duration-300"
                    >
                        Cửa hàng
                    </a>
                    <img
                        src="/assets/knight-avatar.png"
                        alt="User Avatar"
                        className="h-14 w-14 rounded-full border-2 border-white object-cover hover:opacity-80 transition-opacity duration-300"
                    />
                </div>
            )}
        </header>
    );
}