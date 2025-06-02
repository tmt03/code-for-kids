// lib/context/ProgressContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ProgressSummary {
    totalScore: number;
    completedQuests: number;
    completedChallenges: number;
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
    });

    return (
        <ProgressContext.Provider value={{ progressSummary, setProgressSummary }}>
            {children}
        </ProgressContext.Provider>
    );
};