// frontend/quests/questBaseCodeFunctions.ts

/**
 * Trả về đoạn mã khởi tạo scene (dưới dạng hàm) cho mỗi quest cụ thể.
 * Dùng cho chế độ "guided" hoặc preview quest.
 */
export const baseCodeFunctions: Record<
  string,
  (scene: any, sandbox: any) => void
> = {
  creative: (scene, sandbox) => {
    scene.bg = scene.add
      .image(0, 0, "bautroi_1")
      .setOrigin(0)
      .setScale(0.85)
      .setTint(0x404040);
  },
  C00_H01: (scene, sandbox) => {
    scene.bg = scene.add
      .image(0, 0, "bautroi_1")
      .setOrigin(0)
      .setScale(0.85)
      .setTint(0x404040);
  },

  C00_H02: (scene, sandbox) => {
    sandbox.setBackground("bautroi_1");
  },

  C01_Q01: (scene, sandbox) => {
    sandbox.setBackground("bautroi_1");

    // Dùng hàm setFloor để tạo floor và tự thêm vào platforms
    sandbox.setFloor("nendat_2", 0, 680);
    sandbox.setFloor("nendat_2", 340, 680);
    sandbox.setFloor("nendat_2", 680, 680);
    sandbox.setFloor("nendat_2", 1020, 680);
    sandbox.setFloor("nendat_2", 1360, 680);

    const laudai = sandbox.spawn("laudai_1", 700, 500, {}, "laudai");

    sandbox.laudai = laudai;
  },

  C01_Q02: (scene, sandbox) => {
    sandbox.setBackground("bautroi_1");

    // Dùng hàm setFloor để tạo floor và tự thêm vào platforms
    sandbox.setFloor("nendat_2", 0, 680);
    sandbox.setFloor("nendat_2", 340, 680);
    sandbox.setFloor("nendat_2", 680, 680);
    sandbox.setFloor("nendat_2", 1020, 680);
    sandbox.setFloor("nendat_2", 1360, 680);
  },

  C01_Q03: (scene, sandbox) => {
    sandbox.setBackground("bautroi_1");

    // Dùng hàm setFloor để tạo floor và tự thêm vào platforms
    sandbox.setFloor("nendat_2", 0, 680);
    sandbox.setFloor("nendat_2", 340, 680);
    sandbox.setFloor("nendat_2", 680, 680);
    sandbox.setFloor("nendat_2", 1020, 680);
    sandbox.setFloor("nendat_2", 1360, 680);

    const laudai = sandbox.spawn("laudai_1", 700, 500, {}, "laudai");

    sandbox.laudai = laudai;
  },

  C01_Q04: (scene, sandbox) => {
    sandbox.setBackground("bautroi_1");

    // Dùng hàm setFloor để tạo floor và tự thêm vào platforms
    sandbox.setFloor("nendat_2", 0, 680);
    sandbox.setFloor("nendat_2", 340, 680);
    sandbox.setFloor("nendat_2", 680, 680);
    sandbox.setFloor("nendat_2", 1020, 680);
    sandbox.setFloor("nendat_2", 1360, 680);
  },

  C02_Q01: (scene, sandbox) => {
    sandbox.setBackground("bautroi_1");

    // Dùng hàm setFloor để tạo floor và tự thêm vào platforms
    sandbox.setFloor("nendat_2", 0, 680);
    sandbox.setFloor("nendat_2", 340, 680);
    sandbox.setFloor("nendat_2", 680, 680);
    sandbox.setFloor("nendat_2", 1020, 680);
    sandbox.setFloor("nendat_2", 1360, 680);
  },

  C02_Q02: (scene, sandbox) => {
    sandbox.setBackground("bautroi_1");

    // Dùng hàm setFloor để tạo floor và tự thêm vào platforms
    sandbox.setFloor("nendat_2", 0, 680);
    sandbox.setFloor("nendat_2", 340, 680);
    sandbox.setFloor("nendat_2", 680, 680);
    sandbox.setFloor("nendat_2", 1020, 680);
    sandbox.setFloor("nendat_2", 1360, 680);

    const laudai = sandbox.spawn("laudai_1", 700, 500, {}, "laudai");

    sandbox.laudai = laudai;
  },

  C02_Q03: (scene, sandbox) => {
    sandbox.setBackground("bautroi_1");

    // Dùng hàm setFloor để tạo floor và tự thêm vào platforms
    sandbox.setFloor("nendat_2", 0, 680);
    sandbox.setFloor("nendat_2", 340, 680);
    sandbox.setFloor("nendat_2", 680, 680);
    sandbox.setFloor("nendat_2", 1020, 680);
    sandbox.setFloor("nendat_2", 1360, 680);
  },

  C02_Q04: (scene, sandbox) => {
    sandbox.setBackground("bautroi_1");

    // Dùng hàm setFloor để tạo floor và tự thêm vào platforms
    sandbox.setFloor("nendat_2", 0, 680);
    sandbox.setFloor("nendat_2", 340, 680);
    sandbox.setFloor("nendat_2", 680, 680);
    sandbox.setFloor("nendat_2", 1020, 680);
    sandbox.setFloor("nendat_2", 1360, 680);
  },

  C03_Q01: (scene, sandbox) => {
    sandbox.setBackground("bautroi_5");

    // Dùng hàm setFloor để tạo floor và tự thêm vào platforms
    sandbox.setFloor("nendat_2", 0, 680);
    sandbox.setFloor("nendat_2", 340, 680);
    sandbox.setFloor("nendat_2", 680, 680);
    sandbox.setFloor("nendat_2", 1020, 680);
    sandbox.setFloor("nendat_2", 1360, 680);

    const co = scene.add.image(1250, 646, "laco_1").setScale(0.3);

    sandbox.co = co;
  },

  C03_Q02: (scene, sandbox) => {
    sandbox.setBackground("bautroi_5");

    // Dùng hàm setFloor để tạo floor và tự thêm vào platforms
    sandbox.setFloor("nendat_2", 0, 680);
    sandbox.setFloor("nendat_2", 340, 680);
    sandbox.setFloor("nendat_2", 680, 680);
    sandbox.setFloor("nendat_2", 1020, 680);
    sandbox.setFloor("nendat_2", 1360, 680);

    const co = scene.add.image(150, 646, "laco_1").setScale(0.3);

    sandbox.co = co;
  },

  C03_Q03: (scene, sandbox) => {
    sandbox.setBackground("bautroi_5");

    // Dùng hàm setFloor để tạo floor và tự thêm vào platforms
    sandbox.setFloor("nendat_2", 0, 680);
    sandbox.setFloor("nendat_2", 340, 680);
    sandbox.setFloor("nendat_2", 680, 680);
    sandbox.setFloor("nendat_2", 1020, 680);
    sandbox.setFloor("nendat_2", 1360, 680);

    sandbox.setFloor("nendat_2", 0, 480);
    sandbox.setFloor("nendat_2", 340, 480);
    const co = scene.add.image(650, 446, "laco_1").setScale(0.3);

    sandbox.co = co;
  },

  C03_Q04: (scene, sandbox) => {
    sandbox.setBackground("bautroi_5");

    // Dùng hàm setFloor để tạo floor và tự thêm vào platforms
    sandbox.setFloor("nendat_2", 0, 680);
    sandbox.setFloor("nendat_2", 340, 680);
    sandbox.setFloor("nendat_2", 680, 680);
    sandbox.setFloor("nendat_2", 1020, 680);
    sandbox.setFloor("nendat_2", 1360, 680);

    sandbox.setFloor("nendat_2", 200, 280);
    sandbox.setFloor("nendat_2", 200, 80);
    sandbox.setFloor("nendat_2", 540, 480);

    const co = scene.add.image(450, 246, "laco_1").setScale(0.3);

    sandbox.co = co;
  },

  C04_Q01: (scene, sandbox) => {
    sandbox.setBackground("nui_3");

    // Dùng hàm setFloor để tạo floor và tự thêm vào platforms
    sandbox.setFloor("nendat_2", 0, 680);
    sandbox.setFloor("nendat_2", 340, 680);
    sandbox.setFloor("nendat_2", 680, 680);
    sandbox.setFloor("nendat_2", 1020, 680);
    sandbox.setFloor("nendat_2", 1360, 680);
  },

  C04_Q02: (scene, sandbox) => {
    sandbox.setBackground("nui_3");

    // Dùng hàm setFloor để tạo floor và tự thêm vào platforms
    sandbox.setFloor("nendat_2", 0, 680);
    sandbox.setFloor("nendat_2", 340, 680);
    sandbox.setFloor("nendat_2", 680, 680);
    sandbox.setFloor("nendat_2", 1020, 680);
    sandbox.setFloor("nendat_2", 1360, 680);
  },

  C04_Q03: (scene, sandbox) => {
    sandbox.setBackground("nui_3");

    // Dùng hàm setFloor để tạo floor và tự thêm vào platforms
    sandbox.setFloor("nendat_2", 0, 680);
    sandbox.setFloor("nendat_2", 340, 680);
    sandbox.setFloor("nendat_2", 680, 680);
    sandbox.setFloor("nendat_2", 1020, 680);
    sandbox.setFloor("nendat_2", 1360, 680);
  },

  C04_Q04: (scene, sandbox) => {
    sandbox.setBackground("nui_3");

    // Dùng hàm setFloor để tạo floor và tự thêm vào platforms
    sandbox.setFloor("nendat_2", 0, 680);
    sandbox.setFloor("nendat_2", 340, 680);
    sandbox.setFloor("nendat_2", 680, 680);
    sandbox.setFloor("nendat_2", 1020, 680);
    sandbox.setFloor("nendat_2", 1360, 680);

    sandbox.spawn("kiemsi", 900, 200, { animation: "idle" }, "kiemsi");
    sandbox.setHealth("kiemsi", 101);
  },

  C05_Q01: (scene, sandbox) => {
    sandbox.setBackground("rung_3");

    // Dùng hàm setFloor để tạo floor và tự thêm vào platforms
    sandbox.setFloor("nendat_2", 0, 680);
    sandbox.setFloor("nendat_2", 340, 680);
    sandbox.setFloor("nendat_2", 680, 680);
    sandbox.setFloor("nendat_2", 1020, 680);
    sandbox.setFloor("nendat_2", 1360, 680);
  },

  C05_Q02: (scene, sandbox) => {
    sandbox.setBackground("rung_3");

    // Dùng hàm setFloor để tạo floor và tự thêm vào platforms
    sandbox.setFloor("nendat_2", 0, 680);
    sandbox.setFloor("nendat_2", 340, 680);
    sandbox.setFloor("nendat_2", 680, 680);
    sandbox.setFloor("nendat_2", 1020, 680);
    sandbox.setFloor("nendat_2", 1360, 680);
  },

  C05_Q03: (scene, sandbox) => {
    sandbox.setBackground("rung_3");

    // Dùng hàm setFloor để tạo floor và tự thêm vào platforms
    sandbox.setFloor("nendat_2", 0, 680);
    sandbox.setFloor("nendat_2", 340, 680);
    sandbox.setFloor("nendat_2", 680, 680);
    sandbox.setFloor("nendat_2", 1020, 680);
    sandbox.setFloor("nendat_2", 1360, 680);

    sandbox.spawn("kiemsi", 900, 200, { animation: "idle" }, "kiemsi");
    sandbox.setPower("kiemsi", 10);
  },

  C05_Q04: (scene, sandbox) => {
    sandbox.setBackground("rung_3");

    // Dùng hàm setFloor để tạo floor và tự thêm vào platforms
    sandbox.setFloor("nendat_2", 0, 680);
    sandbox.setFloor("nendat_2", 340, 680);
    sandbox.setFloor("nendat_2", 680, 680);
    sandbox.setFloor("nendat_2", 1020, 680);
    sandbox.setFloor("nendat_2", 1360, 680);
  },

  C05_Q05: (scene, sandbox) => {
    sandbox.setBackground("rung_3");

    // Dùng hàm setFloor để tạo floor và tự thêm vào platforms
    sandbox.setFloor("nendat_2", 0, 680);
    sandbox.setFloor("nendat_2", 340, 680);
    sandbox.setFloor("nendat_2", 680, 680);
    sandbox.setFloor("nendat_2", 1020, 680);
    sandbox.setFloor("nendat_2", 1360, 680);
    sandbox.setFloor("nendat_2", 100, 480);

    sandbox.spawn("kiemsi", 200, 200, { animation: "idle" }, "kiemsinhi");
    sandbox.setPower("kiemsinhi", 10);

    sandbox.spawn("boxuong", 900, 200, { animation: "run" }, "quaivat");
    sandbox.moveRandom("quaivat", 100, 800, 200);

    sandbox.setHealth("quaivat", 100);
    // sandbox.setTimer(60);

    sandbox.when("hp:quaivat <=0", "end", "win");
    sandbox.when("hp:kiemsinhi <=0", "end", "lose");
  },

  C06_Q01: (scene, sandbox) => {
    sandbox.setBackground("bautroi_4");

    // Dùng hàm setFloor để tạo floor và tự thêm vào platforms
    sandbox.setFloor("nendat_2", 0, 680);
    sandbox.setFloor("nendat_2", 340, 680);
    sandbox.setFloor("nendat_2", 680, 680);
    sandbox.setFloor("nendat_2", 1020, 680);
    sandbox.setFloor("nendat_2", 1360, 680);
  },

  C06_Q02: (scene, sandbox) => {
    sandbox.setBackground("bautroi_4");

    // Dùng hàm setFloor để tạo floor và tự thêm vào platforms
    sandbox.setFloor("nendat_2", 0, 680);
    sandbox.setFloor("nendat_2", 340, 680);
    sandbox.setFloor("nendat_2", 680, 680);
    sandbox.setFloor("nendat_2", 1020, 680);
    sandbox.setFloor("nendat_2", 1360, 680);
  },

  C06_Q03: (scene, sandbox) => {
    sandbox.setBackground("bautroi_4");

    // Dùng hàm setFloor để tạo floor và tự thêm vào platforms
    sandbox.setFloor("nendat_2", 0, 680);
    sandbox.setFloor("nendat_2", 340, 680);
    sandbox.setFloor("nendat_2", 680, 680);
    sandbox.setFloor("nendat_2", 1020, 680);
    sandbox.setFloor("nendat_2", 1360, 680);

    sandbox.spawn("kiemsi", 650, 200, { animation: "idle" }, "kiemsinhi");
    sandbox.setHealth("kiemsinhi", 100);
    sandbox.setPower("kiemsinhi", 100);
    sandbox.scale("kiemsinhi", 1);
  },

  C06_Q04: (scene, sandbox) => {
    sandbox.setBackground("rung_3");

    // Dùng hàm setFloor để tạo floor và tự thêm vào platforms
    sandbox.setFloor("nendat_2", 0, 680);
    sandbox.setFloor("nendat_2", 340, 680);
    sandbox.setFloor("nendat_2", 680, 680);
    sandbox.setFloor("nendat_2", 1020, 680);
    sandbox.setFloor("nendat_2", 1360, 680);

    sandbox.spawn("kiemsi", 900, 200, { animation: "idle" }, "kiemsinhi");
    sandbox.when("hp:kiemsinhi >=200", "end", "win");
  },

  C07_Q01: (scene, sandbox) => {
    sandbox.setBackground("bautroi_4");

    // Dùng hàm setFloor để tạo floor và tự thêm vào platforms
    sandbox.setFloor("nendat_2", 0, 680);
    sandbox.setFloor("nendat_2", 340, 680);
    sandbox.setFloor("nendat_2", 680, 680);
    sandbox.setFloor("nendat_2", 1020, 680);
    sandbox.setFloor("nendat_2", 1360, 680);
  },
  C07_Q02: (scene, sandbox) => {
    sandbox.setBackground("bautroi_4");

    // Dùng hàm setFloor để tạo floor và tự thêm vào platforms
    sandbox.setFloor("nendat_2", 0, 680);
    sandbox.setFloor("nendat_2", 340, 680);
    sandbox.setFloor("nendat_2", 680, 680);
    sandbox.setFloor("nendat_2", 1020, 680);
    sandbox.setFloor("nendat_2", 1360, 680);
  },
  C07_Q03: (scene, sandbox) => {
    sandbox.setBackground("bautroi_4");

    // Dùng hàm setFloor để tạo floor và tự thêm vào platforms
    sandbox.setFloor("nendat_2", 0, 680);
    sandbox.setFloor("nendat_2", 340, 680);
    sandbox.setFloor("nendat_2", 680, 680);
    sandbox.setFloor("nendat_2", 1020, 680);
    sandbox.setFloor("nendat_2", 1360, 680);
  },
  C07_Q04: (scene, sandbox) => {
    sandbox.setBackground("bautroi_4");

    // Dùng hàm setFloor để tạo floor và tự thêm vào platforms
    sandbox.setFloor("nendat_2", 0, 680);
    sandbox.setFloor("nendat_2", 340, 680);
    sandbox.setFloor("nendat_2", 680, 680);
    sandbox.setFloor("nendat_2", 1020, 680);
    sandbox.setFloor("nendat_2", 1360, 680);
  },
  C07_Q05: (scene, sandbox) => {
    sandbox.setBackground("bautroi_4");

    // Dùng hàm setFloor để tạo floor và tự thêm vào platforms
    sandbox.setFloor("nendat_2", 0, 680);
    sandbox.setFloor("nendat_2", 340, 680);
    sandbox.setFloor("nendat_2", 680, 680);
    sandbox.setFloor("nendat_2", 1020, 680);
    sandbox.setFloor("nendat_2", 1360, 680);
  },
  C07_Q06: (scene, sandbox) => {
    sandbox.setBackground("bautroi_4");

    sandbox.setFloor("nendat_1", 0, 680);
    sandbox.setFloor("nendat_1", 340, 680);
    sandbox.setFloor("nendat_1", 680, 680);
    sandbox.setFloor("nendat_1", 1020, 680);
    sandbox.setFloor("nendat_1", 1360, 680);

    sandbox.spawn("kiemsi", 100, 300, { animation: "idle" }, "hero");
    sandbox.scale("hero", 1);
    sandbox.setHealth("hero", 110);
    sandbox.setPower("hero", 20);
    sandbox.setName("kiemherosi1", "Siêu Nhân");

    sandbox.spawn("boxuong", 400, 200, { animation: "attack" }, "boss");
    sandbox.scale("boss", 2);
    sandbox.setHealth("boss", 300);
    sandbox.autoAttack("boss", 400, "fireball", 10, 1000);
    sandbox.moveRandom("boss", 200, 1050, 100);
  },
  C07_Q07: (scene, sandbox) => {
    sandbox.setBackground("bautroi_4");

    // Dùng hàm setFloor để tạo floor và tự thêm vào platforms
    sandbox.setFloor("nendat_2", 0, 680);
    sandbox.setFloor("nendat_2", 340, 680);
    sandbox.setFloor("nendat_2", 680, 680);
    sandbox.setFloor("nendat_2", 1020, 680);
    sandbox.setFloor("nendat_2", 1360, 680);
  },
};

export function getBaseCodeForQuest(
  questId: string
): ((scene: any, sandbox: any) => void) | undefined {
  return baseCodeFunctions[questId];
}
