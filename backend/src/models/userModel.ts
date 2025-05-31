import { GET_DB } from "../config/mongoDB";
import bcrypt from "bcryptjs";

const USER_COLLECTION_NAME = "users";

// Tạo tài khoản người dùng mới
const createNew = async (data: any) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const newUser = {
    username: data.username,
    password: hashedPassword,
    role: data.role || "user",
    refreshToken: null,
    email: null,
    created_at: null,
    updated_at: null,
    _destroy: false,
  };

  const result = await GET_DB()
    .collection(USER_COLLECTION_NAME)
    .insertOne(newUser);
  return result;
};

const findByUsername = async (username: string) => {
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

// Cập nhật refreshToken
const updateRefreshToken = async (username: string, refreshToken: string) => {
  return await GET_DB()
    .collection(USER_COLLECTION_NAME)
    .updateOne({ username }, { $set: { refreshToken } });
};

export const userModel = {
  findByUsername,
  createNew,
  updateRefreshToken,
};
