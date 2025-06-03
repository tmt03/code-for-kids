//Chuyên xử lý việc nộp code và chấm điểm:
// Nhận code

// Gửi sang CodeCheckerService để đánh giá

// Dùng ScoreService để tính điểm

// Gọi ProgressService để đánh dấu hoàn thành quest nếu đủ điểm

import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { badgeService } from "../services/badgeService";
import { codeCheckService } from "../services/codeCheckService";
import { progressService } from "../services/progressService";
import { scoreService } from "../services/scoreService";

const submitCode = async (req: Request, res: Response, next: NextFunction) => {
  const { code, questId } = req.body;
  const { userId } = (req as any).user;

  if (!userId) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Không xác thực được người dùng." });
  }

  if (!code || !questId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Thiếu code hoặc questId." });
  }

  try {
    // 1. Kiểm tra logic code
    const result = await codeCheckService.logicCheck(code);
    if (!result.passed) return res.status(StatusCodes.OK).json(result);

    // 2. Tiến trình cập nhật nếu passed
    await progressService.markQuestCompleted(userId, questId); // Cập nhật quest completed
    await progressService.updateTotalScore(userId); //Cập nhật totalScore
    await progressService.checkAndMarkChapterDone(userId, questId); //Cập nhật chapter completed nếu tất cả quest completed
    await badgeService.checkAndAward(userId); // Kiểm tra và trao badge
    await scoreService.addUserRatingScore(userId, questId, code); // Update ratingScore trong users
    await progressService.recordAttempt(userId, questId, code); // lưu code người dung vào attempt trong user_progress

    return res.status(StatusCodes.OK).json({
      ...result,
      message: "Nộp code thành công, tiến trình đã được cập nhật!",
    });
  } catch (error: any) {
    console.error("Lỗi khi xử lý submitCode:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Lỗi hệ thống khi xử lý tiến trình.",
      message: error.message,
    });
  }
};

export const submissionController = {
  submitCode,
};
