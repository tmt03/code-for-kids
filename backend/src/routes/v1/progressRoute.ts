import express from "express";
import { progressController } from "../../controllers/progressController";
import { verifyToken } from "../../middlewares/authMiddleware";
import { requirePermission } from "../../middlewares/permissionMiddleware";
import {
  blockTrialMode,
  checkTrialMode,
  checkTrialChapter,
} from "../../middlewares/trialMiddleware";

const Router = express.Router();

Router.post(
  "/init",
  verifyToken,
  checkTrialMode,
  blockTrialMode,
  requirePermission("initUserProgress"),
  progressController.initUserProgress
);

Router.get(
  "/learn-progress",
  verifyToken,
  checkTrialMode,
  blockTrialMode,
  requirePermission("viewLearnProgress"),
  progressController.getLearnProgress
);

export const progressRoute = Router;
