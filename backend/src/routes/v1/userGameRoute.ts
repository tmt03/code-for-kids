import express from "express";
import { gameController } from "../../controllers/gameController";
import { verifyToken } from "../../middlewares/authMiddleware";
import { requirePermission } from "../../middlewares/permissionMiddleware";
import { validateSaveGame } from "../../middlewares/validateRequest";
import {
  blockTrialMode,
  checkTrialMode,
} from "../../middlewares/trialMiddleware";

const Router = express.Router();
Router.post(
  "/save-game",
  verifyToken,
  checkTrialMode,
  blockTrialMode,
  requirePermission("userGame"),
  validateSaveGame, // 🎯 user & admin đều có thể xem danh sách chapter
  gameController.saveGame
);

Router.get("/shared-game/:slug", gameController.getSharedGame);

Router.get(
  "/my-shared-games",
  verifyToken,
  requirePermission("userGame"),
  gameController.getMySharedGames
);

export const userGameRoute = Router;
