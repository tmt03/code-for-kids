import { GET_DB } from "../config/mongoDB";

const USER_COLLECTION_NAME = 'users';

const getUserInfo = async (username: string) => {
  try {
    const user = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({ username, _destroy: false });

    if (!user) return null;

    return user;
  } catch (error) {
    throw Error(error as string);
  }
};

export const userModel = {
  getUserInfo,
};