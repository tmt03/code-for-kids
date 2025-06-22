import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/environment";
import { userModel } from "../models/userModel";

const generateAccessToken = (user: any) => {
  return jwt.sign(
    {
      userId: user._id.toString(),
      username: user.username,
      role: user.role,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      bannerUrl: user.bannerUrl,
      bio: user.bio,
      // TRIAL MODE INFO
      isActivated: user.isActivated || false,
      trialChapterId: user.trialChapterId || "C00",
    },
    env.JWT_SECRET_ACCESS_TOKEN,
    { expiresIn: "1h" }
  );
};

const generateRefreshToken = (user: any) => {
  return jwt.sign(
    { userId: user._id.toString(), username: user.username },
    env.JWT_SECRET_REFRESH_TOKEN,
    {
      expiresIn: "7d",
    }
  );
};

// const JWT_SECRET = process.env.JWT_SECRET || "default-key";

const login = async (username: string, password: string) => {
  const user = await userModel.findByUsername(username);
  if (!user)
    throw new Error(
      "Đăng nhập thất bại: Không tìm thấy tên đăng nhập hoặc không tồn tại"
    );

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Sai mật khẩu!");

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Lưu refreshToken vào DB
  await userModel.updateRefreshToken(username, refreshToken);

  // Sử dụng getUserInfo để lấy thông tin đầy đủ
  const userInfo = await getUserInfo(username);

  return {
    accessToken,
    refreshToken,
    user: userInfo,
  };
};

const refreshAccessToken = async (refreshToken: string) => {
  try {
    const decoded = jwt.verify(
      refreshToken,
      env.JWT_SECRET_REFRESH_TOKEN
    ) as any;
    const username = decoded.username;

    const user = await userModel.findByUsername(username);
    if (!user || user.refreshToken !== refreshToken) {
      throw new Error("Phiên đăng nhập không hợp lệ.");
    }

    const newAccessToken = generateAccessToken(user);
    return { accessToken: newAccessToken };
  } catch (error) {
    // Lỗi có thể là do jwt.verify (hết hạn, sai định dạng)
    throw new Error("Phiên đăng nhập đã hết hạn hoặc không đúng định dạng.");
  }
};

const logout = async (username: string) => {
  return await userModel.updateRefreshToken(username, "");
};

const getUserInfo = async (username: string) => {
  const user = await userModel.findByUsername(username);
  if (!user) return null;

  // Tính toán trial info
  const isExpired = user.trialExpiresAt
    ? new Date() > user.trialExpiresAt
    : false;
  const daysLeft = user.trialExpiresAt
    ? Math.ceil(
        (user.trialExpiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
    : 0;

  // Trả về thông tin an toàn, không trả password
  return {
    userId: user._id,
    username: user.username,
    role: user.role,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    bannerUrl: user.bannerUrl,
    bio: user.bio,
    email: user.email,
    ratingPoints: user.ratingPoints,
    // TRIAL MODE INFO
    isActivated: user.isActivated || false,
    trialChapterId: user.trialChapterId || "C00",
    trialExpiresAt: user.trialExpiresAt,
    trialInfo: user.isActivated
      ? null
      : {
          isExpired,
          daysLeft: Math.max(0, daysLeft),
          allowedChapter: user.trialChapterId || "C00",
        },
  };
};

export const authService = {
  login,
  generateAccessToken,
  generateRefreshToken,
  refreshAccessToken,
  logout,
  getUserInfo,
};
