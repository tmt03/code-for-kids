import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { chapterModel } from "../models/chapterModel";
import { badgeService } from "../services/badgeService";
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
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Lỗi máy chủ khi khởi tạo tiến độ người dùng",
    });
  }
};

const getLearnProgress = async (req: Request, res: Response) => {
  try {
    const { userId } = (req as any).user;

    const [progressSummary, badgeData] = await Promise.all([
      progressService.getLearnProgress(userId),
      badgeService.getBadgeChapters(userId),
    ]);

    return res.status(StatusCodes.OK).json({
      ...progressSummary,
      badgeChapters: badgeData, // Dùng cho hiển thị CourseBadges
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Không thể lấy tiến độ học đầy đủ",
      message: error.message,
    });
  }
};
export const progressController = {
  initUserProgress,
  getLearnProgress,
};
