// backend/src/controllers/adminController.ts
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { userModel } from "../models/userModel";
import {
  getOrderStatusCounts,
  getOrdersWithFilter,
  updateOrderStatus,
} from "../services/orderService";

// Kích hoạt tài khoản user
const activateUser = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Thiếu username",
      });
    }

    const result = await userModel.activateUser(username);

    if (result.matchedCount === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Không tìm thấy người dùng",
      });
    }

    return res.status(StatusCodes.OK).json({
      message: "Kích hoạt tài khoản thành công",
      username,
    });
  } catch (error: any) {
    console.error("Lỗi kích hoạt user:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Lỗi hệ thống",
    });
  }
};

// Lấy danh sách trial users
const getTrialUsers = async (req: Request, res: Response) => {
  try {
    const trialUsers = await userModel.getTrialUsers();

    return res.status(StatusCodes.OK).json({
      trialUsers,
      total: trialUsers.length,
    });
  } catch (error: any) {
    console.error("Lỗi lấy trial users:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Lỗi hệ thống",
    });
  }
};

/**
 * Controller: Lấy danh sách đơn hàng cho admin (có filter, search)
 */
const getAdminOrderList = async (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;
    const orders = await getOrdersWithFilter({
      status: status as string,
      search: search as string,
    });
    res.status(StatusCodes.OK).json({ orders });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Không thể lấy danh sách đơn hàng" });
  }
};

/**
 * Controller: Cập nhật trạng thái một đơn hàng bởi admin.
 */
const updateOrderStatusByAdmin = async (req: Request, res: Response) => {
  try {
    const { orderCode } = req.params;
    const { status } = req.body;

    if (!status) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Trạng thái mới là bắt buộc." });
    }

    const updatedOrder = await updateOrderStatus(orderCode, status);

    res.status(StatusCodes.OK).json({
      message: "Cập nhật trạng thái đơn hàng thành công.",
      order: updatedOrder,
    });
  } catch (error: any) {
    if (error.message.includes("Không tìm thấy")) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: error.message });
    }
    if (error.message.includes("không hợp lệ")) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Lỗi khi cập nhật trạng thái đơn hàng." });
  }
};

/**
 * Controller: Lấy thống kê số lượng đơn hàng theo trạng thái.
 */
const getOrderStats = async (req: Request, res: Response) => {
  try {
    const counts = await getOrderStatusCounts();
    res.status(StatusCodes.OK).json(counts);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Lỗi khi lấy thống kê đơn hàng." });
  }
};

export const adminController = {
  activateUser,
  getTrialUsers,
  getAdminOrderList,
  updateOrderStatusByAdmin,
  getOrderStats,
};
