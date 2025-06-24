// Giới hạn 5 đơn hàng trong 30 phút cho mỗi email
// Kiểm tra cả memory cache và database
// Tự động reset sau 30 phút

import { NextFunction, Request, Response } from "express";
import { GET_DB } from "../config/mongoDB";

interface RateLimitEntry {
  email: string;
  count: number;
  resetTime: Date;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export const orderRateLimit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const email = req.body.buyer?.email;

    if (!email) {
      return res.status(400).json({ error: "Email không được để trống" });
    }

    const now = new Date();
    const windowMs = 30 * 60 * 1000; // 30 phút
    const maxRequests = 5; // Tối đa 5 đơn hàng

    // Kiểm tra rate limit trong memory
    const existingEntry = rateLimitStore.get(email);

    if (existingEntry) {
      // Nếu đã hết thời gian window, reset counter
      if (now > existingEntry.resetTime) {
        rateLimitStore.set(email, {
          email,
          count: 1,
          resetTime: new Date(now.getTime() + windowMs),
        });
      } else {
        // Nếu vẫn trong window và đã vượt quá giới hạn
        if (existingEntry.count >= maxRequests) {
          const remainingTime = Math.ceil(
            (existingEntry.resetTime.getTime() - now.getTime()) / 1000 / 60
          );
          return res.status(429).json({
            error: `Bạn đã tạo quá nhiều đơn hàng. Vui lòng thử lại sau ${remainingTime} phút.`,
            remainingTime,
          });
        }

        // Tăng counter
        existingEntry.count++;
        rateLimitStore.set(email, existingEntry);
      }
    } else {
      // Tạo entry mới
      rateLimitStore.set(email, {
        email,
        count: 1,
        resetTime: new Date(now.getTime() + windowMs),
      });
    }

    // Kiểm tra thêm trong database để đảm bảo chính xác
    const db = GET_DB();
    const collection = db.collection("orders");

    const thirtyMinutesAgo = new Date(now.getTime() - windowMs);
    const recentOrderCount = await collection.countDocuments({
      "buyer.email": email,
      createdAt: { $gte: thirtyMinutesAgo },
      status: { $in: ["pending", "approved"] },
    });

    if (recentOrderCount >= maxRequests) {
      return res.status(429).json({
        error: `Bạn đã tạo quá nhiều đơn hàng trong 30 phút qua. Vui lòng thử lại sau.`,
        remainingTime: 30,
      });
    }

    next();
  } catch (error) {
    console.error("Rate limit error:", error);
    next(); // Nếu có lỗi, cho phép tiếp tục để tránh block user
  }
};

// Cleanup old entries mỗi giờ
setInterval(() => {
  const now = new Date();
  for (const [email, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(email);
    }
  }
}, 60 * 60 * 1000); // 1 giờ
