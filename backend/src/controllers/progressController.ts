import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { chapterModel } from "../models/chapterModel";
import { progressService } from "../services/progressService";

const initUserProgress = async (req: Request, res: Response) => {
  try {
    const { userId } = (req as any).user as { userId: string };

    if (!userId) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Không xác định được người dùng" });
    }

    // Lấy danh sách chương và quest để khởi tạo progress
    const chapters = await chapterModel.getAllChaptersWithQuests();

    // Gọi service khởi tạo nếu chưa có
    const progress = await progressService.initProgressIfNotExists(
      userId,
      chapters
    );

    return res.status(StatusCodes.OK).json(progress);
  } catch (error: any) {
    console.error("Lỗi khi khởi tạo tiến độ:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Lỗi máy chủ khi khởi tạo tiến độ người dùng",
    });
  }
};

const getLearnProgress = async (req: Request, res: Response) => {
  try {
    const { userId } = (req as any).user;

    const progressSummary = await progressService.getLearnProgress(userId);
    console.log(progressSummary);

    res.status(StatusCodes.OK).json(progressSummary);
  } catch (error: any) {
    console.error("Lỗi getLearnProgress:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Không thể lấy tiến độ học",
      message: error.message,
    });
  }
};
export const progressController = {
  initUserProgress,
  getLearnProgress,
};
