import express from "express";
import { chapterController } from "../../controllers/chapterController";
import { verifyToken } from "../../middlewares/authMiddleware";
import { requirePermission } from "../../middlewares/permissionMiddleware";

const Router = express.Router();
Router.get(
  "/",
  verifyToken,
  requirePermission("viewChapter"), // 🎯 user & admin đều có thể xem danh sách chapter
  chapterController.getAllChapters
);

export const chapterRoute = Router;
