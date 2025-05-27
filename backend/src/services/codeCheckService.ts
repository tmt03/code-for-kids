import { VM } from "vm2";

export type CheckResult = {
  passed: boolean;
  error?: string;
  hint?: string;
};

const logicCheck = async (userCode: string): Promise<CheckResult> => {
  const result: CheckResult = { passed: false };

  try {
    // 1. Kiểm tra xem đã đặt tên cho object tạo ra chưa
    const commandMatches = userCode.match(/([a-zA-Z]+)\((.*?)\)/g) || [];
    for (const match of commandMatches) {
      const command = match.match(/[a-zA-Z]+/)?.[0] || "";
      const params = match.match(/\((.*?)\)/)?.[1] || "";
      const args = params
        .split(",")
        .map((arg: string) => arg.trim().replace(/["']/g, ""));

      if (command === "spawn" || command === "spawnRandom") {
        const spriteRef = command === "spawn" ? args[4] : args[3];
        if (!spriteRef || spriteRef === "") {
          result.error = `🖼️ ${command} cần đặt tên cho object (refName)!`;
          result.hint = `Ví dụ: ${
            command === "spawn"
              ? "spawn('knight', 300, 200, { animation: 'walk' }, 'knight_1')"
              : "spawnRandom('sword', 100, 500, 'sword_1', 2000)"
          }`;
          return result;
        }
      }
    }

    // 2. Kiểm tra xem userCode có chạy được không
    const vm = new VM({
      timeout: 2000, // Giới hạn thời gian 1 giây
      sandbox: {},
      eval: false,
      wasm: false,
    });

    vm.run(userCode);
    result.passed = true;
    result.hint = "🎉 Code chạy tốt! Bạn làm rất tuyệt!";
  } catch (error: any) {
    result.error = `🐛 Có lỗi khi chạy code: ${error.message}`;
    result.hint =
      "Kiểm tra xem bạn có gọi lệnh đúng không nhé! Ví dụ: sprite có được tạo trước khi sử dụng không?";
  }

  return result;
};

export const codeCheckService = {
  logicCheck,
};
