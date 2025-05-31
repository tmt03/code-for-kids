import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/environment";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token không hợp lệ hoặc thiếu" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET_ACCESS_TOKEN);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Token hết hạn hoặc không hợp lệ" });
  }
};
