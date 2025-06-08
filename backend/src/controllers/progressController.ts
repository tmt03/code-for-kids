import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { chapterModel } from "../models/chapterModel";
import { badgeService } from "../services/badgeService";
import { progressService } from "../services/progressService";

/**
 * Khởi tạo tiến độ học tập cho người dùng mới
 * @param req Request object chứa thông tin người dùng từ token
 * @param res Response object để trả về kết quả
 * @returns Tiến độ học tập đã được khởi tạo hoặc lỗi
 */
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

    // Khởi tạo progress nếu chưa tồn tại
    const progress = await progressService.initProgressIfNotExists(
      userId,
      chapters
    );

    return res.status(StatusCodes.OK).json(progress);
  } catch (error: any) {
    console.error("❌ Lỗi khởi tạo tiến độ:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Lỗi máy chủ khi khởi tạo tiến độ người dùng",
    });
  }
};

/**
 * Lấy thông tin tiến độ học tập và huy hiệu của người dùng
 * @param req Request object chứa thông tin người dùng từ token
 * @param res Response object để trả về kết quả
 * @returns Tổng hợp tiến độ học tập và huy hiệu
 */
const getLearnProgress = async (req: Request, res: Response) => {
  try {
    const { userId } = (req as any).user;

    // Lấy song song cả tiến độ và huy hiệu để tối ưu thời gian
    const [progressSummary, badgeData] = await Promise.all([
      progressService.getLearnProgress(userId),
      badgeService.getBadgeChapters(userId),
    ]);

    return res.status(StatusCodes.OK).json({
      ...progressSummary,
      badgeChapters: badgeData, // Dùng cho hiển thị CourseBadges
    });
  } catch (error: any) {
    console.error("❌ Lỗi lấy tiến độ học:", error);
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
