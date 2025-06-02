import { VM } from "vm2";
import { createBackendSandbox } from "../utils/learning-api.backend";
import { hintService } from "./hintService";

export type CheckResult = {
  passed: boolean;
  error?: string;
  smartHints?: string;
};

const logicCheck = async (userCode: string): Promise<CheckResult> => {
  const result: CheckResult = { passed: false };

  try {
    // Tạo sandbox từ learning-api.backend.ts
    const sandbox = createBackendSandbox();

    // Tạo VM với sandbox đã setup
    const vm = new VM({
      timeout: 2000,
      sandbox: sandbox,
      eval: false,
      wasm: false,
    });

    // Chạy thử code trong sandbox
    try {
      vm.run(userCode);
    } catch (vmError: any) {
      throw vmError; // Ném lỗi để xử lý ở catch bên ngoài
    }

    // Kiểm tra kết quả sau khi chạy
    const refs = sandbox.getRefs();
    const events = sandbox.getEvents();

    // Kiểm tra điều kiện thành công
    if (refs.length === 0) {
      throw new Error(
        "Không có sprite nào được tạo. Hãy sử dụng lệnh spawn() để tạo sprite!"
      );
    }

    // Nếu chạy đến đây mà không có lỗi, code đã chạy thành công
    result.passed = true;
    result.smartHints = "Code chạy tốt! Bạn làm rất tuyệt";
  } catch (error: any) {
    const hintResult = await hintService.generateHint({
      code: userCode,
      error,
    });
    result.error = error.message;
    result.smartHints = hintResult.smartHints;
  }

  return result;
};

export const codeCheckService = {
  logicCheck,
};
