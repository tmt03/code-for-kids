import express from "express";
import { submissionController } from "../../controllers/submissionController";
import { verifyToken } from "../../middlewares/authMiddleware";
import { requirePermission } from "../../middlewares/permissionMiddleware";
import { checkTrialMode } from "../../middlewares/trialMiddleware";

const Router = express.Router();

Router.post(
  "/submit",
  verifyToken,
  checkTrialMode,
  // checkTrialChapter,
  requirePermission("submitQuest"),
  submissionController.submitCode
);

export const submissionRoute = Router;
