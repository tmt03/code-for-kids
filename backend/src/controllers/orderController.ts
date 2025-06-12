// orderController.ts
import fs from "fs/promises";
import path from "path";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { OrderData, insertOrder, getAllOrders, getOrderByCode, updateOrderStatus as updateOrderStatusInModel } from "../models/orderModel";

const pendingFile = path.resolve(__dirname, "../data/pendingOrders.json");

//Guest gửi đơn hàng → ghi file JSON
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

//Admin duyệt đơn (từ file JSON → MongoDB)
export const approveOrder = async (req: Request, res: Response) => {
    const { orderCode } = req.params;

    try {
        const raw = await fs.readFile(pendingFile, "utf-8");
        let pendingOrders: OrderData[] = JSON.parse(raw || "[]");

        const index = pendingOrders.findIndex(o => o.orderCode === orderCode);
        if (index === -1) {
            return res.status(404).json({ error: "Không tìm thấy đơn hàng để duyệt" });
        }

        const approvedOrder = { ...pendingOrders[index], status: "approved" as "approved" };

        await insertOrder(approvedOrder); // Ghi vào MongoDB

        pendingOrders.splice(index, 1);
        await fs.writeFile(pendingFile, JSON.stringify(pendingOrders, null, 2));

        res.status(200).json({
            message: "✅ Đã duyệt đơn hàng và lưu vào hệ thống",
            order: approvedOrder,
            remainingPending: pendingOrders
        });
    } catch (err) {
        console.error("❌ Lỗi khi duyệt đơn:", err);
        res.status(500).json({ error: "Không thể duyệt đơn hàng" });
    }
};

//Admin từ chối đơn hàng
export const rejectOrder = async (req: Request, res: Response) => {
    const { orderCode } = req.params;

    try {
        const raw = await fs.readFile(pendingFile, "utf-8");
        let pendingOrders: OrderData[] = JSON.parse(raw || "[]");

        const index = pendingOrders.findIndex(o => o.orderCode === orderCode);
        if (index === -1) {
            return res.status(404).json({ error: "Không tìm thấy đơn hàng để từ chối" });
        }

        const rejectedOrder = pendingOrders[index];

        pendingOrders.splice(index, 1);
        await fs.writeFile(pendingFile, JSON.stringify(pendingOrders, null, 2));

        res.status(200).json({
            message: "❌ Đã từ chối đơn hàng",
            order: rejectedOrder,
            remainingPending: pendingOrders
        });
    } catch (err) {
        console.error("❌ Lỗi khi từ chối đơn hàng:", err);
        res.status(500).json({ error: "Không thể từ chối đơn hàng" });
    }
};


//User đã đăng nhập gửi đơn hàng → ghi file JSON
export const createUserOrder = async (req: Request, res: Response) => {
    try {
        const createdBy = (req as any).user?.username;
        const role = (req as any).user?.role;

        if (!createdBy || !role) {
            return res.status(401).json({ error: "Không xác thực được người dùng" });
        }

        const { products, total, buyer } = req.body;
        if (!products?.length || !buyer || typeof total !== "number") {
            return res.status(400).json({ error: "Thiếu thông tin đơn hàng" });
        }

        const order: OrderData = {
            orderCode: "OD-" + uuidv4().slice(0, 8).toUpperCase(),
            role,
            products,
            total,
            buyer,
            createdAt: new Date(),
            status: "pending",
            createdBy,
        };

        const raw = await fs.readFile(pendingFile, "utf-8");
        const pendingOrders: OrderData[] = JSON.parse(raw || "[]");

        pendingOrders.push(order);
        await fs.writeFile(pendingFile, JSON.stringify(pendingOrders, null, 2));

        res.status(201).json({
            message: "✅ Đơn hàng đang chờ duyệt đã được ghi",
            order,
        });
    } catch (err) {
        console.error("❌ Lỗi khi tạo đơn hàng:", err);
        res.status(500).json({ error: "Lỗi tạo đơn hàng" });
    }
};


//Guest tra cứu đơn hàng
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

//Admin: Lấy danh sách đơn hàng
export const listOrders = async (_req: Request, res: Response) => {
    try {
        const all = await getAllOrders();
        const processed = all.filter(order => order.status !== 'pending'); // ✅ lọc đúng
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
        if (!order) return res.status(404).json({ error: "Không tìm thấy đơn hàng" });
        res.json(order);
    } catch (err) {
        console.error("❌ Lỗi khi lấy chi tiết đơn hàng:", err);
        res.status(500).json({ error: "Lỗi khi lấy chi tiết đơn hàng" });
    }
};

// Admin: Lấy danh sách đơn hàng đang chờ duyệt
export const listPendingOrders = async (_req: Request, res: Response) => {
    try {
        const raw = await fs.readFile(pendingFile, 'utf-8');
        const pendingOrders: OrderData[] = JSON.parse(raw || '[]');
        res.status(200).json(pendingOrders);
    } catch (err) {
        console.error("❌ Lỗi khi đọc pending orders:", err);
        res.status(500).json({ error: "Không thể đọc danh sách pending orders" });
    }
};

// Gộp đơn pending từ file + đơn đã duyệt trong MongoDB
export const listAllOrdersIncludingPending = async (_req: Request, res: Response) => {
    try {
        const raw = await fs.readFile(pendingFile, "utf-8");
        const pending: OrderData[] = JSON.parse(raw || "[]");

        const approved = await getAllOrders(); // Lấy đơn từ MongoDB

        const combined = [...pending, ...approved];

        res.status(200).json(combined);
    } catch (err) {
        console.error("❌ Lỗi khi lấy toàn bộ đơn hàng:", err);
        res.status(500).json({ error: "Không thể lấy danh sách đơn hàng" });
    }
};

export const updateOrderStatusController = async (req: Request, res: Response) => {
    const { orderCode } = req.params;
    const { status } = req.body;

    if (!['approved', 'done', 'rejected'].includes(status)) {
        return res.status(400).json({ error: "Trạng thái không hợp lệ" });
    }

    try {
        await updateOrderStatusInModel(orderCode, status); // ⬅ hàm bạn đã có sẵn trong orderModel
        res.status(200).json({ message: "Đã cập nhật trạng thái" });
    } catch (err) {
        console.error("❌ Lỗi cập nhật trạng thái:", err);
        res.status(500).json({ error: "Lỗi cập nhật trạng thái" });
    }
};

//Gộp controller xuất ra 1 object
export const orderController = {
    createOrderPending,
    approveOrder,
    rejectOrder,
    createUserOrder,
    lookupGuestOrders,
    listOrders,
    getOrderDetails,
    listPendingOrders,
    listAllOrdersIncludingPending,
    updateOrderStatus: updateOrderStatusController
};
