"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

type Chapter = {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    isSpecial: boolean;
    quests: any[];
    story?: {
        text: string[];
        audioUrl?: string;
    };
};

type Props = {
    chapter: Chapter | null;
    onClose: () => void;
};

export default function ChapterStory({ chapter, onClose }: Props) {
    const [index, setIndex] = useState(0);
    const [visibleText, setVisibleText] = useState("");
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const getFullText = () => {
        const raw = chapter?.story?.text?.[index] || "";
        return raw
            .replace("{{chapter.name}}", chapter?.name || "")
            .replace("{{chapter.description}}", chapter?.description || "");
    };

    const playTypingEffect = (text: string) => {
        clearInterval(intervalRef.current!);
        let i = 0;
        let output = "";

        intervalRef.current = setInterval(() => {
            if (i < text.length) {
                output += text[i];
                setVisibleText(output);
                i++;
            } else {
                clearInterval(intervalRef.current!);
            }
        }, 30);
    };

    // Khi index hoặc nội dung thay đổi
    useEffect(() => {
        const text = getFullText();
        if (text) {
            playTypingEffect(text);
        }

        // Auto play audio nếu có
        if (audioRef.current && chapter?.story?.audioUrl) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch((e) => console.warn("Audio error:", e));
        }

        return () => clearInterval(intervalRef.current!);
    }, [index, chapter?.id]);

    // Reset lại khi chuyển sang chapter mới
    useEffect(() => {
        setIndex(0);
        setVisibleText("");
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        clearInterval(intervalRef.current!);
    }, [chapter?.id]);

    const handleNext = () => {
        if (index < (chapter?.story?.text.length || 0) - 1) {
            setIndex((prev) => prev + 1);
        } else {
            onClose();
        }
    };

    if (!chapter || !chapter.story) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center px-4">
            <div className="bg-[#1e1e1e] rounded-xl text-white text-center p-6 w-full max-w-2xl animate-fadeIn shadow-2xl">
                <img
                    src="/assets/mascots/pose_docsach.png"
                    alt="Hiệp sĩ Code"
                    className="w-40 h-40 mx-auto mb-4 object-contain"
                />
                <h2 className="text-2xl font-bold mb-4">Hiệp sĩ Code kể chuyện</h2>

                <div className="min-h-[100px] text-lg whitespace-pre-wrap transition-all duration-300 ease-in-out">
                    {visibleText}
                </div>

                <div className="flex justify-center gap-4 mt-6">
                    <Button
                        onClick={handleNext}
                        variant="pixel"
                        className="bg-blue-600 text-white"
                    >
                        {index < (chapter.story.text.length - 1) ? "Tiếp theo" : "Bắt đầu học"}
                    </Button>
                </div>

                {chapter.story.audioUrl && (
                    <audio
                        ref={audioRef}
                        src={chapter.story.audioUrl}
                        onEnded={() => { }}
                        autoPlay
                    />
                )}
            </div>

            <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </div>
    );
}
