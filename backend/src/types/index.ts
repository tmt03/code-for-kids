// types/index.ts

export type Quest = {
  id: string;
  name: string;
  description: string;
  point: number;
  baseCode: string;
  codeHelp?: string;
  type: "quest" | "challenge";
  imageUrl?: string;
  videoUrl?: string;
};

export type ChapterWithQuests = {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  isSpecial?: boolean;
  quests: Quest[];
};

export type ChapterProgress = {
  chapterId: string;
  status: "not-started" | "in-progress" | "completed";
  badgeEarned: boolean;
  completedAt: Date | null;
  quests: QuestProgress[];
};

export type QuestProgress = {
  questId: string;
  status: "not-started" | "in-progress" | "completed";
  score: number;
  completedAt: Date | null;
  attempts: string[]; // code user từng gửi
};
