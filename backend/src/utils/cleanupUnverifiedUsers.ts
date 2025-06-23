import { GET_DB } from "../config/mongoDB";

async function cleanupUnverifiedUsers() {
  try {
    const db = await GET_DB();
    const now = Date.now();
    const result = await db.collection("users").deleteMany({
      isVerified: false,
      registerOTPExpires: { $lt: now },
    });
  } catch (err) {
    console.error("[CLEANUP] Lỗi khi xóa tài khoản chưa xác thực:", err);
  }
}

// Nếu chạy file này trực tiếp bằng node, sẽ thực thi cleanup luôn
if (require.main === module) {
  cleanupUnverifiedUsers().finally(() => process.exit());
}

export { cleanupUnverifiedUsers };
