'use client';

import React from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

export default function ProfilePage() {
    const [activeTab, setActiveTab] = React.useState('Posts');

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
                        <FontAwesomeIcon icon={faPen}/> Change banner
                    </button>
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
                                <h1 className="text-xl font-bold mb-1 text-shadow">Lê Minh Quân</h1>
                                <div className="text-sm text-gray-300 mb-1 text-shadow-sm">@leminhquan760</div>
                                <div className="text-xs text-gray-400 text-shadow-sm">
                                    <span>0 following</span>
                                    <span className="ml-3">0 followers</span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Edit profile */}
                        <div>
                            <button className="border border-[#4f4f6a] bg-[#1c1c2e] px-4 py-1.5 rounded text-sm hover:bg-[#2a2a4a] transition whitespace-nowrap shadow-md">
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="w-full pt-6 pb-10 flex-grow">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        <div className="md:col-span-1 space-y-6">
                            <div className="bg-[#1c1c2e] rounded p-4 border border-[#3a3a5a] shadow-sm">
                                <h2 className="text-sm font-semibold mb-3 pb-2 border-b border-[#3a3a5a]">Bio</h2>
                                <div className="text-orange-400 font-bold mb-1">Lvl 1</div>
                                <p className="text-sm text-gray-400 mb-3">
                                    You don’t have anything in your bio yet. Click edit profile to add something cool about yourself.
                                </p>
                                <p className="text-xs text-gray-500">🕒 Joined Apr 19, 2025</p>
                            </div>

                            <div className="bg-[#1c1c2e] rounded p-4 border border-[#3a3a5a] shadow-sm">
                                <h2 className="text-sm font-semibold mb-3 pb-2 border-b border-[#3a3a5a]">Badges</h2>
                                <p className="text-sm text-gray-400">Add badges from <a href="#" className="text-blue-400 hover:underline">settings</a>.</p>
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-6">
                            <div className="bg-[#1c1c2e] rounded p-4 border border-[#3a3a5a] shadow-sm">
                                <h2 className="text-sm font-semibold mb-3 pb-2 border-b border-[#3a3a5a]">Pinned</h2>
                                <div className="border-2 border-dashed border-gray-600 rounded p-6 flex items-center justify-center min-h-[80px]">
                                    <div className="text-center text-gray-500 text-sm">Pin a project</div>
                                </div>
                            </div>

                            <div className="bg-[#1c1c2e] rounded p-4 border border-[#3a3a5a] shadow-sm">
                                <h2 className="text-sm font-semibold mb-3 pb-2 border-b border-[#3a3a5a]">Stats</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                                    <div>
                                        <div className="text-2xl font-bold text-blue-300">3</div>
                                        <div className="text-xs text-gray-400 uppercase mt-1">Exercises</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-[#f0c419]">35</div>
                                        <div className="text-xs text-gray-400 uppercase mt-1">Total XP</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-green-400">0</div>
                                        <div className="text-xs text-gray-400 uppercase mt-1">Course Badges</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-[#f0c419]">1</div>
                                        <div className="text-xs text-gray-400 uppercase mt-1">Daily Streak</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#1c1c2e] rounded p-4 border border-[#3a3a5a] shadow-sm">
                                <div className="flex space-x-1 mb-4 border-b border-[#3a3a5a]">
                                    {['Posts', 'Projects', 'Certificates'].map(tab => (
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
                                    {activeTab === 'Posts' && (<>You have not made a post yet. <a href="#" className="text-blue-400 hover:underline">Say hi in the community</a></>)}
                                    {activeTab === 'Projects' && (<>You have not added any projects yet.</>)}
                                    {activeTab === 'Certificates' && (<>You have not earned any certificates yet.</>)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
