'use client';

import Leaderboard from '@/components/leaderboard';
import SidebarLeaderboard from '@/components/sidebar-leaderboard';

export default function LeaderboardPage() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col pt-14">

      <div className="flex flex-1 w-full max-w-screen-2xl mx-auto pt-6 p-4 gap-8">
        <SidebarLeaderboard />

        <main className="flex-1">
          <Leaderboard />
        </main>
      </div>

    </div>
  );
}
