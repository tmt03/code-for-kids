// components/sidebar.tsx
'use client';

import { BarChart2, Star, Trophy } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SidebarLeaderboard = () => {
  return (
    <div className="hidden lg:flex w-60 bg-slate-900/60 backdrop-blur-md rounded-xl border border-slate-700 flex-col gap-2 p-4">
      <h2 className="px-2 text-lg font-semibold text-slate-300 mb-2">Bảng Vàng</h2>
      <SidebarItem icon={<BarChart2 size={18} className="text-sky-400" />} label="Bảng Xếp Hạng" href="/leaderboard" />
      <SidebarItem icon={<Star size={18} className="text-yellow-400" />} label="Showcase Dự Án" href="/showcase" />
      <SidebarItem icon={<Trophy size={18} className="text-amber-500" />} label="Thử Thách Tháng" href="/challenges" />
    </div>
  );
};

const SidebarItem = ({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
            ${isActive
          ? 'bg-sky-500/30 text-sky-200'
          : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
        }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default SidebarLeaderboard;