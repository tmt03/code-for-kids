import express from "express";
import { questController } from "../../controllers/questController";
import { verifyToken } from "../../middlewares/authMiddleware";
import { requirePermission } from "../../middlewares/permissionMiddleware";

const Router = express.Router();

Router.get(
  "/:questId",
  verifyToken,
  requirePermission("viewQuestDetails"), // 🎯 giống chapter, chỉ cần xem nhiệm vụ
  questController.getQuestDetails
);

Router.put(
  "/:questId/video-url",
  verifyToken,
  requirePermission("updateQuestVideoUrl"), // 🎯 giống chapter, chỉ cần cập nhật videoUrl
  questController.updateQuestVideoUrl
);

export const questRoute = Router;
