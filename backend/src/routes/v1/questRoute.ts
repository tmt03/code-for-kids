import express from "express";
import { questController } from "../../controllers/questController";
import { verifyToken } from "../../middlewares/authMiddleware";
import { requirePermission } from "../../middlewares/permissionMiddleware";
import {
  checkTrialMode,
  checkTrialChapter,
} from "../../middlewares/trialMiddleware"; // Thêm dòng này

const Router = express.Router();

Router.get(
  "/:questId",
  verifyToken,
  checkTrialMode,
  checkTrialChapter,
  requirePermission("viewQuestDetails"), // 🎯 giống chapter, chỉ cần xem nhiệm vụ
  questController.getQuestDetails
);

export const questRoute = Router;
