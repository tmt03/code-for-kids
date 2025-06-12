// routes/orderRoutes.ts
import express from "express";
import { verifyToken } from "../middlewares/authMiddleware";
import { requirePermission } from "../middlewares/permissionMiddleware";
import { orderController } from "../controllers/orderController";
const router = express.Router();

//1. User gửi đơn hàng (cần xác thực và phân quyền)
router.post("/", verifyToken, requirePermission("placeOrder"), orderController.createUserOrder);

//2. Guest gửi đơn hàng (chưa lưu DB, ghi file JSON)
router.post("/create", orderController.createOrderPending);

//3. Admin xem tất cả đơn hàng bao gồm đơn đang chờ duyệt
router.get("/", verifyToken, requirePermission("manageOrders"), orderController.listAllOrdersIncludingPending);

//3. Admin duyệt đơn
router.post("/approve/:orderCode", verifyToken, requirePermission("manageOrders"), orderController.approveOrder);

//4. Admin từ chối đơn
router.delete("/reject/:orderCode", verifyToken, requirePermission("manageOrders"), orderController.rejectOrder);

//5. Guest tra cứu đơn hàng
router.get("/guest-lookup", orderController.lookupGuestOrders);

//6. Admin xem tất cả đơn hàng
router.get("/all", verifyToken, requirePermission("manageOrders"), orderController.listOrders);

//7. Admin xem chi tiết đơn hàng
router.get("/detail/:orderCode", verifyToken, requirePermission("manageOrders"), orderController.getOrderDetails);

//8. Admin xem danh sách đơn hàng đang chờ duyệt
router.get(
    '/pending',
    verifyToken,
    requirePermission('manageOrders'),
    orderController.listPendingOrders
);
//9. Admin cập nhật trạng thái đơn hàng (ví dụ: đã giao, đang giao, hủy, v.v.)
router.put("/:orderCode/status", verifyToken, requirePermission("manageOrders"), orderController.updateOrderStatus);

export default router;
