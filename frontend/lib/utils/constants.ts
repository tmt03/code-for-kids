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
  "setPower",
  "setTimer",
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
  spawnRandom: 6,
  setName: 2,
  scale: 2,
  move: 3,
  moveRandom: 4,
  onKey: 5,
  onAttack: 4,
  interact: 5,
  autoAttack: 5,
  when: 3,
  setHealth: 2,
  setPower: 2,
  setTimer: 1,
};

// Danh sách sprite
export const SPRITES = [
  "kiemsi",
  "thosan",
  "kisi",
  "orcxanh",
  "orccam",
  "orcdo",
  "boxuong",
  "traubac",
  "trauvang",
  "quylua",
  "quycay",
] as const;

// Danh sách background
export const BACKGROUNDS = [
  "bautroi_1",
  "bautroi_2",
  "bautroi_3",
  "bautroi_4",
  "bautroi_5",
  "bautroi_6",
  "bautroi_7",
  "nui_1",
  "nui_2",
  "nui_3",
  "nui_4",
  "nui_5",
  "nui_6",
  "rung_1",
  "rung_2",
  "rung_3",
  "rung_4",
  "rung_5",
  "rung_6",
] as const;

// Danh sách sàn
export const FLOORS = [
  "nendat_1",
  "nendat_2",
  "nendat_3",
  "laco_1",
  "laudai_1",
  "cay_1",
  "cay_2",
  "cay_3",
  "cay_4",
  "cucda_1",
  "cucda_2",
  "cucda_3",
  "cucda_4",
] as const;

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
export const ANIMATIONS = ["jump", "idle", "run", "attack"] as const;

// Danh sách vũ khí cho onAttack
export const ONATTACK_WEAPONS = ["kiem", "riu", "thuong", "tim"] as const;

// Danh sách hành động cho interact
export const INTERACT_ACTIONS = ["gain", "lose"] as const;

// Danh sách kết quả cho when
export const WHEN_RESULTS = ["win", "lose"] as const;

// Danh sách thuộc tính cho interact
export const INTERACT_ATTRIBUTES = ["power", "hp"] as const;
// Danh sách hành động cho phím
export const ALLOWED_KEYS = [
  "LEFT",
  "RIGHT",
  "UP",
  "DOWN",
  "A",
  "S",
  "W",
  "D",
  "SPACE",
  "ENTER",
  "X",
  "B",
  "C",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "T",
  "U",
  "V",
  "Y",
  "Z",
] as const;

export const COMMANDS = [
  {
    name: "setBackground",
    syntax: 'setBackground("Cảnh nền");',
  },
  {
    name: "setFloor",
    syntax: 'setFloor("Tên_nền", x, y);',
  },
  {
    name: "setColor",
    syntax: 'setColor("Tên", "màu");',
  },
  {
    name: "spawn",
    syntax: 'spawn("Nhân_vật", x, y, { animation: "hoạt_ảnh" }, "tên");',
  },
  {
    name: "spawnRandom",
    syntax: 'spawnRandom("Nhân_vật", x_min, x_max, y, "tên", thời_gian);',
  },
  {
    name: "setName",
    syntax: 'setName("Tên", "biệt_danh");',
  },
  {
    name: "scale",
    syntax: 'scale("Tên", tỉ_lệ);',
  },
  {
    name: "move",
    syntax: 'move("Tên", x, y);',
  },
  {
    name: "moveRandom",
    syntax: 'moveRandom("Tên", x_min, x_max, thời_gian);',
  },
  {
    name: "onKey",
    syntax: 'onKey("phím", { animation: "hoạt_ảnh" }, "tên", x, y);',
  },
  {
    name: "onAttack",
    syntax: 'onAttack("phím", { animation: "hoạt_ảnh" }, "vũ_khí", "tên");',
  },
  {
    name: "interact",
    syntax: 'interact("tên_1", "tên_2", "hành_động", "thuộc_tính", giá_trị);',
  },
  {
    name: "autoAttack",
    syntax: 'autoAttack("tên", tầm_đánh, "kĩ_năng", sát_thương, hồi_chiêu);',
  },
  {
    name: "when",
    syntax: 'when("thuộc_tính:tên >= số", "end", "kết_quả");',
  },
  {
    name: "setHealth",
    syntax: 'setHealth("Tên", máu);',
  },
  {
    name: "setPower",
    syntax: 'setPower("tên", sức_mạnh);',
  },
  {
    name: "setTimer",
    syntax: "setTimer(thời_gian);",
  },
] as const;
