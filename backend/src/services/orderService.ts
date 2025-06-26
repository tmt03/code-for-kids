import { v4 as uuidv4 } from "uuid";
import { GET_DB } from "../config/mongoDB";
import { OrderData, orderModel } from "../models/orderModel";

/**
 * Kiểm tra đơn hàng trùng lặp trong khoảng thời gian nhất định (mặc định 5 phút)
 * @param email Email người mua
 * @param phone Số điện thoại người mua
 * @param products Danh sách sản phẩm
 * @param windowMs Khoảng thời gian kiểm tra (ms)
 * @returns true nếu có đơn trùng, false nếu không
 */
export const checkDuplicateOrder = async (
  email: string,
  phone: string,
  products: { pid: string; quantity: number }[],
  windowMs: number = 5 * 60 * 1000
): Promise<boolean> => {
  const db = GET_DB();
  const collection = db.collection("orders");
  const since = new Date(Date.now() - windowMs);
  // Tìm đơn hàng cùng email, phone, sản phẩm, trong windowMs gần đây
  const duplicate = await collection.findOne({
    "buyer.email": email,
    "buyer.phone": phone,
    createdAt: { $gte: since },
    status: { $in: ["pending", "approved"] },
    products: {
      $all: products.map((p) => ({
        $elemMatch: { pid: p.pid, quantity: p.quantity },
      })),
    },
  });
  return !!duplicate;
};

/**
 * Tạo mới một đơn hàng
 * @param data Dữ liệu đơn hàng đã validate
 * @returns Đơn hàng đã tạo
 */
export const createOrder = async (
  data: Omit<OrderData, "orderCode" | "createdAt" | "status">
): Promise<OrderData> => {
  const db = GET_DB();
  const collection = db.collection("orders");
  const order: OrderData = {
    ...data,
    orderCode: "OD-" + uuidv4().slice(0, 8).toUpperCase(),
    createdAt: new Date(),
    status: "pending",
  };
  await collection.insertOne(order);
  return order;
};

/**
 * Lấy danh sách đơn hàng theo filter (không phân trang)
 */
export const getOrdersWithFilter = async (params: {
  status?: string;
  search?: string;
}) => {
  return await orderModel.getAll(params);
};

/**
 * Lấy lịch sử đơn hàng của user, sắp xếp theo đơn mới nhất lên đầu
 * @param username Tên đăng nhập của user
 * @returns Danh sách đơn hàng đã sắp xếp
 */
export const getUserOrderHistoryService = async (username: string) => {
  // Lấy tất cả đơn hàng của user
  const orders = await orderModel.getOrdersByUsername(username);

  // Logic nghiệp vụ: sắp xếp theo đơn mới nhất lên đầu
  return orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

/**
 * Service: Cập nhật trạng thái đơn hàng.
 * @param orderCode Mã đơn hàng
 * @param status Trạng thái mới
 * @returns Đơn hàng đã được cập nhật
 */
export const updateOrderStatus = async (orderCode: string, status: string) => {
  // Logic nghiệp vụ có thể thêm ở đây. Ví dụ:
  const validStatuses = ["pending", "approved", "rejected", "done"];
  if (!validStatuses.includes(status)) {
    throw new Error("Trạng thái không hợp lệ.");
  }

  const updatedOrder = await orderModel.updateStatus(
    orderCode,
    status as OrderData["status"]
  );

  if (!updatedOrder) {
    throw new Error("Không tìm thấy đơn hàng để cập nhật.");
  }
  // Logic khác: Gửi email cho khách hàng khi đơn hàng được duyệt, v.v.
  return updatedOrder;
};

/**
 * Service: Lấy thống kê số lượng đơn hàng theo trạng thái.
 */
export const getOrderStatusCounts = async () => {
  return await orderModel.getStatusCounts();
};
