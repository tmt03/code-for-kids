// Mô phỏng môi trường game ở backend (không dùng Phaser)
export function createBackendSandbox() {
  const refs: Record<string, any> = {}; // Lưu tất cả đối tượng được tạo
  const events: string[] = []; // Theo dõi các hành động có điều kiện hoặc hiệu ứng

  const clamp = (val: number, min: number, max: number) =>
    Math.max(min, Math.min(max, val));

  const sandbox = {
    // 1. Đổi cảnh nền
    setBackground: (bg: string) => {
      refs.background = bg;
    },

    // 2. Tạo sàn
    setFloor: (key: string, x: number, y: number) => {
      refs.floor = { key, x, y };
    },

    // 3. Đổi màu
    setColor: (refName: string, color: string) => {
      if (refs[refName]) refs[refName].color = color;
    },

    // 4. Spawn nhân vật
    spawn: (
      key: string,
      x: number,
      y: number,
      options: any = {},
      refName: string
    ) => {
      refs[refName] = { key, x, y, animation: options?.animation || null };
    },

    // 5. Spawn ngẫu nhiên
    spawnRandom: (
      key: string,
      minX: number,
      maxX: number,
      refName: string,
      interval: number
    ) => {
      const x = Math.floor((minX + maxX) / 2);
      refs[refName] = { key, x, y: 0, interval };
    },

    // 6. Gán tên hiển thị
    setName: (refName: string, name: string) => {
      if (refs[refName]) refs[refName].name = name;
    },

    // 7. Thay đổi kích thước
    scale: (refName: string, factor: number) => {
      if (refs[refName]) refs[refName].scale = clamp(factor, 0.5, 2);
    },

    // 8. Di chuyển tương đối
    move: (refName: string, dx: number, dy: number) => {
      dx = clamp(dx, -50, 50);
      dy = clamp(dy, -50, 50);
      if (refs[refName]) {
        refs[refName].x += dx;
        refs[refName].y += dy;
      }
    },

    // 9. Di chuyển ngẫu nhiên trong khoảng
    moveRandom: (refName: string, minX: number, maxX: number, time: number) => {
      if (refs[refName]) {
        refs[refName].x = Math.floor((minX + maxX) / 2);
        refs[refName].randomMoveInterval = clamp(time, 100, 10000);
      }
    },

    // 10. Điều khiển bằng phím
    onKey: (
      key: string,
      options: any,
      refName: string,
      dx: number,
      dy: number
    ) => {
      if (refs[refName]) {
        refs[refName].onKey = { key, animation: options?.animation, dx, dy };
      }
    },

    onAttack: (key: string, options: any, refName: string) => {
      if (refs[refName]) {
        refs[refName].onAttack = { key, animation: options?.animation };
      }
    },

    // 11. Tương tác va chạm
    interact: (
      ref1: string,
      ref2: string,
      action: string,
      property: string,
      value: number
    ) => {
      if (refs[ref1] && refs[ref2]) {
        if (!refs[ref1][property]) refs[ref1][property] = 0;
        value = clamp(value, -10, 10);
        refs[ref1][property] += action === "gain" ? value : -value;
      }
    },

    // 12. Tấn công tự động
    autoAttack: (refName: string, minX: number, maxX: number) => {
      if (refs[refName]) {
        refs[refName].autoAttack = { minX, maxX };
      }
    },

    // 13. Điều kiện thắng/thua
    when: (target: string, value: number, action: string, effect: string) => {
      events.push(`when ${target} == ${value} => ${effect}`);
    },

    // 14. Thiết lập máu
    setHealth: (refName: string, hp: number) => {
      if (refs[refName]) {
        refs[refName].health = clamp(hp, 0, 100);
      }
    },

    // 15. Hẹn giờ kết thúc
    startTimer: (ms: number) => {
      refs.timer = clamp(ms, 1000, 600000); // tối đa 10 phút
    },

    getRefs: () => refs,
    getEvents: () => events,
  };

  return sandbox;
}
