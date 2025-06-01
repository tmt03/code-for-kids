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
    console.log("\n=== SANDBOX INFO ===");
    console.log("Các hàm có trong sandbox:", Object.keys(sandbox));
    console.log(
      "Chi tiết hàm spawn:",
      typeof sandbox.spawn,
      sandbox.spawn.toString()
    );

    // Tạo VM với sandbox đã setup
    const vm = new VM({
      timeout: 2000,
      sandbox: sandbox,
      eval: false,
      wasm: false,
    });

    // Chạy thử code trong sandbox
    console.log("\n=== BẮT ĐẦU CHẠY CODE ===");
    try {
      vm.run(userCode);
      console.log("Code chạy thành công trong VM");
    } catch (vmError: any) {
      console.error("Lỗi khi chạy trong VM:", vmError.message);
      console.error("Stack trace:", vmError.stack);
      throw vmError; // Ném lỗi để xử lý ở catch bên ngoài
    }

    // Kiểm tra kết quả sau khi chạy
    const refs = sandbox.getRefs();
    const events = sandbox.getEvents();
    console.log("\n=== KẾT QUẢ SAU KHI CHẠY ===");
    console.log("Refs được tạo:", JSON.stringify(refs, null, 2));
    console.log("Events được kích hoạt:", JSON.stringify(events, null, 2));

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
    console.error("\n=== LỖI PHÁT SINH ===");
    console.error("Loại lỗi:", error.name);
    console.error("Thông báo lỗi:", error.message);
    console.error("Stack trace:", error.stack);

    const hintResult = await hintService.generateHint({
      code: userCode,
      error,
    });
    result.error = error.message;
    result.smartHints = hintResult.smartHints;
  }

  console.log("\n=== KẾT QUẢ CUỐI CÙNG ===");
  console.log(JSON.stringify(result, null, 2));
  console.log("=== KẾT THÚC KIỂM TRA CODE ===\n");

  return result;
};

export const codeCheckService = {
  logicCheck,
};
