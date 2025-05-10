'use client';

import React from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import EditProfilePopup from '@/components/edit-profile-popup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCamera, faCircle, faClock, faPen } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export default function ProfilePage() {
    const [activeTab, setActiveTab] = React.useState('Bài đăng');
    const [isEditOpen, setIsEditOpen] = React.useState(false);

    return (
        <div className="w-full overflow-x-hidden bg-[#0a0a23] font-mono text-white min-h-screen flex flex-col">
            <Navbar />

            {/* Chỉ giới hạn chiều rộng bên trong */}
            <div className="w-full max-w-6xl px-6 mx-auto pt-18">

                {/* ✅ Banner CHỈ NẰM TRONG max-w-6xl container */}
                <div className="relative h-44 rounded-t-md overflow-hidden">
                    <img
                        src="assets/9285000.jpg"
                        alt="Banner"
                        className="w-full h-full object-cover"
                    />
                    <button className="absolute gap-2 top-3 right-3 bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-[5px] text-sm transition duration-150 ease-in-out flex items-center">
                        <FontAwesomeIcon icon={faCamera} /> Đổi ảnh nền
                    </button>
                    <Link href={'/home'} className="absolute gap-2 top-3 left-3 bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-[5px] text-sm transition duration-150 ease-in-out flex items-center">
                        <FontAwesomeIcon icon={faArrowLeft} /> Quay lại
                    </Link>
                </div>

                {/* Avatar + name */}
                <div className="relative px-6 pt-4">
                    <div className="flex justify-between items-start">
                        {/* Left: Avatar + info */}
                        <div className="flex items-center space-x-4">
                            <div className="w-20 h-20 rounded-full bg-gray-300 border-4 border-[#0a0a23] flex items-center justify-center overflow-hidden">
                                <span className="text-black text-sm">Avatar</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-shadow">Lê Minh Quân</h1>
                                <div className="text-md text-gray-300 text-shadow-sm">@leminhquan760</div>
                                <div className="text-sm text-gray-400 text-shadow-sm">
                                    <span>0 đang theo dõi</span>
                                    <span><FontAwesomeIcon icon={faCircle} className="text-white fa-2xs px-2" /></span>
                                    <span>0 người theo dõi</span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Edit profile */}
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
                                <div className="text-orange-400 font-bold mb-1">Lvl 1</div>
                                <p className="text-sm text-gray-400 mb-3">
                                    Bạn chưa có gì trong tiểu sử. Hãy chỉnh sửa trang cá nhân để giới thiệu những điều thú vị về bản thân nhé!
                                </p>
                                <p className="text-sm text-gray-500">
                                    <FontAwesomeIcon icon={faClock} className="pr-2" />
                                    <span>Tham gia vào ngày 19 tháng 4, 2025</span>
                                </p>
                            </div>

                            <div className="bg-[#1c1c2e] rounded p-4 border border-[#3a3a5a] shadow-sm">
                                <h2 className="text-sm font-semibold mb-3 pb-2 border-b border-[#3a3a5a]">Huy hiệu</h2>
                                <p className="text-sm text-gray-400">Thêm huy hiệu bằng cách chỉnh sửa trang cá nhân</p>
                            </div>

                            <div className="bg-[#1c1c2e] rounded p-4 border border-[#3a3a5a] shadow-sm">
                                <h2 className="text-sm font-semibold mb-3 pb-2 border-b border-[#3a3a5a]">🏆 Bảng xếp hạng</h2>

                                {/* Thông tin người dùng */}
                                <div className="flex items-center mt-4">
                                    <div className="w-6 text-white font-bold text-center">47</div>
                                    <div className="w-8 h-8 bg-gray-500 rounded-full mx-3"></div>
                                    <div className="flex flex-col text-sm text-white">
                                        <span className="font-semibold">leminhquan760</span>
                                        <span className="text-gray-400">@leminhquan760</span>
                                    </div>
                                    <div className="ml-auto font-semibold text-blue-400 text-sm">
                                        1200 XP
                                    </div>
                                </div>

                                {/* Link đến bảng xếp hạng */}
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
                                <h2 className="text-sm font-semibold mb-3 pb-2 border-b border-[#3a3a5a]">Đã ghim</h2>
                                <div className="border-2 border-dashed border-gray-600 rounded p-6 flex items-center justify-center min-h-[80px]">
                                    <div className="text-center text-gray-500 text-sm">Ghim một dự án đi!</div>
                                </div>
                            </div>

                            <div className="bg-[#1c1c2e] rounded p-4 border border-[#3a3a5a] shadow-sm">
                                <h2 className="text-sm font-semibold mb-3 pb-2 border-b border-[#3a3a5a]">Thành tích, thành tựu</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                                    <div>
                                        <div className="text-2xl font-bold text-blue-300">3</div>
                                        <div className="text-xs text-gray-400 uppercase mt-1">Bài đã học</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-[#f0c419]">35</div>
                                        <div className="text-xs text-gray-400 uppercase mt-1">Điểm kinh nghiệm</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-green-400">0</div>
                                        <div className="text-xs text-gray-400 uppercase mt-1">Huy hiệu</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-[#f0c419]">1</div>
                                        <div className="text-xs text-gray-400 uppercase mt-1">Chuỗi ngày học</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#1c1c2e] rounded p-4 border border-[#3a3a5a] shadow-sm">
                                <div className="flex space-x-1 mb-4 border-b border-[#3a3a5a]">
                                    {['Bài đăng', 'Dự án', 'Chứng chỉ'].map(tab => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`px-4 py-2 text-sm border-b-2 transition-colors duration-150 ${activeTab === tab ? 'border-[#f0c419] text-white' : 'border-transparent text-gray-400 hover:text-gray-200'}`}
                                        >
                                            {`${tab} (0)`}
                                        </button>
                                    ))}
                                </div>
                                <div className="text-center text-sm text-gray-400 py-4 min-h-[50px]">
                                    {activeTab === 'Bài đăng' && (<>Bạn chưa có bài đăng nào. <a href="#" className="text-blue-400 hover:underline">Hãy gửi lời chào tới cộng đồng nhé!</a></>)}
                                    {activeTab === 'Dự án' && (<>Bạn chưa có dự án nào.</>)}
                                    {activeTab === 'Chứng chỉ' && (<>Bạn chưa có chứng chỉ nào.</>)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <EditProfilePopup isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />
                             
            <Footer />
        </div>
    );
}
