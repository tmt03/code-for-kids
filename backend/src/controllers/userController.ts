import { Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import { userModel } from "../models/userModel";
import { StatusCodes } from "http-status-codes";

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