"use client";

import React, { useEffect } from "react";

type Quest = {
  id: string;
  name: string;
  description: string;
  point: number;
  baseCode?: string;
  solution?: string;
  type: string;
  imageUrl?: string;
  videoUrl?: string;
};

type Chapter = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  isSpecial: boolean;
  quests: Quest[];
};

type Props = {
  chapter: Chapter | null;
  onClose: () => void;
};

export default function ChapterTaskPopup({
  chapter,
  onClose,
}: Props) {
  useEffect(() => {
    // Disable body scroll when popup is open
    if (chapter) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [chapter]);

  if (!chapter) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-title"
    >
      <div
        className="bg-[#E6F0FA] border-2 border-black rounded-lg shadow-[6px_6px_0px_0px_#000000] p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto relative animate-popup-appear mx-4 sm:mx-8 custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-3xl font-bold text-gray-500 hover:text-black transition-colors p-1"
          aria-label="Đóng popup"
        >
          &times;
        </button>

        {/* Tiêu đề */}
        <h3
          id="popup-title"
          className="text-2xl font-bold text-[#104A7A] mb-6 text-center pr-6"
        >
          Nhiệm Vụ - {chapter.name}
        </h3>

        {/* Danh sách nhiệm vụ */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {chapter.quests.map((quests) => (
            <li key={quests.id} className="flex flex-col items-center">
              <div
                className={`w-52 h-64 rounded-xl border-2 px-4 py-4 shadow-md flex flex-col items-center justify-center text-center ${quests.type === "challenge"
                  ? "border-[#FF1493] bg-[#FFF0F5] text-[#FF1493] font-semibold"
                  : "border-black bg-white"
                  }`}
              >
                {quests.type === "challenge" && <span className="mb-1">CHALLENGE</span>}
                <span>{quests.name}</span>
              </div>
              <button
                className={`mt-4 bg-black text-white text-base px-4 py-2 rounded-full w-40 ${quests.type === "challenge"
                  ? "bg-pink-600 hover:bg-pink-700"
                  : "hover:bg-gray-800"
                  }`}
              >
                ▶ Play
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Scrollbar + animation */}
      <style jsx global>{`
        @keyframes popup-appear {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-popup-appear {
          animation: popup-appear 0.2s ease-out forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #bbb;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #888;
        }
      `}</style>
    </div>
  );
}