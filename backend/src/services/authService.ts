import { userModel } from "../models/userModel";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || 'default-key';

const getUserInfo = async (username: string) => {
  try {
    const result = await userModel.getUserInfo(username);
    if (!result) throw new Error("Không tìm thấy người dùng");
    return result;
  } catch (error) {
    throw error;
  }
};

const login = async (username: string, password: string) => {
  try {
    const user = await getUserInfo(username);

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) throw new Error("Sai mật khẩu!");

    // Loại bỏ password trước khi trả về
    const { password_hash, ...userWithoutPass } = user;

    return userWithoutPass;
  } catch (error) {
    throw error;
  }
};

export const authService = {
  getUserInfo,
  login,
};
