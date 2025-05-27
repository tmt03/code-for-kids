export const API_ROOT = "http://localhost:5000";

// Danh sách các lệnh hợp lệ trong game
export const VALID_GAME_COMMANDS = [
  "setBackground",
  "setFloor",
  "setColor",
  "spawn",
  "spawnRandom",
  "setName",
  "scale",
  "move",
  "moveRandom",
  "onKey",
  "interact",
  "autoAttack",
  "when",
  "setHealth",
  "startTimer",
];

// Danh sách animation hợp lệ
export const VALID_ANIMATIONS = [
  "tên_animation",
  "run",
  "jump",
  "idle",
  "walk",
  "dead",
  "attack",
];

// Thông điệp lỗi
export const ERROR_MESSAGES = {
  SYNTAX_ERROR: "Cú pháp code không hợp lệ!",
  INVALID_COMMAND: "Chỉ được sử dụng các lệnh có trong phần kiến thức!",
  INVALID_ANIMATION:
    "Animation không hợp lệ! Chỉ được sử dụng animation có trong kiến thức",
} as const;
