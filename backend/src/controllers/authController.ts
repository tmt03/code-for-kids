import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { authService } from "../services/authService";
import jwt from "jsonwebtoken";

const getUserInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const username = req.params.username;
    const result = await authService.getUserInfo(username);

    if (!result) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
    }

    // Xóa trường password hoặc password_hash
    const { password_hash, ...safeUser } = result;

    res.status(StatusCodes.OK).json(safeUser);
  } catch (error: any) {
    next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Username and password are required"
      });
    }

    const user = await authService.login(username, password);

    // Tạo token từ thông tin user
    const token = jwt.sign(
      {
        username: user.username,
        _id: user._id
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // Lưu token vào cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
    });

    // Gửi response
    res.status(StatusCodes.OK).json({
      message: "Đăng nhập thành công",
      user
    });

  } catch (error: any) {
    res.status(StatusCodes.UNAUTHORIZED).json({ error: error.message });
  }
};

const logout = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  });

  res.status(StatusCodes.OK).json({ message: "Đăng xuất thành công" });
};

const me = (req: Request, res: Response) => {
  const user = (req as any).user; // thông tin user đã được verifyToken gắn vào
  return res.status(200).json({ user });
};

export const authController = {
  login,
  logout,
  getUserInfo,
  me,
};
