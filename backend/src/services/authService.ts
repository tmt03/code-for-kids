import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/environment";
import { userModel } from "../models/userModel";

const generateAccessToken = (user: any) => {
  return jwt.sign(
    { username: user.username,
      role: user.role,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      bannerUrl: user.bannerUrl,
      bio: user.bio, },
    env.JWT_SECRET_ACCESS_TOKEN,
    { expiresIn: "1h" }
  );
};

const generateRefreshToken = (user: any) => {
  return jwt.sign({ username: user.username }, env.JWT_SECRET_REFRESH_TOKEN, {
    expiresIn: "7d",
  });
};

// const JWT_SECRET = process.env.JWT_SECRET || "default-key";

const login = async (username: string, password: string) => {
  const user = await userModel.findByUsername(username);
  if (!user) throw new Error("Tài khoản không tồn tại");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Sai mật khẩu!");

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Lưu refreshToken vào DB
  await userModel.updateRefreshToken(username, refreshToken);

  return {
    accessToken,
    refreshToken,
    user: {
      username: user.username,
      role: user.role,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      bannerUrl: user.bannerUrl,
      bio: user.bio,
    },
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
      throw new Error("Refresh token không hợp lệ");
    }

    const newAccessToken = generateAccessToken(user);
    return { accessToken: newAccessToken };
  } catch (error) {
    throw new Error("Refresh token hết hạn hoặc không hợp lệ");
  }
};

const logout = async (username: string) => {
  return await userModel.updateRefreshToken(username, "");
};

export const authService = {
  login,
  generateAccessToken,
  generateRefreshToken,
  refreshAccessToken,
  logout,
};
