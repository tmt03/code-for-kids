import { API_ROOT } from "@/utils/constants";
import axios from "axios";

export const fetchQuestDetails = async (questId: string) => {
  const res = await axios.get(`${API_ROOT}/v1/quests/${questId}`);
  return res.data;
};

export const fetchAllChapters = async () => {
  const res = await axios.get(`${API_ROOT}/v1/chapters/`);
  return res.data;
};

// Hàm mới: Gửi code lên server
export const submitCode = async (userCode: string) => {
  try {
    console.log("Code content:", userCode);
    const res = await axios.post(`${API_ROOT}/v1/submissions/submit`, {
      code: userCode,
    });

    console.log("Response:", res.data);
    return res.data; // Trả về dữ liệu từ server (beResult)
  } catch (error: any) {
    throw new Error(`Lỗi khi gửi code: ${error.message}`);
  }
};

export const fetchCheckLogin = async (username: string, password: string) => {
  const res = await axios.post(`${API_ROOT}/v1/login/`, {
    username,
    password,
  });
  return res.data;
};
