import { CompletionContext } from "@codemirror/autocomplete";
import {
  ANIMATIONS,
  BACKGROUNDS,
  COLORS,
  COMMANDS,
  FLOORS,
  INTERACT_ACTIONS,
  INTERACT_ATTRIBUTES,
  SPRITES,
} from "./constants";

// Gợi ý lệnh (chỉ khi ở đầu dòng hoặc sau dấu chấm phẩy)
export const getCommandCompletions = (context: CompletionContext) => {
  // Lấy chuỗi liên tục trước con trỏ (không chứa dấu cách)
  const word = context.matchBefore(/\w*$/);
  if (!word) return null; // Nếu không có từ, không gợi ý

  // Kiểm tra vị trí con trỏ
  const isAtStartOfLine =
    word.from === 0 || context.state.doc.lineAt(word.from).from === word.from; // Đầu dòng
  const hasSemicolonBefore =
    word.from > 0 &&
    context.state.doc.sliceString(word.from - 1, word.from) === ";"; // Ký tự trước là dấu chấm phẩy

  // Chỉ gợi ý nếu ở đầu dòng hoặc trước đó là dấu chấm phẩy
  if (!isAtStartOfLine && !hasSemicolonBefore) return null;

  // Chuỗi tìm kiếm (nếu không gõ gì, gợi ý tất cả lệnh)
  const searchText = word.text.toLowerCase();

  // Lọc các lệnh mà tên chứa chuỗi đã gõ
  const matchingCommands = COMMANDS.filter((cmd) => {
    const cmdNameLower = cmd.name.toLowerCase();
    return searchText.length === 0 ? true : cmdNameLower.includes(searchText);
  });

  if (matchingCommands.length === 0) return null;

  return {
    from: word.from,
    options: matchingCommands.map((cmd) => ({
      label: cmd.name,
      displayLabel: cmd.syntax,
      type: "function",
      apply: cmd.syntax, // Chèn toàn bộ cú pháp API
    })),
  };
};

// Gợi ý tham số
export const getParameterCompletions = (context: CompletionContext) => {
  const word = context.matchBefore(/"[^"]*/);
  if (!word) return null;

  const cursorPos = context.pos;
  const text = context.state.doc.toString();
  const beforeCursor = text.slice(Math.max(0, cursorPos - 50), cursorPos);

  // Tìm lệnh gần nhất với con trỏ
  const commands = [
    { name: "spawn(", type: "spawn" },
    { name: "spawnRandom(", type: "spawnRandom" },
    { name: "onKey(", type: "onKey" },
    { name: "onAttack(", type: "onAttack" },
    { name: "interact(", type: "interact" },
    { name: "setColor(", type: "setColor" },
    { name: "setFloor(", type: "setFloor" },
    { name: "setBackground(", type: "setBackground" },
  ];

  let latestCommand = null;
  let latestCommandPos = -1;

  for (const cmd of commands) {
    const pos = beforeCursor.lastIndexOf(cmd.name);
    if (pos !== -1 && pos > latestCommandPos) {
      latestCommand = cmd;
      latestCommandPos = pos;
    }
  }

  if (!latestCommand) return null;

  // Lấy ngữ cảnh từ lệnh gần nhất đến con trỏ
  const commandContext = beforeCursor.slice(latestCommandPos);
  const quoteCount = (commandContext.match(/"[^"]*/g) || []).length;

  // Xử lý từng loại lệnh
  switch (latestCommand.type) {
    case "spawn":
    case "spawnRandom":
      if (
        commandContext.includes("{") &&
        commandContext.includes("animation:")
      ) {
        const animationMatch = commandContext.match(/animation\s*:\s*"[^"]*$/i);
        if (animationMatch) {
          return {
            from: word.from + 1,
            options: ANIMATIONS.map((animation) => ({
              label: animation,
              type: "text",
            })),
          };
        }
      }
      if (quoteCount === 1) {
        return {
          from: word.from + 1,
          options: SPRITES.map((sprite) => ({ label: sprite, type: "text" })),
        };
      }
      break;

    case "onKey":
    case "onAttack":
      if (
        commandContext.includes("{") &&
        commandContext.includes("animation:")
      ) {
        const animationMatch = commandContext.match(/animation\s*:\s*"[^"]*$/i);
        if (animationMatch) {
          return {
            from: word.from + 1,
            options: ANIMATIONS.map((animation) => ({
              label: animation,
              type: "text",
            })),
          };
        }
      }
      break;

    case "interact":
      if (quoteCount === 5) {
        return {
          from: word.from + 1,
          options: INTERACT_ACTIONS.map((action) => ({
            label: action,
            type: "text",
          })),
        };
      }
      if (quoteCount === 7) {
        return {
          from: word.from + 1,
          options: INTERACT_ATTRIBUTES.map((attr) => ({
            label: attr,
            type: "text",
          })),
        };
      }
      break;

    case "setColor":
      if (quoteCount === 3) {
        return {
          from: word.from + 1,
          options: COLORS.map((color) => ({ label: color, type: "text" })),
        };
      }
      break;

    case "setFloor":
      if (quoteCount === 1) {
        return {
          from: word.from + 1,
          options: FLOORS.map((floor) => ({ label: floor, type: "text" })),
        };
      }
      break;

    case "setBackground":
      if (quoteCount === 1) {
        return {
          from: word.from + 1,
          options: BACKGROUNDS.map((bg) => ({ label: bg, type: "text" })),
        };
      }
      break;
  }

  return null;
};

// Kết hợp cả hai loại gợi ý
export const getCompletions = (context: CompletionContext) => {
  return getCommandCompletions(context) || getParameterCompletions(context);
};
