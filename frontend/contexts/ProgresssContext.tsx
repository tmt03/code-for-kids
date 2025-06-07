// lib/context/ProgressContext.tsx
"use client";

import { createContext, ReactNode, useState } from "react";
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

export const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider = ({ children }: { children: ReactNode }) => {
    const [progressSummary, setProgressSummary] = useState<ProgressSummary>({
        totalScore: 0,
        completedQuests: 0,
        completedChallenges: 0,
        badgeChapters: [],
    });

    return (
        <ProgressContext.Provider value={{
            progressSummary,
            setProgressSummary,
        }}>
            {children}
        </ProgressContext.Provider>
    );
};