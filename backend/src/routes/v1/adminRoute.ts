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

Router.get(
  "/order-list",
  verifyToken,
  requirePermission("manageOrders"),
  adminController.getAdminOrderList
);

// Route để cập nhật trạng thái đơn hàng
Router.patch(
  "/orders/:orderCode/status",
  verifyToken,
  requirePermission("manageOrders"),
  adminController.updateOrderStatusByAdmin
);

// Route để lấy thống kê trạng thái đơn hàng
Router.get(
  "/orders/stats",
  verifyToken,
  requirePermission("manageOrders"),
  adminController.getOrderStats
);

// Ban user
Router.patch(
  "/ban-user/:username",
  verifyToken,
  requirePermission("manageUsers"),
  adminController.banUser
);

// Update user
Router.patch(
  "/update-user/:username",
  verifyToken,
  requirePermission("manageUsers"),
  adminController.updateUser
);

Router.get(
  "/users",
  verifyToken,
  requirePermission("manageUsers"),
  adminController.getAllUsers
);

// Mở ban user
Router.patch(
  "/unban-user/:username",
  verifyToken,
  requirePermission("manageUsers"),
  adminController.unbanUser
);

// Hủy kích hoạt khóa học
Router.post(
  "/deactivate-user/:username",
  verifyToken,
  requirePermission("manageUsers"),
  adminController.deactivateUser
);

export const adminRoute = Router;
