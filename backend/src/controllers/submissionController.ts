//Chuyên xử lý việc nộp code và chấm điểm:
// Nhận code

// Gửi sang CodeCheckerService để đánh giá

// Dùng ScoreService để tính điểm

// Gọi ProgressService để đánh dấu hoàn thành quest nếu đủ điểm

import { NextFunction, Request, Response } from "express";
import { codeCheckService } from "../services/codeCheckService";

const submitCode = async (req: Request, res: Response, next: NextFunction) => {
  console.log("\n=== YÊU CẦU SUBMIT CODE ĐÃ ĐẾN CONTROLLER ===");
  console.log("Body của yêu cầu:", req.body);

  const { code } = req.body;

  try {
    const result = await codeCheckService.logicCheck(code);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const submissionController = {
  submitCode,
};
