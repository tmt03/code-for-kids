// import {
//   API_PARAM_COUNTS,
//   VALID_ANIMATIONS,
//   VALID_GAME_COMMANDS,
// } from "./constants";

// export type CheckResult = {
//   passed: boolean;
//   error?: string;
//   smartHints?: string;
// };

// export type QuestConfig = {
//   baseCode: string;
// };

// export class FrontendCodeValidator {
//   private static readonly API_CALL_REGEX = /([a-zA-Z]+)\s*\(/g;
//   private static readonly FULL_API_REGEX = /([a-zA-Z]+)\s*\((.*?)\)/g;
//   private static readonly DANGEROUS_PATTERNS = [
//     "while(true)",
//     "for(;;)",
//     "setInterval",
//     "setTimeout",
//     "fetch",
//     "XMLHttpRequest",
//     "eval",
//     "Function",
//   ];

//   private static readonly HINT_MAP: {
//     [key: string]: string | ((...args: any[]) => string);
//   } = {
//     dangerous: "Hãy bỏ vòng lặp hoặc lệnh nguy hiểm nhé!",
//     syntax: "Kiểm tra dấu ngoặc hoặc cú pháp lệnh nhé!",
//     missingCommand: (cmd: string) => `Hãy thêm lệnh ${cmd}() nhé!`,
//     invalidCommand: (cmd: string) => `Chỉ dùng các lệnh trong bài học nhé!`,
//     invalidAnimation: (anim: string) =>
//       `Hãy thử animation: ${VALID_ANIMATIONS.join(", ")} nhé!`,
//     wrongParamCount: (cmd: string, expected: number, actual: number) =>
//       `Hãy truyền đúng ${expected} tham số cho ${cmd} nhé!`,
//   };

//   static async validate(
//     userCode: string,
//     quest: QuestConfig
//   ): Promise<CheckResult> {
//     const result: CheckResult = { passed: false };

//     // 1. Kiểm tra các mẫu nguy hiểm
//     const dangerousPattern = this.DANGEROUS_PATTERNS.find((pattern) =>
//       userCode.includes(pattern)
//     );
//     if (dangerousPattern) {
//       result.error = `Lệnh nguy hiểm: ${dangerousPattern}`;
//       result.smartHints = this.HINT_MAP.dangerous as string;
//       return result;
//     }

//     // 2. Check cú pháp
//     try {
//       new Function(userCode);
//     } catch (error: any) {
//       result.error = "Sai cú pháp";
//       result.smartHints = this.HINT_MAP.syntax as string;
//       return result;
//     }

//     // 3. Check xem các lệnh yêu cầu có trong userCode không
//     const userCommands = Array.from(userCode.matchAll(this.API_CALL_REGEX))
//       .map((match) => match[1])
//       .filter((api) => api !== "console");

//     // Trích xuất các lệnh từ quest.baseCode
//     const requiredCommands = quest.baseCode
//       ? Array.from(quest.baseCode.matchAll(this.API_CALL_REGEX)).map(
//           (match) => match[1]
//         )
//       : [];

//     const missingAPIs = requiredCommands.filter(
//       (api) => !userCommands.includes(api)
//     );
//     if (missingAPIs.length > 0) {
//       const missingCmd = missingAPIs[0];
//       result.error = `Thiếu lệnh ${missingCmd}()`;
//       result.smartHints = (
//         this.HINT_MAP.missingCommand as (cmd: string) => string
//       )(missingCmd);
//       return result;
//     }

//     // 4. Mọi lệnh trong userCode phải là những lệnh của API game
//     const invalidAPIs = userCommands.filter(
//       (api) => !VALID_GAME_COMMANDS.includes(api as string)
//     );
//     if (invalidAPIs.length > 0) {
//       const invalidCmd = invalidAPIs[0];
//       result.error = `Lệnh không hợp lệ: ${invalidCmd}`;
//       result.smartHints = (
//         this.HINT_MAP.invalidCommand as (cmd: string) => string
//       )(invalidCmd);
//       return result;
//     }

//     // 5. Kiểm tra các tham số animation
//     const fullAPICalls = Array.from(userCode.matchAll(this.FULL_API_REGEX));
//     for (const match of fullAPICalls) {
//       const params = match[2];
//       const animationMatch = params.match(/animation\s*:\s*["'](.*?)["']/);
//       if (animationMatch) {
//         const animationValue = animationMatch[1];
//         if (!VALID_ANIMATIONS.includes(animationValue as string)) {
//           result.error = `Sai animation: ${animationValue}`;
//           result.smartHints = (
//             this.HINT_MAP.invalidAnimation as (anim: string) => string
//           )(animationValue);
//           return result;
//         }
//       }
//     }

//     // 6. Kiểm tra các tham số trong một API có truyền vào đủ không
//     for (const match of fullAPICalls) {
//       const command = match[1];
//       const params = match[2];
//       const paramCount = params ? params.split(",").length : 0;
//       const expectedCount = API_PARAM_COUNTS[command] || 0;

//       if (paramCount !== expectedCount) {
//         result.error = `Sai số tham số: ${command}`;
//         result.smartHints = (
//           this.HINT_MAP.wrongParamCount as (
//             cmd: string,
//             expected: number,
//             actual: number
//           ) => string
//         )(command, expectedCount, paramCount);
//         return result;
//       }
//     }

//     result.passed = true;
//     return result;
//   }
// }
