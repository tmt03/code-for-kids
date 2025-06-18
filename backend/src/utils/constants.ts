export const WHITELIST_DOMAINS = ["http://localhost:3000"];

// export const WHITELIST_DOMAINS = [
//   "http://localhost:3000",
//   "https://your-frontend-domain.com",
//   "https://www.your-frontend-domain.com"
// ];

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
