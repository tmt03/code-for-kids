// hooks/useProgress.ts
"use client";

import { ProgressContext } from "@/contexts/ProgresssContext"; // Import Context từ file cũ
import { useContext } from "react";

interface ProgressSummary {
  totalScore: number;
  completedQuests: number;
  completedChallenges: number;
  badgeChapters: Array<{
    chapterId: string;
    status: string;
    badgeEarned: boolean;
    isSpecial?: boolean;
  }>;
}

interface ProgressContextType {
  progressSummary: ProgressSummary;
  setProgressSummary: (progress: ProgressSummary) => void;
}

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
};
