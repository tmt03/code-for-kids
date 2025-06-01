import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { authService } from "../services/authService";
import jwt from "jsonwebtoken";
import { env } from "../config/environment";

// const getUserInfo = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const username = req.params.username;
//     const result = await authService.getUserInfo(username);

//     if (!result) {
//       return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
//     }

//     // Xóa trường password hoặc password_hash
//     const { password_hash, ...safeUser } = result;

//     res.status(StatusCodes.OK).json(safeUser);
//   } catch (error: any) {
//     next(error);
//   }
// };

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    const result = await authService.login(username, password);

    // Gửi refreshToken qua cookie
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });

    // Trả accessToken cho frontend
    res.status(StatusCodes.OK).json({
      accessToken: result.accessToken,
      user: result.user,
    });
  } catch (error: any) {
    res.status(StatusCodes.UNAUTHORIZED).json({ error: error.message });
  }
};

const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Thiếu refreshToken" });
  }

  try {
    const result = await authService.refreshAccessToken(token);
    return res.status(StatusCodes.OK).json(result);
  } catch (error: any) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: error.message });
  }
};

const logout = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(204);

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET_REFRESH_TOKEN) as any;
    await authService.logout(decoded.username);
  } catch (e) {}

  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Đã đăng xuất" });
};

const me = async (req: Request, res: Response) => {
  const user = (req as any).user; // lấy từ verifyToken

  if (!user) {
    return res.status(401).json({ error: "Chưa xác thực" });
  }

  res.status(200).json({ user });
};

export const authController = {
  login,
  refreshToken,
  logout,
  me,
};
