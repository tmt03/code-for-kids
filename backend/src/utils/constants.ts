export const WHITELIST_DOMAINS = ["http://localhost:3000"];

//For contentCheck userCode
// Danh sách các lệnh hợp lệ trong game
export const VALID_GAME_COMMANDS = [
  "spawn",
  "setFloor",
  "scale",
  "setColor",
  "move",
  "onKey",
] as const;

// Danh sách animation hợp lệ
export const VALID_ANIMATIONS = [
  "tên_animation",
  "run",
  "jump",
  "idle",
] as const;

// Thông điệp lỗi
export const ERROR_MESSAGES = {
  SYNTAX_ERROR: "Cú pháp code không hợp lệ!",
  INVALID_COMMAND:
    "Chỉ được sử dụng các lệnh: spawn, setFloor, scale, setColor, move, onKey!",
  INVALID_ANIMATION:
    "Animation không hợp lệ! Chỉ được sử dụng: tên_animation, run, jump, idle.",
} as const;
