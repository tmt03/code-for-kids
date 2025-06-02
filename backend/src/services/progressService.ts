import { userProgressModel } from "../models/userProgressModel";
import { ChapterWithQuests } from "../types";

const buildInitProgress = (userId: string, chapters: ChapterWithQuests[]) => {
  return {
    userId,
    chapterProgress: chapters.map((ch) => ({
      chapterId: ch.id,
      status: "not-started",
      badgeEarned: false,
      completedAt: null,
      quests: ch.quests.map((q) => ({
        questId: q.id,
        type: q.type,
        status: "not-started",
        score: 0,
        completedAt: null,
        attempts: [],
      })),
    })),
    totalScore: 0,
    badges: [],
    lastUpdated: new Date(),
  };
};

const initProgressIfNotExists = async (
  userId: string,
  chapters: ChapterWithQuests[]
) => {
  const existing = await userProgressModel.findByUserId(userId);
  if (existing) return existing;

  const newProgress = buildInitProgress(userId, chapters);
  await userProgressModel.insert(newProgress);
  return newProgress;
};

// Đánh dấu quest là hoàn thành
const markQuestCompleted = async (userId: string, questId: string) => {
  const progress = await userProgressModel.findByUserId(userId);
  if (!progress) return;

  const chapter = progress.chapterProgress.find((ch: any) =>
    ch.quests.some((q: any) => q.questId === questId)
  );

  if (!chapter) return;

  const quest = chapter.quests.find((q: any) => q.questId === questId);
  if (!quest || quest.status === "completed") return;

  quest.status = "completed";
  quest.score = 10; // Có thể lấy từ DB questModel sau
  quest.completedAt = new Date();
  quest.attempts.push({ at: new Date(), result: "passed" });

  chapter.status = "in-progress";
  progress.lastUpdated = new Date();

  await userProgressModel.updateProgress(userId, {
    $set: {
      chapterProgress: progress.chapterProgress,
      lastUpdated: new Date(),
    },
  });
};

// Cộng lại toàn bộ điểm từ các quest đã hoàn thành
const updateTotalScore = async (userId: string) => {
  const progress = await userProgressModel.findByUserId(userId);
  if (!progress) return;

  let total = 0;
  for (const ch of progress.chapterProgress) {
    for (const q of ch.quests) {
      if (q.status === "completed") total += q.score;
    }
  }

  await userProgressModel.updateProgress(userId, {
    $set: { totalScore: total, lastUpdated: new Date() },
  });
};

// Nếu tất cả quest và challenge trong chapter đều done → hoàn thành chapter
const checkAndMarkChapterDone = async (userId: string, questId: string) => {
  const progress = await userProgressModel.findByUserId(userId);
  if (!progress) return;

  const chapter = progress.chapterProgress.find((ch: any) =>
    ch.quests.some((q: any) => q.questId === questId)
  );
  if (!chapter) return;

  const allDone = chapter.quests.every((q: any) => q.status === "completed");

  if (allDone && chapter.status !== "completed") {
    chapter.status = "completed";
    chapter.badgeEarned = true;
    chapter.completedAt = new Date();
    progress.lastUpdated = new Date();

    await userProgressModel.updateProgress(userId, {
      $set: {
        chapterProgress: progress.chapterProgress,
        lastUpdated: new Date(),
      },
    });
  }
};

// Hàm lấy số quest, challenges, điểm đã hoàn thành
const getLearnProgress = async (userId: string) => {
  return await userProgressModel.aggregateProgressSummary(userId);
};

// Kiểm tra điều kiện mở khóa chapter tiếp theo.
//conditionBeforeNextChapter

// Trả về % tiến độ học tập (dựa vào totalScore).

export const progressService = {
  buildInitProgress,
  initProgressIfNotExists,
  markQuestCompleted,
  updateTotalScore,
  checkAndMarkChapterDone,
  getLearnProgress,
};
