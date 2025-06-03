// components/sidebar.tsx
'use client';

import { Home, BarChart2, Star, Trophy, HashIcon } from 'lucide-react';
import Link from 'next/link';

const SidebarLeaderboard = () => {
  return (
    <div className="h-screen w-60 bg-[#0f172a] text-white flex flex-col gap-2 px-4 py-6 border-r border-gray-700">
      <SidebarItem icon={<Star size={18} />} label="Showcase dự án" href="/" />
      <SidebarItem icon={<Trophy size={18} />} label="Thử thách hàng tháng" href="/" />
      <SidebarItem icon={<HashIcon size={18} />} label="CodeRace25" href="/" />
    </div>
  );
};

const SidebarItem = ({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) => (
  <Link
    href={href}
    className="flex items-center gap-3 px-2 py-2 text-sm hover:bg-[#1e293b] rounded-md transition"
  >
    {icon}
    {label}
  </Link>
);

export default SidebarLeaderboard;