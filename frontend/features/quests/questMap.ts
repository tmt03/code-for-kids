// frontend/quests/questMap.ts

/**
 * Trả về đoạn mã baseCode dùng để khởi tạo tài nguyên game cho mỗi quest.
 * Dùng cho chế độ "guided" hoặc preview quest.
 */

export function getBaseCodeForQuest(questId: string): string {
  const baseCodes: Record<string, string> = {
    C01_Q01: `
    scene.bg = scene.add.image(0, 0, "bg_mountain_1")
        .setOrigin(0)
        .setScale(0.55);

    scene.boss = scene.add.sprite(400, 100, "monitaur_idle"); 
    scene.boss.setScale(2);
        
    scene.floor = scene.physics.add.staticImage(0, 400, "floor_ground_1")
        .setOrigin(0)
        .setScale(0.5);
        
    scene.floor = scene.physics.add.staticImage(400, 400, "floor_ground_1")
        .setOrigin(0)
        .setScale(0.5);`,

    C01_Q02: ``,

    C01_Q03: ``,

    C01_Q04: ``,
  };

  return baseCodes[questId] || "";
}
