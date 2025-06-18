import express from "express";
import { submissionController } from "../../controllers/submissionController";
import { verifyToken } from "../../middlewares/authMiddleware";
import {
  checkTrialChapter,
  checkTrialMode,
} from "../../middlewares/trialMiddleware";
import { requirePermission } from "../../middlewares/permissionMiddleware";

const Router = express.Router();

Router.post(
  "/submit",
  verifyToken,
  checkTrialMode,
  checkTrialChapter,
  requirePermission("submitQuest"),
  submissionController.submitCode
);

export const submissionRoute = Router;
