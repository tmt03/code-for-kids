import { chapterModel } from "../models/chapterModel";
import { userProgressModel } from "../models/userProgressModel";

const checkAndAward = async (userId: string) => {
  const progress = await userProgressModel.findByUserId(userId);
  if (!progress) return;

  for (const chapter of progress.chapterProgress) {
    const allCompleted = chapter.quests.every(
      (q: any) => q.status === "completed"
    );
    if (allCompleted && !chapter.badgeEarned) {
      await userProgressModel.awardChapterBadge(userId, chapter.chapterId);
    }
  }
};

// Hàm lấy dua huy hiệu đã đạt được
const getBadgeChapters = async (userId: string) => {
  const progress = await userProgressModel.findByUserId(userId);
  if (!progress) return [];

  const chapterMeta = await chapterModel.getAllChapterForBadge();

  return progress.chapterProgress.map((ch: any) => {
    const meta = chapterMeta.find((c) => c.id === ch.chapterId);
    return {
      chapterId: ch.chapterId,
      status: ch.status,
      badgeEarned: ch.badgeEarned,
      isSpecial: meta?.isSpecial || false,
    };
  });
};

export const badgeService = {
  checkAndAward,
  getBadgeChapters,
};
