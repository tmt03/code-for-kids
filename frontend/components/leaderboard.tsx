'use client';

import { fetchLeaderboard } from '@/apis';
import { faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Crown, Medal, Shield } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const USERS_PER_PAGE = 50;

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState<'weekly' | 'alltime'>('alltime');
  const [currentPage, setCurrentPage] = useState(1);
  const [allTimeUsers, setAllTimeUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await fetchLeaderboard();
        setAllTimeUsers(users || []);
      } catch {
        setAllTimeUsers([]);
      }
    };
    fetchData();
  }, []);

  const totalPages = Math.ceil(allTimeUsers.length / USERS_PER_PAGE);
  const displayedUsers =
    activeTab === 'weekly'
      ? [] // Dữ liệu tuần sẽ được xử lý sau
      : allTimeUsers.slice((currentPage - 1) * USERS_PER_PAGE, currentPage * USERS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
    if (rank === 3) return <Shield className="w-5 h-5 text-orange-500" />;
    return <span className="text-slate-400 font-semibold">{rank}</span>;
  };

  return (
    <div className="bg-slate-800/50 rounded-xl p-4 sm:p-6 shadow-2xl border border-slate-700">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500">
          Bảng Xếp Hạng
        </h1>
        <p className="text-slate-400 mt-2 text-sm sm:text-base">
          Leo rank thần tốc, nhận thưởng cực sốc!
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-6 bg-slate-900/70 p-1 rounded-lg max-w-sm mx-auto">
        <button
          className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-all duration-300 ${activeTab === 'weekly' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-700/50'}`}
          onClick={() => {
            setActiveTab('weekly');
            setCurrentPage(1);
          }}
        >
          Hàng Tuần
        </button>
        <button
          className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-all duration-300 ${activeTab === 'alltime' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-700/50'}`}
          onClick={() => {
            setActiveTab('alltime');
            setCurrentPage(1);
          }}
        >
          Toàn Thời Gian
        </button>
      </div>

      {/* User List */}
      <div className="space-y-2">
        {displayedUsers.map((user, idx) => {
          const rank = (currentPage - 1) * USERS_PER_PAGE + idx + 1;
          return (
            <div
              key={user.username || idx}
              className="flex items-center p-3 bg-slate-900/60 rounded-lg hover:bg-slate-800/80 transition-all duration-200 border border-transparent hover:border-sky-500 shadow-sm"
            >
              <div className="flex items-center justify-center w-10 h-10 text-lg mr-4">
                {getRankIcon(rank)}
              </div>
              <Image
                src={user.avatarUrl || '/assets/mascots/original.png'}
                alt={user.displayName || user.username}
                width={40}
                height={40}
                className="rounded-full border-2 border-slate-600"
              />
              <div className="flex-1 ml-4">
                <div className="font-semibold text-slate-100">{user.displayName || user.username}</div>
                <div className="text-xs text-slate-500">@{user.username}</div>
              </div>
              <div className="font-bold text-sky-300 text-base sm:text-lg px-3 py-1 bg-sky-900/70 rounded-md border border-sky-800">
                {user.ratingPoints ?? 0}
                <span className="text-sky-500 text-sm ml-1">điểm</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Pagination */}
      {activeTab === 'alltime' && totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-2 text-sm">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={currentPage === 1}
          >
            <FontAwesomeIcon icon={faAngleDoubleLeft} />
          </button>
          <span className="px-4 py-2 bg-slate-900/50 rounded-lg border border-slate-700">
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={currentPage === totalPages}
          >
            <FontAwesomeIcon icon={faAngleDoubleRight} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;