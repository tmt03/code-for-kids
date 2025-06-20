import axiosInstance from "@/lib/utils/axiosInstance";
import { API_ROOT } from "@/lib/utils/constants";
import { SaveGameRequest, SaveGameResponse } from "@/types/game";
import axios from "axios";

export const fetchQuestDetails = async (questId: string) => {
  const res = await axiosInstance.get(`/v1/quests/${questId}`);
  return res.data;
};

export const fetchAllChapters = async () => {
  const res = await axiosInstance.get("/v1/chapters/");
  return res.data;
};

// Hàm mới: Gửi code lên server
export const fetchSubmitCode = async (userCode: string, questId: string) => {
  try {
    const res = await axiosInstance.post(`/v1/submissions/submit`, {
      code: userCode,
      questId: questId,
    });

    console.log("Response:", res.data);
    return res.data; // Trả về dữ liệu từ server (beResult)
  } catch (error: any) {
    throw new Error(`Lỗi khi gửi code: ${error.message}`);
  }
};

export const fetchCheckLogin = async (username: string, password: string) => {
  const res = await axios.post(`${API_ROOT}/v1/auth/login`, {
    username,
    password,
  });
  return res.data;
};

export const uploadUserAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);
  const res = await axiosInstance.post("/v1/users/avatar", formData);
  return res.data;
};

export const uploadUserBanner = async (file: File) => {
  const formData = new FormData();
  formData.append("banner", file);
  const res = await axiosInstance.post("/v1/users/banner", formData);
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await axiosInstance.get("/v1/auth/me");
  return res.data;
};

export const logoutUser = async () => {
  await axiosInstance.post("/v1/auth/logout");
};

export const updateUserProfile = async (displayName: string, bio: string) => {
  const res = await axiosInstance.put("v1/users/profile", { displayName, bio });
  return res.data;
};

export const changeUserPassword = async (
  oldPassword: string,
  newPassword: string
) => {
  const res = await axiosInstance.put("v1/users/change-password", {
    oldPassword,
    newPassword,
  });
  return res.data;
};

export const fetchLeaderboard = async () => {
  const res = await axiosInstance.get("/v1/users/leaderboard");
  return res.data.users;
};

export const forgotPassword = async (email: string) => {
  const res = await axiosInstance.post("/v1/auth/forgot-password", { email });
  return res.data;
}

export const resetPassword = async (email: string, otp: string, newPassword: string, confirmPassword: string) => {
  const res = await axiosInstance.post("/v1/auth/reset-password", {
    email,
    otp,
    newPassword,
    confirmPassword,
  });
  return res.data;
}

export const fetchInitUserProgress = async () => {
  try {
    await axiosInstance.post("/v1/progress/init");
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error("Vui lòng đăng nhập để bắt đầu");
    }
    throw new Error(`Lỗi khi khởi tạo tiến trình: ${error.message}`);
  }
};

export const fetchLearnProgress = async () => {
  const res = await axiosInstance.get("/v1/progress/learn-progress");
  return res.data;
};

export const saveUserGame = async (gameData: SaveGameRequest) => {
  try {
    const res = await axiosInstance.post("/v1/user-game/save-game", gameData);
    return res.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error("Vui lòng đăng nhập để lưu game");
    }
    throw new Error(error.response?.data?.message || "Lỗi khi lưu game");
  }
};

// Ví dụ: Đăng ký tài khoản
export const registerUser = async (username: string, email: string, password: string) => {
  const res = await axiosInstance.post("/v1/auth/register", { username, email, password });
  return res.data;
};

// Ví dụ: Xác minh email
export const verifyEmail = async (email: string, otp: string) => {
  const res = await axiosInstance.post("/v1/auth/verify-email", { email, otp });
  return res.data;
};

export const updateQuestVideoUrl = async (questId: string, videoUrl: string) => {
  const res = await axiosInstance.put(`/v1/quests/${questId}/video-url`, {
    videoUrl,
  });
  return res.data;
};


