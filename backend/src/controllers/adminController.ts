// backend/src/controllers/adminController.ts
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { userModel } from "../models/userModel";
import {
  activateUserService,
  banUserService,
  deactivateUserService,
  getAllUsersService,
  unbanUserService,
  updateUserService,
} from "../services/adminService";
import {
  getOrderStatusCounts,
  getOrdersWithFilter,
  updateOrderStatus,
} from "../services/orderService";

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

/** Lấy danh sách user */
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsersService();
    // Map status cho frontend
    const mapped = users.map((u: any) => ({
      username: u.username,
      displayName: u.displayName,
      email: u.email,
      role: u.role,
      avatarUrl: u.avatarUrl,
      createdAt: u.created_at,
      isActivated: u.isActivated,
      _destroy: u._destroy,
      status: u._destroy
        ? "suspended"
        : u.role === "premium"
        ? "premium"
        : u.isActivated
        ? "active"
        : "inactive",
    }));
    res.status(StatusCodes.OK).json({ users: mapped });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Lỗi khi lấy danh sách user" });
  }
};

/** Ban user */
export const banUser = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    await banUserService(username);
    res
      .status(StatusCodes.OK)
      .json({ message: "Đã khóa tài khoản thành công" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Lỗi khi khóa tài khoản" });
  }
};

/** Mở khóa user */
export const activateUser = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    await activateUserService(username);
    res
      .status(StatusCodes.OK)
      .json({ message: "Đã mở khóa tài khoản thành công" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Lỗi khi mở khóa tài khoản" });
  }
};

/** Mở ban user */
export const unbanUser = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    await unbanUserService(username);
    res
      .status(StatusCodes.OK)
      .json({ message: "Đã mở ban tài khoản thành công" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Lỗi khi mở ban tài khoản" });
  }
};

/** Update user info */
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const updateData = req.body;
    await updateUserService(username, updateData);
    res
      .status(StatusCodes.OK)
      .json({ message: "Cập nhật tài khoản thành công" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Lỗi khi cập nhật tài khoản" });
  }
};

/** Hủy kích hoạt khóa học */
export const deactivateUser = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    await deactivateUserService(username);
    res
      .status(StatusCodes.OK)
      .json({ message: "Đã hủy kích hoạt khóa học thành công" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Lỗi khi hủy kích hoạt khóa học" });
  }
};

export const adminController = {
  activateUser,
  deactivateUser,
  getTrialUsers,
  getAdminOrderList,
  updateOrderStatusByAdmin,
  getOrderStats,
  banUser,
  unbanUser,
  updateUser,
  getAllUsers,
};
