import { VM } from "vm2";
import { createBackendSandbox } from "../utils/learning-api.backend";

export type CheckResult = {
  passed: boolean;
  error?: string;
  hint?: string;
};

const logicCheck = async (userCode: string): Promise<CheckResult> => {
  console.log("\n=== BẮT ĐẦU KIỂM TRA CODE ===");
  console.log("Code được submit:", userCode);

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
    result.hint = "🎉 Code chạy tốt! Bạn làm rất tuyệt!";
  } catch (error: any) {
    console.error("\n=== LỖI PHÁT SINH ===");
    console.error("Loại lỗi:", error.name);
    console.error("Thông báo lỗi:", error.message);
    console.error("Stack trace:", error.stack);

    // Xử lý các lỗi cụ thể
    if (error.message.includes("timeout")) {
      result.error =
        "⏰ Code chạy quá lâu! Kiểm tra xem có vòng lặp vô hạn không?";
      result.hint = "Đảm bảo code của bạn không có vòng lặp vô hạn";
    } else if (error.message.includes("Cannot read properties of undefined")) {
      result.error =
        "❌ Không tìm thấy đối tượng! Hãy chắc chắn rằng bạn đã tạo đối tượng trước khi sử dụng";
      result.hint =
        "Kiểm tra xem bạn đã gọi spawn() trước khi sử dụng các lệnh khác chưa";
    } else if (error.message.includes("spawn")) {
      result.error = "🖼️ Lỗi khi tạo sprite: " + error.message;
      result.hint =
        "Kiểm tra lại tham số của lệnh spawn. Ví dụ: spawn('castle', 200, 200, {}, 'castle_1')";
    } else if (error.message.includes("is not defined")) {
      result.error = "🔍 Lệnh không tồn tại: " + error.message;
      result.hint = "Chỉ sử dụng các lệnh đã được học trong bài";
    } else if (error.message.includes("Không có sprite nào được tạo")) {
      result.error = "🎯 " + error.message;
      result.hint =
        "Hãy sử dụng lệnh spawn() để tạo sprite. Ví dụ: spawn('castle', 200, 200, {}, 'castle_1')";
    } else {
      result.error = `🐛 Có lỗi khi chạy code: ${error.message}`;
      result.hint =
        "Kiểm tra xem bạn có gọi lệnh đúng không nhé! Nếu vẫn gặp lỗi, hãy thử lại với cú pháp đơn giản hơn.";
    }
  }

  console.log("\n=== KẾT QUẢ CUỐI CÙNG ===");
  console.log(JSON.stringify(result, null, 2));
  console.log("=== KẾT THÚC KIỂM TRA CODE ===\n");

  return result;
};

export const codeCheckService = {
  logicCheck,
};
