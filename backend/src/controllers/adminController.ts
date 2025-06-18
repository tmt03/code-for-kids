// backend/src/controllers/adminController.ts
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { userModel } from "../models/userModel";

// Kích hoạt tài khoản user
const activateUser = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    
    if (!username) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Thiếu username"
      });
    }

    const result = await userModel.activateUser(username);
    
    if (result.matchedCount === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Không tìm thấy người dùng"
      });
    }

    return res.status(StatusCodes.OK).json({
      message: "Kích hoạt tài khoản thành công",
      username
    });
  } catch (error: any) {
    console.error("Lỗi kích hoạt user:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Lỗi hệ thống"
    });
  }
};

// Lấy danh sách trial users
const getTrialUsers = async (req: Request, res: Response) => {
  try {
    const trialUsers = await userModel.getTrialUsers();
    
    return res.status(StatusCodes.OK).json({
      trialUsers,
      total: trialUsers.length
    });
  } catch (error: any) {
    console.error("Lỗi lấy trial users:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Lỗi hệ thống"
    });
  }
};

export const adminController = {
  activateUser,
  getTrialUsers
};