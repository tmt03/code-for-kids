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
  "onAttack",
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
  onAttack: 4,
  interact: 5,
  autoAttack: 3,
  when: 4,
  setHealth: 2,
  startTimer: 1,
};

// Danh sách sprite
export const SPRITES = [
  "knight",
  "wizard",
  "dragon",
  "castle_1",
  "village",
  "sword",
] as const;

// Danh sách background
export const BACKGROUNDS = [
  "sky_1",
  "sky_2",
  "sky_3",
  "sky_4",
  "sky_5",
  "sky_6",
  "sky_7",
] as const;

// Danh sách sàn
export const FLOORS = ["ground_1", "ground_2"] as const;

// Danh sách màu
export const COLORS = [
  "green",
  "blue",
  "red",
  "yellow",
  "purple",
  "orange",
  "pink",
  "white",
  "black",
  "gray",
  "teal",
  "navy",
  "maroon",
  "olive",
  "lime",
  "aqua",
  "silver",
  "gold",
  "indigo",
  "violet",
] as const;

// Danh sách animation
export const ANIMATIONS = [
  "jump",
  "idle",
  "run",
  "walk",
  "dead",
  "attack",
] as const;

// Danh sách hành động cho interact
export const INTERACT_ACTIONS = ["gain", "lose"] as const;

// Danh sách thuộc tính cho interact
export const INTERACT_ATTRIBUTES = ["power", "hp"] as const;

export const COMMANDS = [
  {
    name: "setBackground",
    syntax: 'setBackground("cảnh");',
  },
  {
    name: "setFloor",
    syntax: 'setFloor("tên_nền", x, y);',
  },
  {
    name: "setColor",
    syntax: 'setColor("tên_ref", "màu");',
  },
  {
    name: "spawn",
    syntax:
      'spawn("tên_sprite", x, y, { animation: "tên_animation" }, "tên_ref");',
  },
  {
    name: "spawnRandom",
    syntax:
      'spawnRandom("tên_sprite", x_min, x_max, "tên_ref", khoảng_thời_gian);',
  },
  {
    name: "setName",
    syntax: 'setName("tên_ref", "tên");',
  },
  {
    name: "scale",
    syntax: 'scale("tên_ref", tỉ_lệ);',
  },
  {
    name: "move",
    syntax: 'move("tên_ref", delta_x, delta_y);',
  },
  {
    name: "moveRandom",
    syntax: 'moveRandom("tên_ref", x_min, x_max, thời_gian_ms);',
  },
  {
    name: "onKey",
    syntax:
      'onKey("phím", { animation: "tên_animation" }, "tên_ref", giá_trị_x, giá_trị_y);',
  },
  {
    name: "onAttack",
    syntax:
      'onAttack("phím", { animation: "tên_animation" }, kiểu_skill, "tên_ref");',
  },
  {
    name: "interact",
    syntax:
      'interact("tên_ref_1", "tên_ref_2", "hành_động", "thuộc_tính", giá_trị);',
  },
  {
    name: "autoAttack",
    syntax: 'autoAttack("tên_ref", x_min, x_max);',
  },
  {
    name: "when",
    syntax: 'when("tên_ref.health", giá_trị, "hành_động", "hiệu_ứng");',
  },
  {
    name: "setHealth",
    syntax: 'setHealth("tên_ref", máu);',
  },
  {
    name: "startTimer",
    syntax: "startTimer(milliseconds);",
  },
] as const;
