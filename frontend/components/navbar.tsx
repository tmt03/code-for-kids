import React from 'react';
import localFont from 'next/font/local';

import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from "react";

const pixelFont = localFont({
    src: '../app/fonts/SVNDeterminationSans.otf',
});

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(prev => !prev);

    //tự đóng dropdown nếu size màn hình to hơn
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024 && isMenuOpen) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMenuOpen]);

    return (
        <div>
            
            {/*navbar*/}
            <header className="fixed top-0 left-0 w-full z-10 text-white bg-[#28284f] backdrop-blur-md">
                <nav className="flex items-center justify-between px-6 h-14">
                    
                    {/*logo công ty*/}
                    <div className="flex items-center gap-4">
                        <img src="/assets/logo_scriptbies.png" alt="Scriptbies Logo" className="h-10 w-auto" />
                        <a className={`${pixelFont.className} text-2xl`} href="/">Scriptbies</a>
                    </div>

                    {/*các nút navbar*/}
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

                    {/*nút login*/}
                    <div className="flex items-center gap-4">
                        <button className="hidden lg:block bg-blue-500 font-bold px-3 py-2 rounded hover:bg-blue-400 transition-colors">
                            Đăng nhập
                        </button>

                        {/*nút menu dropdown cho màn hình size nhỏ*/}
                        <button className="lg:hidden" onClick={toggleMenu}>
                            <FontAwesomeIcon icon={faBars} className="fa-lg" />
                        </button>
                    </div>
                </nav>
            </header>

            {/*dropdown menu overlay*/}
            {isMenuOpen && (
                <div className="fixed top-14 left-0 w-full z-10 bg-[#28284f]/90 text-white flex flex-col items-center gap-3 py-2">
                    <ul className="flex flex-col items-center w-full">
                        <li className="w-full text-center px-3 py-2 font-semibold hover:bg-gray-600 hover:text-blue-300 transition-colors">
                            <a href="/learn/courses">Khóa học</a>
                        </li>
                        <li className="w-full text-center px-3 py-2 font-semibold hover:bg-gray-600 hover:text-blue-300 transition-colors">
                            Cộng đồng
                        </li>
                        <li className="w-full text-center px-3 py-2 font-semibold hover:bg-gray-600 hover:text-blue-300 transition-colors">
                            <a href="/shop">Cửa hàng</a>
                        </li>
                    </ul>
                    <button className="text-center px-3 py-2 rounded font-semibold bg-blue-500 rounded hover:bg-blue-400 transition-colors">
                        Đăng nhập/Đăng ký
                    </button>
                </div>
            )}
        </div>
    );
}