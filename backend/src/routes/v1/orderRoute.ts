// routes/orderRoute.ts
import express from "express";
import { orderController } from "../../controllers/orderController";
import { verifyToken } from "../../middlewares/authMiddleware";
import {
  checkDuplicateOrder,
  validateOrderData,
} from "../../middlewares/orderValidationMiddleware";
import { requirePermission } from "../../middlewares/permissionMiddleware";
import { orderRateLimit } from "../../middlewares/rateLimitMiddleware";

const Router = express.Router();

/**
 * Tạo mới đơn hàng (user)
 * - User xác thực và phân quyền
 * - Đều áp dụng rate limit, validate, check duplicate
 */
Router.post(
  "/create",
  verifyToken,
  requirePermission("placeOrder"),
  orderRateLimit,
  validateOrderData,
  checkDuplicateOrder,
  orderController.createOrderController
);

/**
 * Lấy lịch sử đơn hàng của user hiện tại
 * - Chỉ cho phép user đã đăng nhập
 * - Cần có quyền "viewOwnOrders"
 * - Trả về danh sách đơn hàng sắp xếp theo thời gian mới nhất
 */
Router.get(
  "/user-order-history",
  verifyToken,
  requirePermission("viewOwnOrders"),
  orderController.getUserOrderHistoryController
);

export const orderRoute = Router;
