import { GET_DB } from "../config/mongoDB";

const USER_PROGRESS_COLLECTION = "user_progress";

const findByUserId = async (userId: string) => {
  const result = await GET_DB()
    .collection(USER_PROGRESS_COLLECTION)
    .findOne({ userId });

  return result;
};

const insert = async (newProgress: any) => {
  const result = await GET_DB()
    .collection(USER_PROGRESS_COLLECTION)
    .insertOne(newProgress);
  return result;
};

const updateProgress = async (userId: string, updateData: any) => {
  return await GET_DB()
    .collection(USER_PROGRESS_COLLECTION)
    .updateOne({ userId }, updateData);
};

const aggregateProgressSummary = async (userId: string) => {
  const result = await GET_DB()
    .collection(USER_PROGRESS_COLLECTION)
    .aggregate([
      { $match: { userId } },
      { $unwind: "$chapterProgress" },
      { $unwind: "$chapterProgress.quests" },
      { $match: { "chapterProgress.quests.status": "completed" } },
      {
        $lookup: {
          from: "chapters", // Join để lấy type của quest
          localField: "chapterProgress.chapterId",
          foreignField: "id",
          as: "chapterData",
        },
      },
      { $unwind: "$chapterData" },
      {
        $addFields: {
          currentQuest: {
            $filter: {
              input: "$chapterData.quests",
              as: "q",
              cond: { $eq: ["$$q.id", "$chapterProgress.quests.questId"] },
            },
          },
        },
      },
      { $unwind: "$currentQuest" },
      {
        $group: {
          _id: null,
          totalScore: { $first: "$totalScore" },
          completedQuests: {
            $sum: {
              $cond: [{ $eq: ["$currentQuest.type", "quest"] }, 1, 0],
            },
          },
          completedChallenges: {
            $sum: {
              $cond: [{ $eq: ["$currentQuest.type", "challenge"] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalScore: 1,
          completedQuests: 1,
          completedChallenges: 1,
        },
      },
    ])
    .toArray();

  return (
    result[0] || {
      totalScore: 0,
      completedQuests: 0,
      completedChallenges: 0,
    }
  );
};

const awardChapterBadge = async (userId: string, chapterId: string) => {
  return await GET_DB()
    .collection(USER_PROGRESS_COLLECTION)
    .updateOne(
      { userId, "chapterProgress.chapterId": chapterId },
      {
        $set: {
          "chapterProgress.$.badgeEarned": true,
          "chapterProgress.$.completedAt": new Date(),
        },
        $inc: {
          badges: 1,
        },
      }
    );
};

export const userProgressModel = {
  findByUserId,
  insert,
  updateProgress,
  aggregateProgressSummary,
  awardChapterBadge,
};
