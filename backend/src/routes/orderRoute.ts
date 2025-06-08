// routes/orderRoutes.ts
import express from "express";
import { verifyToken } from "../middlewares/authMiddleware";
import { requirePermission } from "../middlewares/permissionMiddleware";
import { orderController } from "../controllers/orderController";
import { OrderData } from "../models/orderModel"; // Giả sử bạn có model này
import OrderModel from "../models/orderModel"; // Mongoose Model


const router = express.Router();

// ✅ 1. User gửi đơn hàng (cần xác thực và phân quyền)
router.post("/", verifyToken, requirePermission("placeOrder"), orderController.createUserOrder);

// ✅ 2. Guest gửi đơn hàng (chưa lưu DB, ghi file JSON)
router.post("/create", orderController.createOrderPending);

// ✅ 3. Admin duyệt đơn
router.post("/approve/:orderCode", verifyToken, requirePermission("manageOrders"), orderController.approveOrder);

// ✅ 4. Admin từ chối đơn
router.delete("/reject/:orderCode", verifyToken, requirePermission("manageOrders"), orderController.rejectOrder);

router.get("/guest-lookup", orderController.lookupGuestOrders);
router.get("/all", verifyToken, requirePermission("manageOrders"), orderController.listOrders);
router.get("/detail/:orderCode", verifyToken, requirePermission("manageOrders"), orderController.getOrderDetails);

export default router;