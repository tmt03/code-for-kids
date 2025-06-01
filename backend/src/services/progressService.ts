import { ChapterWithQuests } from "../types"; // nếu bạn định nghĩa riêng
import { userProgressModel } from "../models/userProgressModel";

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
        status: "not-started",
        score: 0,
        completedAt: null,
        attempts: [],
      })),
    })),
    totalScore: 0,
    badges: 0,
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

export const progressService = {
  buildInitProgress,
  initProgressIfNotExists,
};

// // Đánh dấu quest/chapter đã hoàn thành.
// const updateQuestProgress = async (userId: string, questId: string, chapterId: string, score: number, code: string) => {
//   const now = new Date();
//   const userProgress = await db.user_progress.findOne({ userId });

//   const chapter = userProgress.chapterProgress.find(ch => ch.chapterId === chapterId);
//   const quest = chapter.quests.find(q => q.questId === questId);

//   if (quest.status !== "completed") {
//     quest.status = "completed";
//     quest.completedAt = now;
//     quest.score = score;
//     userProgress.totalScore += score;

//     quest.attempts.push({ submittedCode: code, passed: true, submittedAt: now });
//   }

//   // Nếu tất cả quest đã hoàn thành
//   if (chapter.quests.every(q => q.status === "completed")) {
//     chapter.status = "completed";
//     chapter.completedAt = now;
//     if (!chapter.badgeEarned) {
//       chapter.badgeEarned = true;
//       userProgress.badges += 1;
//     }
//   }

//   userProgress.lastUpdated = now;
//   await db.user_progress.updateOne({ userId }, { $set: userProgress });
// };

// Kiểm tra điều kiện mở khóa chapter tiếp theo.
//conditionBeforeNextChapter

// Trả về % tiến độ học tập.

// Lưu trạng thái chưa hoàn thành (paused, saved draft, v.v.).
