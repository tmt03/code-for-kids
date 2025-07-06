// backend/src/middlewares/trialMiddleware.ts
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { userModel } from "../models/userModel";

// Middleware kiểm tra trial mode
export const checkTrialMode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, username } = (req as any).user;

    if (!userId || !username) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: "Không xác định được người dùng",
      });
    }

    const user = await userModel.findByUsername(username);

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Không tìm thấy người dùng",
      });
    }

    // Kiểm tra trial mode
    if (!user.isActivated) {
      // Kiểm tra hết hạn trial
      if (user.trialExpiresAt && new Date() > user.trialExpiresAt) {
        return res.status(StatusCodes.FORBIDDEN).json({
          error: "Tài khoản thử nghiệm đã hết hạn",
          code: "TRIAL_EXPIRED",
        });
      }

      // Thêm thông tin trial vào request
      (req as any).trialMode = {
        isTrial: true,
        trialChapterId: user.trialChapterId,
        trialExpiresAt: user.trialExpiresAt,
      };
    } else {
      (req as any).trialMode = {
        isTrial: false,
      };
    }

    next();
  } catch (error) {
    console.error("Lỗi kiểm tra trial mode:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Lỗi hệ thống",
    });
  }
};

// Middleware chặn API nếu là trial mode
export const blockTrialMode = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const trialMode = (req as any).trialMode;

  if (trialMode && trialMode.isTrial) {
    return res.status(StatusCodes.FORBIDDEN).json({
      error: "Tính năng này chỉ khả dụng cho tài khoản đã kích hoạt",
      code: "TRIAL_RESTRICTED",
    });
  }

  next();
};

// Middleware kiểm tra chapter thử nghiệm
export const checkTrialChapter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const trialMode = (req as any).trialMode;
  const { questId, chapterId } = req.params;

  if (trialMode && trialMode.isTrial) {
    const allowedChapters = ["C00", "C01"];

    const isTrialChapter = allowedChapters.some(
      (chapter) =>
        questId?.startsWith(chapter) || chapterId?.startsWith(chapter)
    );

    if (!isTrialChapter) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: "Chỉ có thể học chapter thử nghiệm trong chế độ trial",
        code: "TRIAL_CHAPTER_RESTRICTED",
        allowedChapters: allowedChapters,
      });
    }
  }

  next();
};
