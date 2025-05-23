import { API_ROOT } from "@/utils/constants";
import axios from "axios";

export const fetchQuestDetails = async (questId: string) => {
  const res = await axios.get(`${API_ROOT}/v1/chapters/${questId}`);
  return res.data;
};
