import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { authService } from "../services/authService";

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

const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Username and password are required" });
    }

    const result = await authService.login(username, password);

    res.status(StatusCodes.OK).json(result);
  } catch (error: any) {
    res.status(StatusCodes.UNAUTHORIZED).json({ error: error.message });
  }
};


export const authController = {
    login,
    getUserInfo,
};