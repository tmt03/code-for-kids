import { questModel } from "../models/questModel";

const getQuestDetails = async (questId: string) => {
  try {
    const result = await questModel.getQuestDetails(questId);
    if (!result || result.length === 0) throw new Error("Quest not found");
    return result[0].quest;
  } catch (error) {
    throw error;
  }
};

export const questService = {
  getQuestDetails,
};
