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

// Định nghĩa số lượng tham số yêu cầu cho từng API
export const API_PARAM_COUNTS: { [key: string]: number } = {
  setBackground: 1,
  setFloor: 3,
  setColor: 2,
  spawn: 5,
  spawnRandom: 5,
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
