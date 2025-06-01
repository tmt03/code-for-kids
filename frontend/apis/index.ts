import axiosInstance from "@/lib/utils/axiosInstance";
import { API_ROOT } from "@/lib/utils/constants";
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
    console.log("Code content:", userCode);
    console.log("Code content:", questId);
    const res = await axios.post(`${API_ROOT}/v1/submissions/submit`, {
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

export const getCurrentUser = async () => {
  const res = await axiosInstance.get("/v1/auth/me");
  return res.data.user;
};

export const logoutUser = async () => {
  await axiosInstance.post("/v1/auth/logout");
};

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
