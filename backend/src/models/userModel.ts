import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { GET_DB } from "../config/mongoDB";

const USER_COLLECTION_NAME = "users";

// Tạo tài khoản người dùng mới
const createNew = async (data: any) => {
  const newUser = {
    username: data.username,
    password: data.password,
    role: data.role || "user",
    refreshToken: "",
    email: data.email,
    ratingPoints: 0,
    created_at: new Date(),
    updated_at: null,
    _destroy: false,
    avatarUrl: null,
    bannerUrl: null,
    bio: null,
    displayName: null,
    resetOTP: null,
    resetOTPExpires: null,
    isVerified: false,
    registerOTP: null,
    registerOTPExpires: null,

    //TRIAL MODE FIELDS
    isActivated: false,
    trialChapterId: "C00",
    trialExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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

const findByEmail = async (email: string) => {
  try {
    const user = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({ email, _destroy: false });

    if (!user) return null;

    return user;
  } catch (error) {
    throw Error(error as string);
  }
};

// Cập nhật refreshToken
const updateRefreshToken = async (username: string, refreshToken: string) => {
  try {
    return await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .updateOne({ username }, { $set: { refreshToken } });
  } catch (error) {
    console.error(
      `[UserModel] Failed to update refreshToken for ${username}:`,
      error
    );
    throw error;
  }
};

const updateAvatar = async (username: string, avatarUrl: string) => {
  return await GET_DB()
    .collection(USER_COLLECTION_NAME)
    .updateOne({ username }, { $set: { avatarUrl, updated_at: new Date() } });
};

const updateBanner = async (username: string, bannerUrl: string) => {
  return await GET_DB()
    .collection(USER_COLLECTION_NAME)
    .updateOne({ username }, { $set: { bannerUrl, updated_at: new Date() } });
};

const updateProfile = async (
  username: string,
  data: { displayName?: string; bio?: string }
) => {
  return await GET_DB()
    .collection(USER_COLLECTION_NAME)
    .updateOne({ username }, { $set: { ...data, updated_at: new Date() } });
};

const changePassword = async (username: string, newPassword: string) => {
  const hashed = await bcrypt.hash(newPassword, 10);
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
    .find({ _destroy: false, role: "user" })
    .project({
      username: 1,
      displayName: 1,
      avatarUrl: 1,
      ratingPoints: 1,
      _id: 1,
    })
    .sort({ ratingPoints: -1 }) // Sắp xếp giảm dần theo điểm
    .toArray();
};

const saveOTP = async (username: string, otp: string, expires: number) => {
  return await GET_DB()
    .collection(USER_COLLECTION_NAME)
    .updateOne(
      { username },
      { $set: { resetOTP: otp, resetOTPExpires: expires } }
    );
};

const getOTP = async (username: string) => {
  return await GET_DB()
    .collection(USER_COLLECTION_NAME)
    .findOne({ username }, { projection: { resetOTP: 1, resetOTPExpires: 1 } });
};

const clearOTP = async (username: string) => {
  return await GET_DB()
    .collection(USER_COLLECTION_NAME)
    .updateOne({ username }, { $unset: { resetOTP: "", resetOTPExpires: "" } });
};

const increaseRatingPoint = async (userId: string, points: number) => {
  return await GET_DB()
    .collection(USER_COLLECTION_NAME)
    .updateOne(
      { _id: new ObjectId(userId.toString()) },
      { $inc: { ratingPoints: points } }
    );
};

const saveRegisterOTP = async (email: string, otp: string, expires: number) => {
  return await GET_DB()
    .collection(USER_COLLECTION_NAME)
    .updateOne(
      { email },
      { $set: { registerOTP: otp, registerOTPExpires: expires } }
    );
};

const getRegisterOTP = async (email: string) => {
  return await GET_DB()
    .collection(USER_COLLECTION_NAME)
    .findOne(
      { email },
      { projection: { registerOTP: 1, registerOTPExpires: 1 } }
    );
};

const clearRegisterOTP = async (email: string) => {
  return await GET_DB()
    .collection(USER_COLLECTION_NAME)
    .updateOne(
      { email },
      { $unset: { registerOTP: "", registerOTPExpires: "" } }
    );
};

const verifyUser = async (email: string) => {
  return await GET_DB()
    .collection(USER_COLLECTION_NAME)
    .updateOne(
      { email },
      { $set: { isVerified: true, updated_at: new Date() } }
    );
};

// Thêm các function mới cho trial mode
const activateUser = async (username: string) => {
  return await GET_DB()
    .collection(USER_COLLECTION_NAME)
    .updateOne(
      { username },
      {
        $set: {
          isActivated: true,
          updated_at: new Date(),
        },
        $unset: {
          trialExpiresAt: "",
        },
      }
    );
};

const updateTrialChapter = async (username: string, chapterId: string) => {
  return await GET_DB()
    .collection(USER_COLLECTION_NAME)
    .updateOne(
      { username },
      { $set: { trialChapterId: chapterId, updated_at: new Date() } }
    );
};

const getTrialUsers = async () => {
  return await GET_DB()
    .collection(USER_COLLECTION_NAME)
    .find({
      isActivated: false,
      _destroy: false,
    })
    .project({
      username: 1,
      displayName: 1,
      created_at: 1,
      trialExpiresAt: 1,
      trialChapterId: 1,
    })
    .toArray();
};

// Xóa user theo email
const deleteByEmail = async (email: string) => {
  return await GET_DB().collection(USER_COLLECTION_NAME).deleteOne({ email });
};

/**
 * Ban user (set _destroy = true)
 */
const banUser = async (username: string) => {
  return await GET_DB()
    .collection(USER_COLLECTION_NAME)
    .updateOne({ username }, { $set: { _destroy: true } });
};

/**
 * Mở ban user (set _destroy = false)
 */
const unbanUser = async (username: string) => {
  return await GET_DB()
    .collection(USER_COLLECTION_NAME)
    .updateOne({ username }, { $set: { _destroy: false } });
};

/**
 * Update user info (password, displayName, email, ...)
 * @param username
 * @param updateData
 */
const updateUser = async (username: string, updateData: any) => {
  // Nếu có password thì hash lại
  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }
  return await GET_DB()
    .collection(USER_COLLECTION_NAME)
    .updateOne({ username }, { $set: updateData });
};

/**
 * Lấy danh sách user (loại bỏ admin, bao gồm cả user đã bị ban)
 */
const findAllUsers = async () => {
  return await GET_DB()
    .collection(USER_COLLECTION_NAME)
    .find({ role: { $ne: "admin" } })
    .project({
      username: 1,
      displayName: 1,
      email: 1,
      role: 1,
      avatarUrl: 1,
      created_at: 1,
      isActivated: 1,
      _destroy: 1,
    })
    .toArray();
};

/**
 * Hủy kích hoạt khóa học (set isActivated: false, trialExpiresAt: null)
 */
const deactivateUser = async (username: string) => {
  return await GET_DB()
    .collection(USER_COLLECTION_NAME)
    .updateOne(
      { username },
      {
        $set: { isActivated: false, updated_at: new Date() },
        $unset: { trialExpiresAt: "" },
      }
    );
};

export const userModel = {
  findByUsername,
  findByEmail,
  createNew,
  updateRefreshToken,
  updateAvatar,
  updateBanner,
  updateProfile,
  changePassword,
  getLeaderboard,
  saveOTP,
  getOTP,
  clearOTP,
  increaseRatingPoint,
  saveRegisterOTP,
  getRegisterOTP,
  clearRegisterOTP,
  verifyUser,
  activateUser,
  updateTrialChapter,
  getTrialUsers,
  deleteByEmail,
  banUser,
  unbanUser,
  updateUser,
  findAllUsers,
  deactivateUser,
};
