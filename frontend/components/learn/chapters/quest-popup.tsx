"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Button } from "../../ui/button";

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

export default function ChapterTaskPopup({ chapter, onClose }: Props) {
  const router = useRouter();

  useEffect(() => {
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

  const handleStartClick = (questId: string) => {
    router.push(`/learn/quests/${questId}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#104A7A]/50 p-4"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-title"
    >
      <div
        className="bg-[#E6F0FA] border-4 border-[#1C6CA8] rounded-2xl shadow-[8px_8px_0px_0px_#1C6CA8] p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto relative animate-popup-appear mx-4 sm:mx-8 custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tiêu đề */}
        <h3
          id="popup-title"
          className="text-3xl font-bold text-[#104A7A] mb-8 text-center pr-10 animate-bounce"
        >
          {chapter.name}
        </h3>

        {/* Danh sách nhiệm vụ */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {chapter.quests.map((quest) => (
            <li
              key={quest.id}
              className={`flex flex-col items-center transform transition-all duration-300 hover:scale-115 hover:shadow-lg 
                ${quest.type === "challenge"
                  ? "bg-gradient-to-r from-[#FF80ED] to-[#FFD700] border-4 border-[#104A7A] text-[#104A7A]"
                  : "bg-gradient-to-r from-[#FFFACD] to-[#B0E2FF] border-4 border-[#104A7A] text-[#104A7A]"
                } rounded-2xl p-4 w-50 h-70`}
            >
              <h4 className="text-lg font-semibold mb-2">{quest.name}</h4>
              <p className="text-sm text-gray-700 mb-2 flex-1">{quest.description}</p>
              <p className="text-md font-bold mb-2">Điểm: {quest.point}</p>
              {quest.videoUrl && (
                <a
                  href={quest.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1C6CA8] underline text-sm mb-2"
                >
                  Xem Video Hướng Dẫn
                </a>
              )}
              <Button
                variant={"pixelDanger"}
                size={"md"}
                onClick={() => handleStartClick(quest.id)}
                className={`mt-2 text-white text-lg px-4 py-2 w-full`}
              >
                ▶ Bắt đầu
              </Button>
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
              @keyframes bounce {
                0 %, 100 % { transform: translateY(0); }
          50% {transform: translateY(-10px); }
        }
              .animate-popup-appear {
                animation: popup-appear 0.2s ease-out forwards;
        }
              .animate-bounce {
                animation: bounce 2s infinite;
        }
              .custom-scrollbar::-webkit-scrollbar {
                width: 8px;
        }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: #E8F1F2;
        }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background:rgb(48, 174, 215);
              border-radius: 4px;
        }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background:rgb(10, 113, 197);
        }
      `}</style>
    </div>
  );
}