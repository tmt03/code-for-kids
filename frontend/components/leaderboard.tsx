'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';

const allTimeUsers = Array.from({ length: 100 }, (_, i) => ({
  rank: i + 1,
  name: `User ${i + 1}`,
  username: `@user${i + 1}`,
  xp: `${6000 - i * 10} XP`,
  avatar: '/avatar1.png',
}));

const weeklyUsers = Array.from({ length: 10 }, (_, i) => ({
  rank: i + 1,
  name: `WeeklyUser ${i + 1}`,
  username: `@weekly${i + 1}`,
  xp: `${5000 - i * 20} XP`,
  avatar: '/avatar2.png',
}));

const USERS_PER_PAGE = 50;

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState<'weekly' | 'alltime'>('alltime');
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(allTimeUsers.length / USERS_PER_PAGE);
  const displayedUsers =
    activeTab === 'weekly'
      ? weeklyUsers
      : allTimeUsers.slice((currentPage - 1) * USERS_PER_PAGE, currentPage * USERS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="max-w-6xl mx-auto text-white px-4 pb-6">
      <h1 className="text-3xl font-bold mb-2">🏆 Bảng xếp hạng</h1>
      <p className="text-sm text-gray-400 mb-6">
        Hãy đánh bại các đối thủ khác để leo lên đỉnh vinh quang nhé!
      </p>

      <div className="flex border-b border-gray-600 mb-4">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'weekly' ? 'border-b-2 border-blue-400 text-blue-400' : 'text-gray-400'
          }`}
          onClick={() => {
            setActiveTab('weekly');
            setCurrentPage(1);
          }}
        >
          Hàng tuần
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'alltime' ? 'border-b-2 border-blue-400 text-blue-400' : 'text-gray-400'
          }`}
          onClick={() => {
            setActiveTab('alltime');
            setCurrentPage(1);
          }}
        >
          Toàn thời gian
        </button>
      </div>

      <div className="divide-y divide-gray-700">
        {displayedUsers.map((user) => (
          <div key={user.rank} className="flex items-center py-4 space-x-4">
            <div className="w-6 text-right">{user.rank}</div>
            <Image
              src={user.avatar}
              alt={user.name}
              width={36}
              height={36}
              className="rounded-full"
            />
            <div className="flex-1">
              <div className="font-semibold">{user.name}</div>
              <div className="text-xs text-gray-400">{user.username}</div>
            </div>
            <div className="font-semibold text-sm">{user.xp}</div>
          </div>
        ))}
      </div>

      {activeTab === 'alltime' && (
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