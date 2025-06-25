// orderController.ts
import { Request, Response } from "express";
import { GET_DB } from "../config/mongoDB";
import {
  getAllOrders,
  getOrderByCode,
  updateOrderStatus as updateOrderStatusInModel,
} from "../models/orderModel";
import {
  checkDuplicateOrder,
  createOrder,
  getUserOrderHistoryService,
} from "../services/orderService";

/**
 * Controller: Tạo mới đơn hàng (guest/user)
 * - Validate và sanitize đã được middleware xử lý trước
 * - Kiểm tra duplicate order
 * - Gọi service để tạo đơn hàng
 * - Trả về kết quả cho client
 */
export const createOrderController = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    // Lấy thông tin user (nếu có)
    const role = (req as any).user?.role || data.role;
    const createdBy = (req as any).user?.username || data.createdBy;

    if (!createdBy || !role) {
      return res.status(401).json({ error: "Không xác thực được người dùng" });
    }

    // Kiểm tra duplicate order (5 phút)
    const isDuplicate = await checkDuplicateOrder(
      data.buyer.email,
      data.buyer.phone,
      data.products.map((p: any) => ({ pid: p.pid, quantity: p.quantity })),
      5 * 60 * 1000
    );
    if (isDuplicate) {
      return res.status(400).json({
        error: "Bạn đã có đơn hàng tương tự gần đây. Vui lòng chờ xử lý.",
      });
    }

    // Gọi service để tạo đơn hàng
    const order = await createOrder({
      ...data,
      role,
      createdBy,
    });

    return res.status(201).json({
      message: "✅ Đơn hàng đã được tạo và lưu vào hệ thống",
      order,
    });
  } catch (err) {
    return res.status(500).json({ error: "Lỗi khi tạo đơn hàng" });
  }
};

/**
 * Controller: Lấy lịch sử đơn hàng của user hiện tại
 * - Chỉ cho phép user đã đăng nhập và có quyền viewOwnOrders
 * - Gọi service để lấy và sắp xếp đơn hàng
 */
export const getUserOrderHistoryController = async (
  req: Request,
  res: Response
) => {
  const username = (req as any).user?.username;
  if (!username) return res.status(401).json({ error: "Chưa đăng nhập" });

  try {
    const orders = await getUserOrderHistoryService(username);
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: "Không thể lấy đơn hàng" });
  }
};

//Gộp controller xuất ra 1 object
export const orderController = {
  createOrderController,
  getUserOrderHistoryController,
};
