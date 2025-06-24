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

//Admin duyệt đơn (cập nhật trạng thái trong MongoDB)
export const approveOrder = async (req: Request, res: Response) => {
  const { orderCode } = req.params;

  try {
    const db = GET_DB();
    const collection = db.collection("orders");

    // Tìm đơn hàng trong MongoDB
    const order = await collection.findOne({ orderCode });

    if (!order) {
      return res
        .status(404)
        .json({ error: "Không tìm thấy đơn hàng để duyệt" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({ error: "Đơn hàng này không thể duyệt" });
    }

    // Cập nhật trạng thái thành approved
    await updateOrderStatusInModel(orderCode, "approved");

    const updatedOrder = await collection.findOne({ orderCode });

    res.status(200).json({
      message: "✅ Đã duyệt đơn hàng thành công",
      order: updatedOrder,
    });
  } catch (err) {
    res.status(500).json({ error: "Không thể duyệt đơn hàng" });
  }
};

//Admin từ chối đơn hàng
export const rejectOrder = async (req: Request, res: Response) => {
  const { orderCode } = req.params;

  try {
    const db = GET_DB();
    const collection = db.collection("orders");

    // Tìm đơn hàng trong MongoDB
    const order = await collection.findOne({ orderCode });

    if (!order) {
      return res
        .status(404)
        .json({ error: "Không tìm thấy đơn hàng để từ chối" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({ error: "Đơn hàng này không thể từ chối" });
    }

    // Cập nhật trạng thái thành rejected
    await updateOrderStatusInModel(orderCode, "rejected");

    res.status(200).json({
      message: "❌ Đã từ chối đơn hàng",
      order,
    });
  } catch (err) {
    console.error("❌ Lỗi khi từ chối đơn hàng:", err);
    res.status(500).json({ error: "Không thể từ chối đơn hàng" });
  }
};

//Admin: Lấy danh sách đơn hàng
export const listOrders = async (_req: Request, res: Response) => {
  try {
    const all = await getAllOrders();
    const processed = all.filter((order) => order.status !== "pending");
    res.status(200).json(processed);
  } catch (err) {
    console.error("❌ Lỗi lấy đơn hàng đã xử lý:", err);
    res.status(500).json({ error: "Không thể lấy đơn hàng" });
  }
};

//Admin: Lấy chi tiết đơn hàng
export const getOrderDetails = async (req: Request, res: Response) => {
  const { orderCode } = req.params;
  try {
    const order = await getOrderByCode(orderCode);
    if (!order)
      return res.status(404).json({ error: "Không tìm thấy đơn hàng" });
    res.json(order);
  } catch (err) {
    console.error("❌ Lỗi khi lấy chi tiết đơn hàng:", err);
    res.status(500).json({ error: "Lỗi khi lấy chi tiết đơn hàng" });
  }
};

// Admin: Lấy danh sách đơn hàng đang chờ duyệt
export const listPendingOrders = async (_req: Request, res: Response) => {
  try {
    const db = GET_DB();
    const collection = db.collection("orders");
    const pendingOrders = await collection
      .find({ status: "pending" })
      .toArray();
    res.status(200).json(pendingOrders);
  } catch (err) {
    console.error("❌ Lỗi khi đọc pending orders:", err);
    res.status(500).json({ error: "Không thể đọc danh sách pending orders" });
  }
};

// Gộp đơn pending từ file + đơn đã duyệt trong MongoDB
export const listAllOrdersIncludingPending = async (
  _req: Request,
  res: Response
) => {
  try {
    const db = GET_DB();
    const collection = db.collection("orders");

    const pendingOrders = await collection
      .find({ status: "pending" })
      .toArray();
    const approvedOrders = await collection
      .find({ status: { $ne: "pending" } })
      .toArray();

    const combined = [...pendingOrders, ...approvedOrders];

    res.status(200).json(combined);
  } catch (err) {
    console.error("❌ Lỗi khi lấy toàn bộ đơn hàng:", err);
    res.status(500).json({ error: "Không thể lấy danh sách đơn hàng" });
  }
};

export const updateOrderStatusController = async (
  req: Request,
  res: Response
) => {
  const { orderCode } = req.params;
  const { status } = req.body;

  if (!["approved", "done", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Trạng thái không hợp lệ" });
  }

  try {
    const db = GET_DB();
    const collection = db.collection("orders");
    await collection.updateOne({ orderCode }, { $set: { status } });
    res.status(200).json({ message: "Đã cập nhật trạng thái" });
  } catch (err) {
    console.error("❌ Lỗi cập nhật trạng thái:", err);
    res.status(500).json({ error: "Lỗi cập nhật trạng thái" });
  }
};

export const getFullUserOrderHistory = async (req: Request, res: Response) => {
  const username = (req as any).user?.username;

  if (!username) return res.status(401).json({ error: "Chưa đăng nhập" });

  try {
    const db = GET_DB();
    const collection = db.collection("orders");

    const pendingOrders = await collection
      .find({ createdBy: username, status: "pending" })
      .toArray();
    const approvedOrders = await collection
      .find({ createdBy: username, status: { $ne: "pending" } })
      .toArray();

    const fullOrders = [...pendingOrders, ...approvedOrders];

    res.status(200).json(fullOrders);
  } catch (err) {
    console.error("❌ Lỗi lấy full đơn hàng của user:", err);
    res.status(500).json({ error: "Không thể lấy đơn hàng" });
  }
};

//Gộp controller xuất ra 1 object
export const orderController = {
  createOrderController,
  approveOrder,
  rejectOrder,
  listOrders,
  getOrderDetails,
  listPendingOrders,
  listAllOrdersIncludingPending,
  updateOrderStatus: updateOrderStatusController,
  getFullUserOrderHistory,
  getUserOrderHistoryController,
};
