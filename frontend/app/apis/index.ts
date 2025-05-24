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
