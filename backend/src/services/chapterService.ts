import { chapterModel } from "../models/chapterModel";

const getAllChapters = async () => {
  try {
    const result = await chapterModel.getAllChapters();
    if (!result || result.length === 0) throw new Error("Quest not found");
    return result;
  } catch (error) {
    throw error;
  }
};

export const chapterService = {
  getAllChapters,
};
