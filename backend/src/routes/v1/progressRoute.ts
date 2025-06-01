import express from "express";
import { progressController } from "../../controllers/progressController";
import { verifyToken } from "../../middlewares/authMiddleware";
import { requirePermission } from "../../middlewares/permissionMiddleware";

const Router = express.Router();

Router.post(
  "/init",
  verifyToken,
  requirePermission("initUserProgress"),
  progressController.initUserProgress
);

export const progressRoute = Router;
