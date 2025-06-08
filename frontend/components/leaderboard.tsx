'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import { fetchLeaderboard } from '@/apis';

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
      ? [] // Nếu có weeklyUsers thì fetch tương tự, ở đây để rỗng
      : allTimeUsers.slice((currentPage - 1) * USERS_PER_PAGE, currentPage * USERS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pb-6">
      <h1 className="text-3xl text-black font-bold mb-2">🏆 Bảng xếp hạng</h1>
      <p className="text-2sm text-gray-600 mb-6">
        Hãy đánh bại các đối thủ khác để leo lên đỉnh vinh quang nhé!
      </p>

      <div className="flex border-b border-gray-600 mb-4">
        <button
          className={`px-4 py-2 text-2sm font-bold ${
            activeTab === 'weekly' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
          }`}
          onClick={() => {
            setActiveTab('weekly');
            setCurrentPage(1);
          }}
        >
          Hàng tuần
        </button>
        <button
          className={`px-4 py-2 text-2sm font-bold ${
            activeTab === 'alltime' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
          }`}
          onClick={() => {
            setActiveTab('alltime');
            setCurrentPage(1);
          }}
        >
          Toàn thời gian
        </button>
      </div>

      <div className="bg-[#0a0a23] divide-y divide-gray-700 rounded-md">
        {displayedUsers.map((user, idx) => (
          <div key={user.username || idx} className="flex items-center py-4 space-x-4">
            <div className={`w-6 text-xl text-right ${idx === 0 ? "text-yellow-400"
                                                    : idx === 1 ? "text-gray-300"
                                                    : idx === 2 ? "text-orange-500" : "text-white"}`}>
              {(currentPage - 1) * USERS_PER_PAGE + idx + 1}
            </div>
            <Image
              src={user.avatarUrl || '/assets/knight-avatar.png'}
              alt={user.displayName || user.username}
              width={36}
              height={36}
              className="rounded-full"
            />
            <div className="flex-1">
              <div className="font-semibold text-white">{user.displayName || user.username}</div>
              <div className="text-xs text-gray-400">@{user.username}</div>
            </div>
            <div className="font-semibold text-blue-300 text-lg px-4">
              {user.ratingPoints ?? 0} điểm
            </div>
          </div>
        ))}
      </div>

      {activeTab === 'alltime' && totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-sm"
            disabled={currentPage === 1}
          >
            <FontAwesomeIcon icon={faAngleDoubleLeft}/>
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded text-sm ${
                currentPage === i + 1 ? 'bg-blue-500' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-sm"
            disabled={currentPage === totalPages}
          >
            <FontAwesomeIcon icon={faAngleDoubleRight}/>
          </button>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;