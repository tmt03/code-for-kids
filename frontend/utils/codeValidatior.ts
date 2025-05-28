import { VALID_ANIMATIONS, VALID_GAME_COMMANDS } from "../utils/constants";

export type CheckResult = {
  passed: boolean;
  error?: string;
  hint?: string;
  progress?: number;
  completedSteps?: string[];
};

export type QuestConfig = {
  baseCode: string;
};

export class FrontendCodeValidator {
  private static readonly API_CALL_REGEX = /([a-zA-Z]+)\s*\(/g;
  private static readonly FULL_API_REGEX = /([a-zA-Z]+)\s*\((.*?)\)/g;
  private static readonly DANGEROUS_PATTERNS = [
    "while(true)",
    "for(;;)",
    "setInterval",
    "setTimeout",
    "fetch",
    "XMLHttpRequest",
    "eval",
    "Function",
  ];

  // Định nghĩa số lượng tham số yêu cầu cho từng API
  private static readonly API_PARAM_COUNTS: { [key: string]: number } = {
    setBackground: 1,
    setFloor: 3,
    setColor: 2,
    spawn: 4 | 5,
    spawnRandom: 4 | 5,
    setName: 2,
    scale: 2,
    move: 3,
    moveRandom: 4,
    onKey: 5,
    interact: 5,
    autoAttack: 3,
    when: 4,
    setHealth: 2,
    startTimer: 1,
  };

  static async validate(
    userCode: string,
    quest: QuestConfig
  ): Promise<CheckResult> {
    const result: CheckResult = { passed: false };

    // 1. Kiểm tra các mẫu nguy hiểm
    const dangerousPattern = this.DANGEROUS_PATTERNS.find((pattern) =>
      userCode.includes(pattern)
    );
    if (dangerousPattern) {
      result.error = `⚠️ Code có thể gây vấn đề: "${dangerousPattern}". Hãy thử cách khác nhé!`;
      return result;
    }

    // 2. Check cú pháp
    try {
      new Function(userCode);
    } catch (error: any) {
      result.error = `🤔 Có lỗi cú pháp: ${error.message}. Kiểm tra dấu ngoặc hoặc spelling nhé!`;
      return result;
    }

    // 3. Check xem các lệnh yêu cầu có trong userCode không
    const userCommands = Array.from(userCode.matchAll(this.API_CALL_REGEX))
      .map((match) => match[1])
      .filter((api) => api !== "console");

    // Trích xuất các lệnh từ quest.baseCode
    const requiredCommands = quest.baseCode
      ? Array.from(quest.baseCode.matchAll(this.API_CALL_REGEX)).map(
          (match) => match[1]
        )
      : [];

    const missingAPIs = requiredCommands.filter(
      (api) => !userCommands.includes(api)
    );
    if (missingAPIs.length > 0) {
      result.error = `💡 Bạn cần sử dụng lệnh: ${missingAPIs[0]}(). Hãy thử thêm nhé!`;
      return result;
    }

    // 4. Mọi lệnh trong userCode phải là những lệnh của API game
    const invalidAPIs = userCommands.filter(
      (api) => !VALID_GAME_COMMANDS.includes(api as string)
    );
    if (invalidAPIs.length > 0) {
      result.error = `🚫 Lệnh không được phép: ${invalidAPIs[0]}. Chỉ dùng các lệnh trong bài học nhé!`;
      return result;
    }

    // 5. Kiểm tra các tham số animation
    const fullAPICalls = Array.from(userCode.matchAll(this.FULL_API_REGEX));
    for (const match of fullAPICalls) {
      const params = match[2];
      const animationMatch = params.match(/animation\s*:\s*["'](.*?)["']/);
      if (animationMatch) {
        const animationValue = animationMatch[1];
        if (!VALID_ANIMATIONS.includes(animationValue as string)) {
          result.error = `🎬 Animation "${animationValue}" không hợp lệ! Thử dùng: ${VALID_ANIMATIONS.join(
            ", "
          )}`;
          return result;
        }
      }
    }

    // 6. Kiểm tra các tham số trong một API có truyền vào đủ không
    for (const match of fullAPICalls) {
      const command = match[1];
      const params = match[2];
      const paramCount = params ? params.split(",").length : 0;
      const expectedCount = this.API_PARAM_COUNTS[command] || 0;

      if (paramCount !== expectedCount) {
        result.error = `📝 Lệnh ${command} cần ${expectedCount} tham số, nhưng bạn chỉ truyền ${paramCount}!`;
        return result;
      }
    }

    // 7. Theo dõi tiến độ
    const progress = Math.round(
      ((quest.baseCode.length - missingAPIs.length) / quest.baseCode.length) *
        100
    );
    result.passed = true;
    result.progress = progress;
    result.completedSteps = requiredCommands.filter((api) =>
      userCommands.includes(api)
    );
    result.hint = `🎉 Tuyệt! Bạn đã hoàn thành ${progress}% bài tập!`;
    return result;
  }
}
