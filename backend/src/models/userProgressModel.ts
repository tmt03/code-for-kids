import { GET_DB } from "../config/mongoDB";
import { ObjectId } from "mongodb";

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

export const userProgressModel = {
  findByUserId,
  insert,
  updateProgress,
};
