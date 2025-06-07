import fs from "fs/promises";
import path from "path";
import { OrderData } from "../models/orderModel";
import OrderModel from "../models/orderModel"; // Mongoose Model
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
// Đường dẫn tới file JSON lưu đơn hàng đang chờ duyệt
const pendingFile = path.resolve(__dirname, "../data/pendingOrders.json");

// Ghi đơn hàng mới vào file
export const createOrderPending = async (req: Request, res: Response) => {
    const data = req.body;

    const order: OrderData = {
        ...data,
        orderCode: "OD-" + uuidv4().slice(0, 8).toUpperCase(),
        createdAt: new Date(),
        status: "pending",
    };

    try {
        await fs.writeFile(pendingFile, JSON.stringify([order], null, 2));
        res.status(200).json({ message: "Đơn hàng mới đã gửi", order });
    } catch (err) {
        console.error("❌ Lỗi khi gửi đơn hàng:", err);
        res.status(500).json({ error: "Lỗi khi gửi đơn hàng" });
    }
};

// Phê duyệt đơn hàng (chuyển từ file JSON -> MongoDB)
export const approveOrder = async (req: Request, res: Response) => {
    const { orderCode } = req.params;

    const fileContent = await fs.readFile(pendingFile, "utf-8");
    let orders: OrderData[] = JSON.parse(fileContent || "[]");

    const index = orders.findIndex((o) => o.orderCode === orderCode);
    if (index === -1) {
        return res.status(404).json({ error: "Không tìm thấy đơn hàng" });
    }

    const approvedOrder = orders[index];
    approvedOrder.status = "approved";

    // Lưu vào MongoDB
    await OrderModel.create(approvedOrder);

    // Xóa khỏi file pending
    orders.splice(index, 1);
    await fs.writeFile(pendingFile, JSON.stringify(orders, null, 2));

    res.status(200).json({ message: "Đã duyệt và lưu đơn hàng", order: approvedOrder });
};

// Từ chối đơn hàng
export const rejectOrder = async (req: Request, res: Response) => {
    const { orderCode } = req.params;

    const fileContent = await fs.readFile(pendingFile, "utf-8");
    let orders: OrderData[] = JSON.parse(fileContent || "[]");

    const index = orders.findIndex((o) => o.orderCode === orderCode);
    if (index === -1) {
        return res.status(404).json({ error: "Không tìm thấy đơn hàng" });
    }

    orders.splice(index, 1);
    await fs.writeFile(pendingFile, JSON.stringify(orders, null, 2));

    res.status(200).json({ message: "Đã từ chối và xóa đơn hàng" });
};

/**
 * Tạo đơn hàng cho user
 */
export const createUserOrder = async (req: Request, res: Response) => {
    try {
        // Lấy thông tin từ token (do verifyToken gán vào req)
        const createdBy = (req as any).user?.username;
        const role = (req as any).user?.role;

        // Nếu thiếu user → chặn
        if (!createdBy || !role) {
            return res.status(401).json({ error: "Không xác thực được người dùng" });
        }

        // Lấy dữ liệu từ body
        const { products, total, buyer } = req.body;

        // Kiểm tra dữ liệu tối thiểu
        if (!products?.length || !buyer || typeof total !== "number") {
            return res.status(400).json({ error: "Thiếu thông tin đơn hàng" });
        }

        // Tạo đơn hàng
        const order = {
            orderCode: "OD-" + uuidv4().slice(0, 8).toUpperCase(),
            role,
            products,
            total,
            buyer,
            createdAt: new Date(),
            status: "pending",
            createdBy,
        };

        // Lưu MongoDB
        const saved = await OrderModel.create(order);

        res.status(201).json({
            message: "✅ Tạo đơn hàng thành công (đang chờ duyệt)",
            order: saved,
        });
    } catch (err) {
        console.error("❌ Lỗi khi tạo đơn hàng:", err);
        res.status(500).json({ error: "Lỗi tạo đơn hàng" });
    }
};

// Tìm đơn hàng của guest theo tên hoặc số điện thoại
export const lookupGuestOrders = async (req: Request, res: Response) => {
    try {
        const { phone, name } = req.query;

        if (!phone && !name) {
            return res.status(400).json({ error: "Thiếu thông tin tra cứu" });
        }

        const fileContent = await fs.readFile(pendingFile, "utf-8");
        const orders = JSON.parse(fileContent || "[]");

        const matched = orders.filter((order: any) => {
            return (
                order.role === "guest" &&
                ((name && order.buyer.name.toLowerCase().includes((name as string).toLowerCase())) ||
                    (phone && order.buyer.phone.includes(phone as string)))
            );
        });

        res.status(200).json(matched);
    } catch (err) {
        console.error("❌ Lỗi tra cứu đơn hàng:", err);
        res.status(500).json({ error: "Không thể tra cứu đơn hàng" });
    }
};

//API lấy danh sách đơn hàng
export const listOrders = async (req: Request, res: Response) => {
  try {
    const orders = await OrderModel.find().sort({ createdAt: -1 }); // lấy tất cả đơn hàng
    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách đơn hàng:", error);
    res.status(500).json({ error: "Không thể lấy danh sách đơn hàng" });
  }
};

//API lấy chi tiết đơn hàng theo mã
export const getOrderDetails = async (req: Request, res: Response) => {
    const { orderCode } = req.params;
    try {
        const order = await OrderModel.findOne({ orderCode });
        if (!order) return res.status(404).json({ error: "Không tìm thấy đơn hàng" });
        res.json(order);
    } catch (err) {
        console.error("❌ Lỗi khi lấy chi tiết đơn hàng:", err);
        res.status(500).json({ error: "Lỗi khi lấy chi tiết đơn hàng" });
    }
};

export const orderController = {
    createOrderPending,
    approveOrder,
    rejectOrder,
    createUserOrder,
    lookupGuestOrders,
    listOrders,
    getOrderDetails
};
