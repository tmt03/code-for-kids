import { userModel } from "../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

    const token = jwt.sign(
      {
        _id: user._id,
        username: user.username,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password_hash, ...userWithoutPass } = user;

    return { token, userWithoutPass };

  } catch (error) {
    throw error;
  }
};

export const authService = {
  getUserInfo,
  login,
};
