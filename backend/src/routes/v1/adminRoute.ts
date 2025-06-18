// backend/src/routes/v1/adminRoute.ts - tạo mới
import express from "express";
import { adminController } from "../../controllers/adminController";
import { verifyToken } from "../../middlewares/authMiddleware";
import { requirePermission } from "../../middlewares/permissionMiddleware";

const Router = express.Router();

Router.post(
  "/activate-user/:username",
  verifyToken,
  requirePermission("manageUsers"),
  adminController.activateUser
);

Router.get(
  "/trial-users",
  verifyToken,
  requirePermission("manageUsers"),
  adminController.getTrialUsers
);

export const adminRoute = Router;
