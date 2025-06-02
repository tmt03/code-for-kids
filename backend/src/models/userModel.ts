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
    avatarUrl: null,
    bannerUrl: null,
    bio: null,
    displayName: null,
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

const updateAvatar = async (username: string, avatarUrl: string) => {
  return await GET_DB()
    .collection(USER_COLLECTION_NAME)
    .updateOne(
      { username },
      { $set: { avatarUrl, updated_at: new Date() } }
    );
};

const updateBanner = async (username: string, bannerUrl: string) => {
  return await GET_DB()
    .collection(USER_COLLECTION_NAME)
    .updateOne(
      { username },
      { $set: { bannerUrl, updated_at: new Date() } }
    );
};

export const userModel = {
  findByUsername,
  createNew,
  updateRefreshToken,
  updateAvatar,
  updateBanner,
};
