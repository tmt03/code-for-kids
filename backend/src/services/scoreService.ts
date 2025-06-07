// services/scoreService.ts
import { questModel } from "../models/questModel";
import { userModel } from "../models/userModel";
import { userProgressModel } from "../models/userProgressModel";

// Định nghĩa kiểu dữ liệu cho attempt
interface Attempt {
  code: string;
  at: string | Date;
}

/**
 * Tách các dòng code và chuẩn hóa thành mảng các dòng đã trim.
 * @param code Chuỗi code đầu vào.
 * @returns Mảng các dòng code đã được chuẩn hóa.
 */
const splitAndNormalizeCode = (code: string): string[] =>
  code
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");

/**
 * Trích xuất tên hàm từ danh sách các dòng code.
 * @param lines Mảng các dòng code.
 * @returns Mảng các tên hàm.
 */
const extractFunctionNames = (lines: string[]): string[] =>
  lines
    .map((line) => {
      const match = line.match(/^([a-zA-Z0-9_]+)\s*\(/);
      return match ? match[1] : "";
    })
    .filter((name) => name !== "");

/**
 * Lấy tập hợp các hàm không trùng lặp từ danh sách tên hàm.
 * @param functionNames Danh sách tên hàm.
 * @returns Tập hợp các hàm duy nhất.
 */
const getUniqueFunctions = (functionNames: string[]): Set<string> =>
  new Set(functionNames);

/**
 * Tìm attempt mới nhất dựa trên thời gian.
 * @param attempts Danh sách các attempt.
 * @returns Attempt mới nhất hoặc undefined nếu không có attempt.
 */
const findLatestAttempt = (attempts: Attempt[]): Attempt | undefined =>
  attempts.length > 0
    ? attempts.reduce((latest, current) =>
        new Date(latest.at) > new Date(current.at) ? latest : current
      )
    : undefined;

/**
 * Tính điểm bonus dựa trên các hàm mới trong currentCode so với attemptCode mới nhất.
 * @param currentCode Code hiện tại của người dùng.
 * @param baseCode Code cơ bản của quest (không sử dụng trong logic này).
 * @param previousAttempts Danh sách các attempt trước đó.
 * @returns Đối tượng chứa điểm bonus và danh sách các hàm mới.
 */
const calculateBonusScore = (
  currentCode: string,
  baseCode: string,
  previousAttempts: Attempt[]
): { bonus: number; newFunctions: string[] } => {
  // Lấy attempt code mới nhất
  const latestAttempt = findLatestAttempt(previousAttempts);
  const latestAttemptCode = latestAttempt ? latestAttempt.code : "";

  // Trích xuất các hàm từ attempt code
  const prevLines = splitAndNormalizeCode(latestAttemptCode);
  const prevFunctionNames = extractFunctionNames(prevLines);
  const prevFunctions = getUniqueFunctions(prevFunctionNames);

  // Trích xuất các hàm từ currentCode
  const userLines = splitAndNormalizeCode(currentCode);
  const userFunctionNames = extractFunctionNames(userLines);
  const userFunctions = getUniqueFunctions(userFunctionNames);

  // Tìm các hàm mới trong currentCode
  const newFunctions: string[] = [];
  userFunctions.forEach((funcName) => {
    if (!prevFunctions.has(funcName)) {
      newFunctions.push(funcName);
    }
  });

  const bonus = newFunctions.length * 5;

  return { bonus, newFunctions };
};

/**
 * Tìm quest trong user progress.
 * @param chapterProgress Danh sách các chapter progress.
 * @param questId ID của quest cần tìm.
 * @returns Quest tương ứng hoặc undefined nếu không tìm thấy.
 */
const findQuestInProgress = (
  chapterProgress: any[],
  questId: string
): any | undefined => {
  for (const chapter of chapterProgress) {
    const quest = chapter.quests.find((q: any) => q.questId === questId);
    if (quest) return quest;
  }
  return undefined;
};

/**
 * Cộng điểm cố định khi hoàn thành quest lần đầu.
 * @param userId ID của người dùng.
 * @param quest Quest trong progress.
 */
const addFixedScoreForCompletedQuest = async (
  userId: string,
  quest: any
): Promise<void> => {
  if (quest.status === "completed" && quest.score === 0) {
    await userModel.increaseRatingPoint(userId, quest.score);
  }
};

/**
 * Cộng điểm bonus nếu có hàm mới.
 * @param userId ID của người dùng.
 * @param currentCode Code hiện tại của người dùng.
 * @param baseCode Code cơ bản của quest.
 * @param quest Quest trong progress.
 */
const addBonusScore = async (
  userId: string,
  currentCode: string,
  baseCode: string,
  quest: any
): Promise<void> => {
  const { bonus } = calculateBonusScore(
    currentCode,
    baseCode,
    quest.attempts || []
  );

  console.log(bonus);
  if (bonus > 0) {
    await userModel.increaseRatingPoint(userId, bonus);
  }
};

/**
 * Cộng điểm cho user dựa trên quest đã hoàn thành và điểm bonus.
 * @param userId ID của người dùng.
 * @param questId ID của quest.
 * @param currentCode Code hiện tại của người dùng.
 * @throws Error nếu không tìm thấy progress hoặc baseCode.
 */
const addUserRatingScore = async (
  userId: string,
  questId: string,
  currentCode: string
): Promise<void> => {
  // Lấy user progress
  const progress = await userProgressModel.findByUserId(userId);
  if (!progress) {
    throw new Error(`Không tìm thấy tiến độ của người dùng ${userId}`);
  }

  // Lấy baseCode của quest
  const baseCode = await questModel.getBaseCodeByQuestId(questId);
  if (!baseCode) {
    throw new Error(`Không tìm thấy baseCode cho quest ${questId}`);
  }

  // Tìm quest trong progress
  const quest = findQuestInProgress(progress.chapterProgress, questId);
  if (!quest || quest.status !== "completed") {
    return; // Không cộng điểm nếu quest chưa hoàn thành
  }

  // Cộng điểm cố định khi hoàn thành quest lần đầu
  await addFixedScoreForCompletedQuest(userId, quest);

  // Cộng điểm bonus nếu có hàm mới
  await addBonusScore(userId, currentCode, baseCode, quest);
};

export const scoreService = {
  calculateBonusScore,
  addUserRatingScore,
};
