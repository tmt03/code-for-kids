import { parse } from "acorn";
import { API_PARAM_COUNTS } from "../utils/constants";

// Mapping gợi ý cho các lỗi
const HINT_MAP: {
  [key: string]: string | ((cmd: string, value?: string) => string);
} = {
  timeout: "Đảm bảo code không có vòng lặp vô hạn nhé!",
  undefinedRef: (cmd: string) => `Hãy gọi spawn() trước khi dùng ${cmd} nhé!`,
  genericUndefinedRef: "Hãy kiểm tra tên đối tượng hoặc gọi spawn() trước nhé!",
  missingSprite:
    "Hãy sử dụng lệnh spawn() để tạo sprite. Ví dụ: spawn('castle', 200, 200, {}, 'castle_1')",
  notDefined: "Chỉ sử dụng các lệnh đã được học trong bài nhé!",
  wrongParamCount: (cmd: string) => `Hãy kiểm tra số tham số của ${cmd} nhé!`,
  invalidAnimation: (value: string) =>
    `Hãy kiểm tra tham số animation trong spawn nhé!`,
  generic:
    "Kiểm tra xem bạn có gọi lệnh đúng không nhé! Nếu vẫn gặp lỗi, hãy thử lại với cú pháp đơn giản hơn.",
};

export interface HintInput {
  code: string;
  error?: string | Error;
  refs?: Record<string, any>;
}

export interface HintOutput {
  smartHints: string;
}

export const hintService = {
  generateHint: async (input: HintInput): Promise<HintOutput> => {
    const { code, error, refs = {} } = input;

    // 1. Phân tích cú pháp để tìm các lệnh được gọi
    let calls: { name: string; paramCount: number; params: string }[] = [];
    try {
      const ast = parse(code, { ecmaVersion: 2020 });
      function traverse(node: any) {
        if (node.type === "CallExpression") {
          const callee = node.callee.name || node.callee.property?.name;
          if (callee && API_PARAM_COUNTS[callee] !== undefined) {
            const paramCount = node.arguments.length;
            const params = node.arguments
              .map((arg: any) => {
                if (arg.type === "ObjectExpression") {
                  return arg.properties
                    .map((prop: any) => `${prop.key.name}: ${prop.value.value}`)
                    .join(", ");
                }
                return arg.value || arg.name || "";
              })
              .join(", ");
            calls.push({ name: callee, paramCount, params });
          }
        }
        for (const key in node) {
          if (node[key] && typeof node[key] === "object") {
            traverse(node[key]);
          }
        }
      }
      traverse(ast);
    } catch (err) {
      return { smartHints: HINT_MAP["generic"] as string };
    }

    // 2. Kiểm tra lỗi runtime
    const errorMessage = error instanceof Error ? error.message : error;
    if (errorMessage?.includes("timeout")) {
      return { smartHints: HINT_MAP.timeout as string };
    } else if (errorMessage?.includes("Cannot read properties of undefined")) {
      const hasSpawn = calls.some((call) => call.name === "spawn");
      const commandsRequiringRef = calls.filter((call) =>
        [
          "setColor",
          "setName",
          "scale",
          "move",
          "moveRandom",
          "onKey",
          "onAttack",
          "interact",
          "autoAttack",
          "when",
          "setHealth",
        ].includes(call.name)
      );
      if (!hasSpawn && commandsRequiringRef.length > 0) {
        return {
          smartHints: (HINT_MAP.undefinedRef as (cmd: string) => string)(
            commandsRequiringRef[0].name
          ),
        };
      }
      return { smartHints: HINT_MAP.genericUndefinedRef as string };
    } else if (errorMessage?.includes("spawn")) {
      // Kiểm tra tham số animation trong spawn
      const spawnCall = calls.find((call) => call.name === "spawn");
      if (spawnCall) {
        const animationMatch = spawnCall.params.match(
          /animation:\s*['"]([^'"]+)['"]/
        );
        if (animationMatch) {
          const animationValue = animationMatch[1];
          // Giả định có danh sách VALID_ANIMATIONS, nếu không thì bỏ qua kiểm tra này
          return {
            smartHints: (
              HINT_MAP.invalidAnimation as (value: string) => string
            )(animationValue),
          };
        }
      }
      return { smartHints: HINT_MAP.missingSprite as string };
    } else if (errorMessage?.includes("không được định nghĩa")) {
      return { smartHints: HINT_MAP.notDefined as string };
    } else if (errorMessage?.includes("Không có sprite nào được tạo")) {
      return { smartHints: HINT_MAP.missingSprite as string };
    }

    return { smartHints: HINT_MAP.generic as string };
  },
};
