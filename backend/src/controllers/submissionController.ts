//Chuyên xử lý việc nộp code và chấm điểm:
// Nhận code

// Gửi sang CodeCheckerService để đánh giá

// Dùng ScoreService để tính điểm

// Gọi ProgressService để đánh dấu hoàn thành quest nếu đủ điểm

import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { submissionServiceService } from "../services/submissionService";

const submitCode = async (req: Request, res: Response, next: NextFunction) => {
  const result = await submissionServiceService.submitCode();
};

export const submissionController = {
  submitCode,
};
