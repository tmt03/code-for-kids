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

export const questRoute = Router;
