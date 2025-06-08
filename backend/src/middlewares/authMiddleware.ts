import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/environment";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Lấy token từ header hoặc cookie
  let token: string | undefined;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return res.status(401).json({ error: "Token không hợp lệ hoặc thiếu" });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET_ACCESS_TOKEN);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Token hết hạn hoặc không hợp lệ" });
  }
};
