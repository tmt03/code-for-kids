import { userProgressModel } from "../models/userProgressModel";

const checkAndAward = async (userId: string) => {
  const progress = await userProgressModel.findByUserId(userId);
  if (!progress) return;

  const totalBadges = progress.chapterProgress.filter(
    (ch: any) => ch.badgeEarned
  ).length;

  await userProgressModel.updateProgress(userId, {
    $set: {
      badges: totalBadges,
      lastUpdated: new Date(),
    },
  });
};

// Hàm lấy dua huy hiệu đã đạt được

export const badgeService = {
  checkAndAward,
};
