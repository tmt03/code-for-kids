// Xóa đơn hàng pending sau 24h (mỗi giờ)
// Xóa đơn hàng rejected sau 7 ngày (mỗi ngày lúc 2:00 AM)
// Singleton pattern để tránh duplicate jobs
// API endpoint để test

import * as cron from "node-cron";
import { GET_DB } from "../config/mongoDB";

export class OrderCleanupService {
  private static instance: OrderCleanupService;
  private isRunning = false;
  private cronJobs: cron.ScheduledTask[] = [];

  private constructor() {}

  public static getInstance(): OrderCleanupService {
    if (!OrderCleanupService.instance) {
      OrderCleanupService.instance = new OrderCleanupService();
    }
    return OrderCleanupService.instance;
  }

  // Xóa đơn hàng pending cũ (sau 24h)
  public async cleanupOldPendingOrders(): Promise<void> {
    if (this.isRunning) {
      console.log("🔄 Cleanup service đang chạy, bỏ qua lần này...");
      return;
    }

    this.isRunning = true;

    try {
      const db = GET_DB();
      const collection = db.collection("orders");

      // Thời điểm 24 giờ trước
      const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000);

      // Tìm và đếm đơn hàng pending cũ
      const oldPendingOrders = await collection
        .find({
          status: "pending",
          createdAt: { $lt: cutoffDate },
        })
        .toArray();

      if (oldPendingOrders.length === 0) {
        console.log("✅ Không có đơn hàng pending cũ cần xóa");
        return;
      }

      // Xóa đơn hàng pending cũ
      const result = await collection.deleteMany({
        status: "pending",
        createdAt: { $lt: cutoffDate },
      });

      console.log(
        `🧹 Đã xóa ${result.deletedCount} đơn hàng pending cũ (sau 24h)`
      );

      // Log chi tiết các đơn hàng bị xóa
      oldPendingOrders.forEach((order) => {
        console.log(
          `   - Order: ${order.orderCode}, Email: ${order.buyer.email}, Created: ${order.createdAt}`
        );
      });
    } catch (error) {
      console.error("❌ Lỗi khi cleanup đơn hàng pending cũ:", error);
    } finally {
      this.isRunning = false;
    }
  }

  // Xóa đơn hàng rejected cũ (sau 7 ngày)
  public async cleanupOldRejectedOrders(): Promise<void> {
    try {
      const db = GET_DB();
      const collection = db.collection("orders");

      // Thời điểm 7 ngày trước
      const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      const result = await collection.deleteMany({
        status: "rejected",
        createdAt: { $lt: cutoffDate },
      });

      if (result.deletedCount > 0) {
        console.log(
          `🧹 Đã xóa ${result.deletedCount} đơn hàng rejected cũ (sau 7 ngày)`
        );
      }
    } catch (error) {
      console.error("❌ Lỗi khi cleanup đơn hàng rejected cũ:", error);
    }
  }

  // Khởi động cron jobs
  public startCleanupJobs(): void {
    console.log("🚀 Khởi động Order Cleanup Service...");

    // Cleanup pending orders mỗi giờ
    const pendingCleanupJob = cron.schedule("0 * * * *", async () => {
      console.log("⏰ Chạy cleanup pending orders...");
      await this.cleanupOldPendingOrders();
    });
    this.cronJobs.push(pendingCleanupJob);

    // Cleanup rejected orders mỗi ngày lúc 2:00 AM
    const rejectedCleanupJob = cron.schedule("0 2 * * *", async () => {
      console.log("⏰ Chạy cleanup rejected orders...");
      await this.cleanupOldRejectedOrders();
    });
    this.cronJobs.push(rejectedCleanupJob);

    console.log("✅ Order Cleanup Service đã được khởi động");
    console.log("   - Cleanup pending orders: Mỗi giờ");
    console.log("   - Cleanup rejected orders: Mỗi ngày lúc 2:00 AM");
  }

  // Dừng cron jobs
  public stopCleanupJobs(): void {
    console.log("🛑 Dừng Order Cleanup Service...");
    this.cronJobs.forEach((task: cron.ScheduledTask) => {
      task.stop();
    });
    this.cronJobs = [];
  }

  // Chạy cleanup ngay lập tức (cho testing)
  public async runCleanupNow(): Promise<void> {
    console.log("🔧 Chạy cleanup ngay lập tức...");
    await this.cleanupOldPendingOrders();
    await this.cleanupOldRejectedOrders();
  }
}
