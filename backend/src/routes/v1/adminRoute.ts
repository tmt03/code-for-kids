// backend/src/routes/v1/adminRoute.ts - tạo mới
import express from "express";
import { adminController } from "../../controllers/adminController";
import { verifyToken } from "../../middlewares/authMiddleware";
import { requirePermission } from "../../middlewares/permissionMiddleware";
import { orderController } from "../../controllers/orderController";

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

export const adminRoute = Router;
