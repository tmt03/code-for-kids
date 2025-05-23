import { GET_DB } from "../config/mongoDB";

const CHAPTER_COLLECTION_NAME = "chapters";

const getAllChapters = async () => {
  try {
    const result = await GET_DB()
      .collection(CHAPTER_COLLECTION_NAME)
      .find({ _destroy: false })
      .project({ _id: 0 })
      .toArray();

    return result;
  } catch (error) {
    throw Error(error as string);
  }
};

export const chapterModel = {
  getAllChapters,
};
