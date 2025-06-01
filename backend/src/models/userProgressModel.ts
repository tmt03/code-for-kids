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

export const userProgressModel = {
  findByUserId,
  insert,
};
