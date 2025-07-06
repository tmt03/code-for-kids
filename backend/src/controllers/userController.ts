import { Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import { userModel } from "../models/userModel";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";

export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // Upload lên Cloudinary
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "user_avatars" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file?.buffer as Buffer);
    });

    // Lưu URL vào user (giả sử đã xác thực, lấy user từ req.user)
    const username = (req as any).user?.username;
    if (username) {
      await userModel.updateAvatar(username, result.secure_url);
    }

    res.status(StatusCodes.OK).json({ url: result.secure_url });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const uploadBanner = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // Upload lên Cloudinary
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "user_banners" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file?.buffer as Buffer);
    });

    // Lưu URL vào user (giả sử đã xác thực, lấy user từ req.user)
    const username = (req as any).user?.username;
    if (username) {
      await userModel.updateBanner(username, result.secure_url);
    }

    res.status(StatusCodes.OK).json({ url: result.secure_url });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const username = (req as any).user?.username;
    const { displayName, bio } = req.body;
    if (!username) return res.status(401).json({ error: "Unauthorized" });

    await userModel.updateProfile(username, { displayName, bio });
    res.status(StatusCodes.OK).json({ message: "Cập nhật thành công" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const username = (req as any).user?.username;
    const { oldPassword, newPassword } = req.body;
    if (!username) return res.status(401).json({ error: "Unauthorized" });

    const user = await userModel.findByUsername(username);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: "Incorrect old password" });

    await userModel.changePassword(username, newPassword);
    res.status(200).json({ message: "Đổi mật khẩu thành công" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const users = await userModel.getLeaderboard();
    // Đảm bảo user nào không có ratingPoints thì trả về 0
    const result = users.map(u => ({
      ...u,
      ratingPoints: typeof u.ratingPoints === "number" ? u.ratingPoints : 0,
    }));
    res.status(StatusCodes.OK).json({ users: result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserProfileByUsername = async (req: Request, res: Response) => {
  try {
    const {username} = req.params;
    const user = await userModel.findByUsername(username);
    if (!user) return res.status(404).json({ error: "User not found" });

    const { password, refreshToken, resetOTP, resetOTPExpires, email, ...safeUser } = user;
    res.status(200).json({ user: safeUser});
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};