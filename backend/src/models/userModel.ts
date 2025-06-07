import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { GET_DB } from "../config/mongoDB";

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
    ratingPoints: 0,
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

const updateProfile = async (username: string, data: { displayName?: string; bio?: string }) => {
  return await GET_DB()
    .collection(USER_COLLECTION_NAME)
    .updateOne(
      { username },
      { $set: { ...data, updated_at: new Date() } }
    );
};

const changePassword = async (username: string, newPassword: string) => {
  const hashed = await bcrypt.hash(newPassword, 12);
  return await GET_DB()
    .collection(USER_COLLECTION_NAME)
    .updateOne(
      { username },
      { $set: { password: hashed, updated_at: new Date() } }
    );
};

const getLeaderboard = async () => {
  return await GET_DB()
    .collection(USER_COLLECTION_NAME)
    .find({ _destroy: false })
    .project({ username: 1, displayName: 1, avatarUrl: 1, ratingPoints: 1, _id: 0 })
    .sort({ ratingPoints: -1 }) // Sắp xếp giảm dần theo điểm
    .toArray();
};

const increaseRatingPoint = async (userId: string, points: number) => {
  return await GET_DB()
    .collection(USER_COLLECTION_NAME)
    .updateOne(
      { _id: new ObjectId(userId.toString()) },
      { $inc: { ratingPoints: points } }
    );
};

export const userModel = {
  findByUsername,
  createNew,
  updateRefreshToken,
  updateAvatar,
  updateBanner,
  updateProfile,
  changePassword,
  getLeaderboard,
  increaseRatingPoint,
};
