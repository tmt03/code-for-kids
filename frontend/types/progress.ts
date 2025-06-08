export interface ProgressSummary {
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
