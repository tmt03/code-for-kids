//Service để kiểm tra code
export type CheckResult = {
  passed: boolean;
  error?: string;
  hint?: string;
};

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
    const requiredCommands =
      quest.baseCode?.match(/[a-zA-Z]+\(/g)?.map((cmd) => cmd.slice(0, -1)) ||
      [];
    const userCommands =
      userCode.match(/[a-zA-Z]+\(/g)?.map((cmd) => cmd.slice(0, -1)) || [];

    if (!requiredCommands.every((cmd) => userCommands.includes(cmd))) {
      result.hint = "Thiếu lệnh yêu cầu!";
      return result;
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
    const vm = new VM({
      timeout: 1000,
      sandbox: {},
      eval: false,
      wasm: false,
    });

    if (quest.solution) {
      const expectedCode = quest.baseCode.replace("___", quest.solution);
      const expectedOutput = vm.run(expectedCode);
      const userOutput = vm.run(userCode);

      if (userOutput !== expectedOutput) {
        result.hint = `Gợi ý: Kết quả mong đợi là "${quest.solution}".`;
        return result;
      }
    }

    result.passed = true;
  } catch (error: any) {
    result.error = `Lỗi kiểm tra logic: ${error.message}`;
  }
  return result;
};

export const codeCheckService = {
  syntaxCheck,
  ContentCheck,
  logicCheck,
};
