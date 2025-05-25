import {
  ERROR_MESSAGES,
  VALID_ANIMATIONS,
  VALID_GAME_COMMANDS,
} from "../utils/constants";

//Service để kiểm tra code
export type CheckResult = {
  passed: boolean;
  error?: string;
  hint?: string;
};

type ValidCommand = (typeof VALID_GAME_COMMANDS)[number];
type ValidAnimation = (typeof VALID_ANIMATIONS)[number];

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
    if (!requiredCommands.every((cmd: string) => userCommands.includes(cmd))) {
      result.hint = "Thiếu lệnh yêu cầu!";
      return result;
    }

    // Trích xuất lệnh và kiểm tra rằng mọi lệnh trong userCode đều thuộc danh sách VALID_GAME_COMMANDS.
    const commandMatches = userCode.match(/([a-zA-Z]+)\((.*?)\)/g) || [];
    for (const match of commandMatches) {
      const command = match.match(/[a-zA-Z]+/)?.[0] || "";
      if (!VALID_GAME_COMMANDS.includes(command as ValidCommand)) {
        result.error = `${ERROR_MESSAGES.INVALID_COMMAND} Lệnh không hợp lệ: ${command}`;
        return result;
      }

      // Kiểm tra tham số animation nếu có
      const params = match.match(/\((.*?)\)/)?.[1] || "";
      const animationMatch = params.match(/{.*?animation\s*:\s*["'](.*?)["']/);
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

  // try {
  //   const vm = new VM({
  //     timeout: 1000,
  //     sandbox: {},
  //     eval: false,
  //     wasm: false,
  //   });

  //   if (quest.solution) {
  //     const expectedCode = quest.baseCode.replace("___", quest.solution);
  //     const expectedOutput = vm.run(expectedCode);
  //     const userOutput = vm.run(userCode);

  //     if (userOutput !== expectedOutput) {
  //       result.hint = `Gợi ý: Kết quả mong đợi là "${quest.solution}".`;
  //       return result;
  //     }
  //   }

  //   result.passed = true;
  // } catch (error: any) {
  //   result.error = `Lỗi kiểm tra logic: ${error.message}`;
  // }
  return result;
};

export const codeCheckService = {
  syntaxCheck,
  ContentCheck,
  logicCheck,
};
