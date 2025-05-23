import { GET_DB } from "../config/mongoDB";

const CHAPTER_COLLECTION_NAME = "chapter";

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

export const questModel = {
  getQuestDetails,
};
