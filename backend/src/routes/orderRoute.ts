// routes/orderRoutes.ts
import express from "express";
import { orderController } from "../controllers/orderController";
import { verifyToken } from "../middlewares/authMiddleware";
import {
  checkDuplicateOrder,
  validateOrderData,
} from "../middlewares/orderValidationMiddleware";
import { requirePermission } from "../middlewares/permissionMiddleware";
import { orderRateLimit } from "../middlewares/rateLimitMiddleware";
import { OrderCleanupService } from "../services/orderCleanupService";

const router = express.Router();

//3. Admin xem tất cả đơn hàng bao gồm đơn đang chờ duyệt
router.get(
  "/",
  verifyToken,
  requirePermission("manageOrders"),
  orderController.listAllOrdersIncludingPending
);

//4. Admin duyệt đơn
router.post(
  "/approve/:orderCode",
  verifyToken,
  requirePermission("manageOrders"),
  orderController.approveOrder
);

//5. Admin từ chối đơn
router.delete(
  "/reject/:orderCode",
  verifyToken,
  requirePermission("manageOrders"),
  orderController.rejectOrder
);

//7. Admin xem tất cả đơn hàng
router.get(
  "/all",
  verifyToken,
  requirePermission("manageOrders"),
  orderController.listOrders
);

//8. Admin xem chi tiết đơn hàng
router.get(
  "/detail/:orderCode",
  verifyToken,
  requirePermission("manageOrders"),
  orderController.getOrderDetails
);

//9. Admin xem danh sách đơn hàng đang chờ duyệt
router.get(
  "/pending",
  verifyToken,
  requirePermission("manageOrders"),
  orderController.listPendingOrders
);

//10. Admin cập nhật trạng thái đơn hàng (ví dụ: đã giao, đang giao, hủy, v.v.)
router.put(
  "/:orderCode/status",
  verifyToken,
  requirePermission("manageOrders"),
  orderController.updateOrderStatus
);

//13. Test endpoint để chạy cleanup ngay lập tức (chỉ dành cho admin)
router.post(
  "/test-cleanup",
  verifyToken,
  requirePermission("manageOrders"),
  async (req, res) => {
    try {
      const cleanupService = OrderCleanupService.getInstance();
      await cleanupService.runCleanupNow();
      res.status(200).json({ message: "✅ Cleanup đã được chạy thành công" });
    } catch (error) {
      console.error("❌ Lỗi khi chạy cleanup:", error);
      res.status(500).json({ error: "Lỗi khi chạy cleanup" });
    }
  }
);

export default router;
