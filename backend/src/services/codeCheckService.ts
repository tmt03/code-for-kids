import {
  ERROR_MESSAGES,
  VALID_ANIMATIONS,
  VALID_GAME_COMMANDS,
} from "../utils/constants";
import { VM } from "vm2";
import { createBackendSandbox } from "../utils/learning-api.backend";

//Service để kiểm tra code
export type CheckResult = {
  passed: boolean;
  error?: string;
  hint?: string;
  refs?: any; // Thông tin các object mà học sinh tạo ra
  events?: any; // Nếu có hệ thống events (khi máu = 0, win...)
};

type ValidCommand = (typeof VALID_GAME_COMMANDS)[number];
type ValidAnimation = (typeof VALID_ANIMATIONS)[number];

// Cache regex patterns
const COMMAND_REGEX = /([a-zA-Z]+)\((.*?)\)/g;
const ANIMATION_REGEX = /{.*?animation\s*:\s*["'](.*?)["']/;

const syntaxCheck = async (userCode: string): Promise<CheckResult> => {
  const result: CheckResult = { passed: false };

  try {
    new Function(userCode); // Kiểm tra cú pháp
    result.passed = true;
  } catch (error: any) {
    result.error = `Lỗi cú pháp: ${error.message}`;
  }
  return result;
};

const ContentCheck = async (
  userCode: string,
  quest: any
): Promise<CheckResult> => {
  const result: CheckResult = { passed: false };

  try {
    // Trích xuất danh sách lệnh từ baseCode
    const requiredCommands =
      quest.baseCode
        ?.match(/[a-zA-Z]+\(/g)
        ?.map((cmd: string) => cmd.slice(0, -1)) || [];

    const userCommands =
      userCode.match(/[a-zA-Z]+\(/g)?.map((cmd) => cmd.slice(0, -1)) || [];

    // Kiểm tra xem tất cả lệnh yêu cầu có trong userCode không
    for (const cmd of requiredCommands) {
      if (!userCommands.includes(cmd)) {
        result.hint = `Thiếu lệnh ${cmd}(). Gợi ý: hãy sử dụng ${cmd}(...) như trong đề bài.`;
        return result;
      }
    }

    // Trích xuất lệnh và kiểm tra rằng mọi lệnh trong userCode đều thuộc danh sách VALID_GAME_COMMANDS. (cleancode)
    const commandMatches = userCode.match(COMMAND_REGEX) || [];
    for (const match of commandMatches) {
      const command = match.match(/[a-zA-Z]+/)?.[0] || "";
      if (!VALID_GAME_COMMANDS.includes(command as ValidCommand)) {
        result.error = `${ERROR_MESSAGES.INVALID_COMMAND} Lệnh không hợp lệ: ${command}`;
        return result;
      }

      // Kiểm tra tham số animation nếu có (cleancode)
      const params = match.match(/\((.*?)\)/)?.[1] || "";
      const animationMatch = params.match(ANIMATION_REGEX);
      if (animationMatch) {
        const animationValue = animationMatch[1];
        if (!VALID_ANIMATIONS.includes(animationValue as ValidAnimation)) {
          result.error = `${ERROR_MESSAGES.INVALID_ANIMATION} Giá trị không hợp lệ: ${animationValue}`;
          return result;
        }
      }
    }

    result.passed = true;
  } catch (error: any) {
    result.error = `Lỗi kiểm tra nội dung: ${error.message}`;
  }
  return result;
};

const logicCheck = async (
  userCode: string,
  quest: any
): Promise<CheckResult> => {
  const result: CheckResult = { passed: false };

  try {
    const sandbox = createBackendSandbox(); // cung cấp API backend như spawn, move...

    const vm = new VM({
      timeout: 1000,
      sandbox: sandbox,
      eval: false,
      wasm: false,
    });

    // ✅ Chạy code học sinh trong sandbox
    vm.run(userCode);

    // ✅ Lấy trạng thái game sau khi chạy
    const state = sandbox.getRefs?.() || {};
    const events = sandbox.getEvents?.() || [];

    // 🔍 Tùy theo logic quest mà bạn có thể thêm điều kiện tự động chấm
    // (tùy hệ thống bạn, ví dụ so sánh toạ độ object, số lượng, tên...)

    result.passed = true;
    result.refs = state;
    result.events = events;
  } catch (error: any) {
    result.error = `Lỗi khi chạy code: ${error.message}`;
  }

  return result;
};

export const codeCheckService = {
  syntaxCheck,
  ContentCheck,
  logicCheck,
};
