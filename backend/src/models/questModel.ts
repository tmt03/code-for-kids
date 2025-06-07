import { GET_DB } from "../config/mongoDB";

const CHAPTER_COLLECTION_NAME = "chapters";

const getQuestDetails = async (questId: string) => {
  try {
    const result = await GET_DB()
      .collection(CHAPTER_COLLECTION_NAME)
      .aggregate([
        { $unwind: "$quests" },
        { $match: { "quests.id": questId } },
        { $project: { _id: 0, quest: "$quests" } },
      ])
      .toArray();
    return result;
  } catch (error) {
    throw Error(error as string);
  }
};

const getBaseCodeByQuestId = async (questId: string) => {
  try {
    const result = await GET_DB()
      .collection(CHAPTER_COLLECTION_NAME)
      .aggregate([
        { $unwind: "$quests" },
        { $match: { "quests.id": questId } },
        { $project: { _id: 0, baseCode: "$quests.baseCode" } },
      ])
      .toArray();
    if (!result.length) {
      throw new Error(`Quest with id ${questId} not found`);
    }

    const baseCode = result[0].baseCode;
    return baseCode;
  } catch (error) {
    throw Error(error as string);
  }
};

/**
 * Lấy điểm của quest từ collection chapters dựa trên questId.
 * @param questId ID của quest cần lấy điểm.
 * @returns Điểm của quest (number).
 * @throws Error nếu không tìm thấy quest hoặc xảy ra lỗi truy vấn.
 */
const getPointByQuestId = async (questId: string): Promise<number> => {
  try {
    const result = await GET_DB()
      .collection(CHAPTER_COLLECTION_NAME)
      .aggregate([
        { $unwind: "$quests" },
        { $match: { "quests.id": questId } },
        { $project: { _id: 0, point: "$quests.point" } },
      ])
      .toArray();

    const point = result[0].point;
    return point;
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error(`Lỗi khi lấy điểm của quest ${questId}: ${error}`);
  }
};

export const questModel = {
  getQuestDetails,
  getBaseCodeByQuestId,
  getPointByQuestId,
};
