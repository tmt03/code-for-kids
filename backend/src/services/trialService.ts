// backend/src/services/trialService.ts
import { userModel } from "../models/userModel";

// Lưu progress tạm thời cho trial user
const saveTrialProgress = async (
  userId: string,
  questId: string,
  code: string
) => {
  // Không lưu vào DB thật, chỉ trả về kết quả tạm thời
  return {
    success: true,
    message: "Tiến trình thử nghiệm đã được ghi nhận (không lưu vĩnh viễn)",
    trialMode: true,
  };
};

// Kiểm tra quyền truy cập chapter
const canAccessChapter = async (username: string, chapterId: string) => {
  const user = await userModel.findByUsername(username);

  if (!user) return false;

  if (user.isActivated) return true;

  return chapterId.startsWith(user.trialChapterId);
};

// Lấy thông tin trial mode
const getTrialInfo = async (username: string) => {
  const user = await userModel.findByUsername(username);

  if (!user) return null;

  const isExpired = user.trialExpiresAt
    ? new Date() > user.trialExpiresAt
    : false;
  const daysLeft = user.trialExpiresAt
    ? Math.ceil(
        (user.trialExpiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
    : 0;

  return {
    isActivated: user.isActivated,
    trialChapterId: user.trialChapterId,
    trialExpiresAt: user.trialExpiresAt,
    isExpired,
    daysLeft: Math.max(0, daysLeft),
  };
};

// Kích hoạt tài khoản
const activateAccount = async (username: string) => {
  return await userModel.activateUser(username);
};

export const trialService = {
  saveTrialProgress,
  canAccessChapter,
  getTrialInfo,
  activateAccount,
};
