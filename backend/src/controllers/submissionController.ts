//Chuyên xử lý việc nộp code và chấm điểm:
// Nhận code

// Gửi sang CodeCheckerService để đánh giá

// Dùng ScoreService để tính điểm

// Gọi ProgressService để đánh dấu hoàn thành quest nếu đủ điểm

import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { submissionServiceService } from "../services/submissionService";

const submitCode = async (req: Request, res: Response, next: NextFunction) => {
  const { userCode } = req.body;

  console.log(1);
  console.log(userCode);

  // 2. Kiểm tra dữ liệu đầu vào
  if (!userCode) {
    return res.status(400).json({
      passed: false,
      error: "Thiếu code!",
      hint: "Hãy đảm bảo bạn đã chọn quest và nhập code nhé! 📝",
    });
  }

  const result = await submissionServiceService.submitCode(userCode);
  res.status(StatusCodes.OK).json(result);
};

export const submissionController = {
  submitCode,
};
