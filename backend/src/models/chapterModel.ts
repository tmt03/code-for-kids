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

export const getAllChaptersWithQuests = async () => {
  const chapters = await GET_DB()
    .collection(CHAPTER_COLLECTION_NAME)
    .find({ _destroy: false })
    .toArray();

  return chapters.map((chapter) => ({
    id: chapter.id,
    name: chapter.name,
    description: chapter.description,
    imageUrl: chapter.imageUrl || "",
    isSpecial: chapter.isSpecial || false,
    quests: (chapter.quests || []).map((q: any) => ({
      id: q.id,
      name: q.name,
      description: q.description,
      point: q.point,
      baseCode: q.baseCode,
      codeHelp: q.codeHelp || "",
      type: q.type,
      imageUrl: q.imageUrl || "",
      videoUrl: q.videoUrl || "",
    })),
  }));
};

export const chapterModel = {
  getAllChapters,
  getAllChaptersWithQuests,
};
