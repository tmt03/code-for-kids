"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function ShopHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="w-full bg-[#28284f] text-white px-6 h-14 flex items-center justify-between shadow-md">
      {/* Logo và tên */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3">
          <img src="/assets/logo_scriptbies.png" alt="Scriptbies Logo" className="h-9 w-auto cursor-pointer" />
          <span className="text-xl font-bold font-mono">Scriptbies</span>
        </Link>
      </div>
      {/* Nav links */}
      <ul className="hidden md:flex gap-6">
        <li className="text-md font-semibold px-3 py-2 rounded hover:bg-gray-600 hover:text-blue-300">
          <Link href="/learn/courses">Khóa học</Link>
        </li>
        <li className="text-md font-semibold px-3 py-2 rounded hover:bg-gray-600 hover:text-blue-300">
          <Link href="/communicate">Cộng đồng</Link>
        </li>
        <li className="text-md font-semibold px-3 py-2 rounded hover:bg-gray-600 hover:text-blue-300">
          <Link href="/shop">Cửa hàng</Link>
        </li>
      </ul>
      {/* Avatar profile */}
      <div className="relative">
        <button
          className="w-10 h-10 rounded-full border-2 border-white overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={() => setOpen((o) => !o)}
        >
          <img src="/assets/knight-avatar.png" alt="Profile" className="w-full h-full object-cover" />
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg text-gray-800 z-20">
            <Link href="/shop/profile" className="block px-4 py-2 hover:bg-gray-100 font-semibold">My Profile</Link>
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 font-semibold">Đăng xuất</button>
          </div>
        )}
      </div>
    </header>
  );
} 