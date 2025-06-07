// frontend/quests/questBaseCodeFunctions.ts

/**
 * Trả về đoạn mã khởi tạo scene (dưới dạng hàm) cho mỗi quest cụ thể.
 * Dùng cho chế độ "guided" hoặc preview quest.
 */

export const baseCodeFunctions: Record<
  string,
  (scene: any, sandbox: any) => void
> = {
  C00_H01: (scene, sandbox) => {
    scene.bg = scene.add
      .image(0, 0, "bautroi_1")
      .setOrigin(0)
      .setScale(0.55)
      .setTint(0x404040);
  },

  C00_H02: (scene, sandbox) => {
    scene.bg = scene.add.image(0, 0, "bautroi_1").setOrigin(0).setScale(0.55);
  },

  C01_Q01: (scene, sandbox) => {
    scene.bg = scene.add.image(0, 0, "bautroi_1").setOrigin(0).setScale(0.6);

    // Dùng hàm setFloor để tạo floor và tự thêm vào platforms
    sandbox.setFloor("nendat_2", 0, 680);
    sandbox.setFloor("nendat_2", 340, 680);
    sandbox.setFloor("nendat_2", 680, 680);
    sandbox.setFloor("nendat_2", 1020, 680);
    sandbox.setFloor("nendat_2", 1360, 680);

    const castle = scene.add
      .image(500, 308, "laudai_1")
      .setOrigin(0.5)
      .setScale(0.3)
      .setTint(0x404040);

    sandbox.castle = castle;
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

    const castle = scene.add
      .image(500, 308, "laudai_1")
      .setOrigin(0.5)
      .setScale(0.3);

    sandbox.castle = castle;
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

    const castle = scene.add
      .image(700, 308, "laudai_1")
      .setOrigin(0.5)
      .setScale(0.3);

    sandbox.castle = castle;
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

    const flag = scene.add
      .image(750, 385, "laco_1")
      .setOrigin(0.5)
      .setScale(0.3);

    sandbox.flag = flag;
  },

  C03_Q02: (scene, sandbox) => {
    sandbox.setBackground("bautroi_5");

    // Dùng hàm setFloor để tạo floor và tự thêm vào platforms
    sandbox.setFloor("nendat_2", 0, 680);
    sandbox.setFloor("nendat_2", 340, 680);
    sandbox.setFloor("nendat_2", 680, 680);
    sandbox.setFloor("nendat_2", 1020, 680);
    sandbox.setFloor("nendat_2", 1360, 680);

    const flag = scene.add
      .image(150, 385, "laco_1")
      .setOrigin(0.5)
      .setScale(0.3);

    sandbox.flag = flag;
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
    const flag = scene.add
      .image(450, 260, "laco_1")
      .setOrigin(0.5)
      .setScale(0.3);

    sandbox.flag = flag;
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

    const flag = scene.add
      .image(250, 130, "laco_1")
      .setOrigin(0.5)
      .setScale(0.3);

    sandbox.flag = flag;
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

    sandbox.spawn("kiemsi_chay", 900, 200, { animation: "chay" }, "kiemsi");
    sandbox.setHealth("kiemsi", 100);
    sandbox.onKey("RIGHT", { animation: "run" }, "kiemsi", 200, 0);
    sandbox.onKey("LEFT", { animation: "run" }, "kiemsi", -200, 0);
    sandbox.onKey("UP", { animation: "jump" }, "kiemsi", 0, 500);

    // sandbox.interact("kiemsi", "quaivat", "lose", "hp", 100);
    sandbox.when("hp:kiemsi <= 0", "end", "lose");
    // sandbox.when("time <= 30", "end", "win");
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

    sandbox.spawn("kiemsi_chay", 900, 200, { animation: "chay" }, "kiemsi");
    sandbox.setPower("kiemsi", 10);
    sandbox.onKey("RIGHT", { animation: "run" }, "kiemsi", 200, 0);
    sandbox.onKey("LEFT", { animation: "run" }, "kiemsi", -200, 0);
    sandbox.onKey("UP", { animation: "jump" }, "kiemsi", 0, 500);

    // sandbox.setTimer(60);

    sandbox.when("power:kiemsi >=200", "end", "win");
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

    sandbox.spawn("kiemsi_chay", 900, 200, { animation: "chay" }, "kiemsi");
    sandbox.setPower("kiemsi", 10);
    sandbox.onKey("RIGHT", { animation: "run" }, "kiemsi", 200, 0);
    sandbox.onKey("LEFT", { animation: "run" }, "kiemsi", -200, 0);
    sandbox.onKey("UP", { animation: "jump" }, "kiemsi", 0, 500);

    sandbox.setHealth("quaivat", 100);
    // sandbox.setTimer(60);

    sandbox.when("hp:quaivat <=0", "end", "win");
    sandbox.when("hp:kiemsi <=0", "end", "lose");
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

    sandbox.spawn("kiemsi_chay", 650, 200, { animation: "chay" }, "kiemsi");
    sandbox.scale("kiemsi", 2);
  },

  C06_Q04: (scene, sandbox) => {
    sandbox.setBackground("rung_3");

    // Dùng hàm setFloor để tạo floor và tự thêm vào platforms
    sandbox.setFloor("nendat_2", 0, 680);
    sandbox.setFloor("nendat_2", 340, 680);
    sandbox.setFloor("nendat_2", 680, 680);
    sandbox.setFloor("nendat_2", 1020, 680);
    sandbox.setFloor("nendat_2", 1360, 680);

    sandbox.spawn("kiemsi_chay", 900, 200, { animation: "chay" }, "kiemsi");
    sandbox.onKey("RIGHT", { animation: "run" }, "kiemsi", 200, 0);
    sandbox.onKey("LEFT", { animation: "run" }, "kiemsi", -200, 0);
    sandbox.onKey("UP", { animation: "jump" }, "kiemsi", 0, 500);
    // sandbox.spawnRandom("quycay_chay", 200, 600, 200, "heart", 100);?

    // sandbox.setTimer(60);

    sandbox.when("hp:kiemsi >=200", "end", "win");
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

    // Dùng hàm setFloor để tạo floor và tự thêm vào platforms
    sandbox.setFloor("nendat_2", 0, 680);
    sandbox.setFloor("nendat_2", 340, 680);
    sandbox.setFloor("nendat_2", 680, 680);
    sandbox.setFloor("nendat_2", 1020, 680);
    sandbox.setFloor("nendat_2", 1360, 680);
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
