// orderModel.ts
import { ObjectId } from "mongodb";
import { GET_DB } from "../config/mongoDB";

export interface OrderData {
  _id?: ObjectId; // MongoDB documents sẽ có _id
  orderCode: string;
  role: "user";
  products: {
    pid: string;
    pname: string;
    pprice: number;
    quantity: number;
  }[];
  total: number;
  buyer: {
    name: string;
    phone: string;
    email: string;
    address: string;
    note?: string;
  };
  createdAt: Date;
  status: "pending" | "approved" | "rejected" | "done";
  createdBy: string;
}

//Collection name
const COLLECTION_NAME = "orders";

//Insert new order
const insertOrder = async (order: OrderData) => {
  const db = GET_DB();
  const collection = db.collection<OrderData>(COLLECTION_NAME);
  await collection.insertOne(order);
};

//Get order by code
const getOrderByCode = async (orderCode: string) => {
  const db = GET_DB();
  const collection = db.collection<OrderData>(COLLECTION_NAME);
  return await collection.findOne({ orderCode });
};

//Get all orders by username
const getOrdersByUsername = async (username: string) => {
  const db = GET_DB();
  const collection = db.collection<OrderData>(COLLECTION_NAME);
  return await collection.find({ createdBy: username }).toArray();
};

/**
 * Cập nhật trạng thái của một đơn hàng.
 * @param orderCode Mã đơn hàng
 * @param status Trạng thái mới
 * @returns Đơn hàng sau khi đã cập nhật, hoặc null nếu không tìm thấy.
 */
const updateStatus = async (orderCode: string, status: OrderData["status"]) => {
  const db = GET_DB();
  const collection = db.collection<OrderData>(COLLECTION_NAME);

  const result = await collection.findOneAndUpdate(
    { orderCode: orderCode },
    { $set: { status: status, updatedAt: new Date() } },
    { returnDocument: "after" } // Trả về document sau khi đã update
  );

  return result;
};

/**
 * Lấy danh sách đơn hàng theo filter (status, search)
 */
const getAll = async ({
  status,
  search,
}: {
  status?: string;
  search?: string;
}) => {
  const db = GET_DB();
  const collection = db.collection<OrderData>(COLLECTION_NAME);

  const filter: any = {};
  if (status) filter.status = status;
  if (search) filter.orderCode = { $regex: search, $options: "i" };

  const orders = await collection
    .find(filter)
    .sort({ createdAt: -1 })
    .toArray();

  return orders;
};

/**
 * Lấy số lượng đơn hàng theo từng trạng thái.
 * @returns Object chứa số lượng của mỗi trạng thái.
 */
const getStatusCounts = async () => {
  const db = GET_DB();
  const collection = db.collection<OrderData>(COLLECTION_NAME);

  // Dùng pipeline của MongoDB để nhóm theo status và đếm
  const statsPipeline = [{ $group: { _id: "$status", count: { $sum: 1 } } }];
  const result = await collection.aggregate(statsPipeline).toArray();

  // Chuyển kết quả từ mảng [{_id: 'pending', count: 10}] thành object {pending: 10}
  const counts = { pending: 0, approved: 0, rejected: 0, done: 0 };
  result.forEach((item) => {
    // Đảm bảo chỉ gán cho các key hợp lệ đã định nghĩa trong `counts`
    if (Object.prototype.hasOwnProperty.call(counts, item._id)) {
      (counts as any)[item._id] = item.count;
    }
  });

  return counts;
};

export const orderModel = {
  getAll,
  updateStatus,
  getOrdersByUsername,
  getOrderByCode,
  insertOrder,
  getStatusCounts,
};
