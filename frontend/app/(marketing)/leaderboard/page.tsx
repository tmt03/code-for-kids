'use client';

import Footer from '@/components/footer';
import Header from '@/components/header';
import Leaderboard from '@/components/leaderboard';
import Sidebar from '@/components/sidebar-leaderboard';

export default function LeaderboardPage() {
  return (
    <div className="w-full min-h-screen bg-[#0a0a23] text-white flex flex-col pt-14">
      <Header />

      <div className="flex flex-1 w-full max-w-screen-2xl mx-auto pt-6 px-4 gap-6">
        <Sidebar />

        <main className="flex-1">
          <Leaderboard />
        </main>
      </div>

      <Footer />
    </div>
  );
}
