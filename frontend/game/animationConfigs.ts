// animationConfigs.ts
interface AnimationConfig {
  key: string; // Tên texture (ví dụ: "kiemsi_dung")
  animName: string; // Tên animation (ví dụ: "kiemsi_dung_dung")
  start: number;
  end: number;
  frameRate: number;
  repeat?: number; // Optional, mặc định là -1
}

export const animationConfigs: AnimationConfig[] = [
  // 🧍 Knight 1
  {
    key: "kiemsi",
    animName: "kiemsi_idle",
    start: 0,
    end: 4,
    frameRate: 10,
  },
  {
    key: "kiemsi_chay",
    animName: "kiemsi_run",
    start: 0,
    end: 5,
    frameRate: 10,
  },
  {
    key: "kiemsi_nhay",
    animName: "kiemsi_jump",
    start: 0,
    end: 4,
    frameRate: 10,
  },
  {
    key: "kiemsi_danh",
    animName: "kiemsi_attack",
    start: 0,
    end: 3,
    frameRate: 10,
  },

  // 🏹 Knight 2
  {
    key: "thosan",
    animName: "thosan_idle",
    start: 0,
    end: 5,
    frameRate: 10,
  },
  {
    key: "thosan_chay",
    animName: "thosan_run",
    start: 0,
    end: 5,
    frameRate: 10,
  },
  {
    key: "thosan_nhay",
    animName: "thosan_jump",
    start: 0,
    end: 4,
    frameRate: 10,
  },
  {
    key: "thosan_danh",
    animName: "thosan_attack",
    start: 0,
    end: 3,
    frameRate: 10,
  },

  // 🛡️ Knight 3
  {
    key: "kisi",
    animName: "kisi_idle",
    start: 0,
    end: 4,
    frameRate: 10,
  },
  {
    key: "kisi_chay",
    animName: "kisi_run",
    start: 0,
    end: 5,
    frameRate: 10,
  },
  {
    key: "kisi_nhay",
    animName: "kisi_jump",
    start: 0,
    end: 4,
    frameRate: 10,
  },
  {
    key: "kisi_danh",
    animName: "kisi_attack",
    start: 0,
    end: 2,
    frameRate: 10,
  },

  // 🧌 Orc xanh
  {
    key: "orcxanh",
    animName: "orcxanh_idle",
    start: 0,
    end: 4,
    frameRate: 10,
  },
  {
    key: "orcxanh_chay",
    animName: "orcxanh_run",
    start: 0,
    end: 5,
    frameRate: 10,
  },
  {
    key: "orcxanh_nhay",
    animName: "orcxanh_jump",
    start: 0,
    end: 7,
    frameRate: 0,
  },
  {
    key: "orcxanh_danh",
    animName: "orcxanh_attack",
    start: 0,
    end: 3,
    frameRate: 0,
  },

  // 🧌 Orc cam
  {
    key: "orccam",
    animName: "orccam_idle",
    start: 0,
    end: 4,
    frameRate: 10,
  },
  {
    key: "orccam_chay",
    animName: "orccam_run",
    start: 0,
    end: 5,
    frameRate: 10,
  },
  {
    key: "orccam_nhay",
    animName: "orccam_jump",
    start: 0,
    end: 5,
    frameRate: 10,
  },
  {
    key: "orccam_danh",
    animName: "orccam_attack",
    start: 0,
    end: 4,
    frameRate: 10,
  },

  // 🧌 Orc đỏ
  {
    key: "orcdo",
    animName: "orcdo_idle",
    start: 0,
    end: 4,
    frameRate: 10,
  },
  {
    key: "orcdo_chay",
    animName: "orcdo_run",
    start: 0,
    end: 5,
    frameRate: 10,
  },
  {
    key: "orcdo_nhay",
    animName: "orcdo_jump",
    start: 0,
    end: 4,
    frameRate: 10,
  },
  {
    key: "orcdo_danh",
    animName: "orcdo_attack",
    start: 0,
    end: 4,
    frameRate: 10,
  },

  // ☠️ Skeleton
  {
    key: "boxuong",
    animName: "boxuong_idle",
    start: 0,
    end: 6,
    frameRate: 10,
  },
  {
    key: "boxuong_chay",
    animName: "boxuong_run",
    start: 0,
    end: 6,
    frameRate: 10,
  },
  {
    key: "boxuong_nhay",
    animName: "boxuong_jump",
    start: 0,
    end: 9,
    frameRate: 10,
  },
  {
    key: "boxuong_danh",
    animName: "boxuong_attack",
    start: 0,
    end: 6,
    frameRate: 10,
  },

  // 🧟 Minotaur 1
  {
    key: "traubac",
    animName: "traubac_idle",
    start: 0,
    end: 9,
    frameRate: 10,
  },
  {
    key: "traubac_chay",
    animName: "traubac_run",
    start: 0,
    end: 11,
    frameRate: 10,
  },
  {
    key: "traubac_danh",
    animName: "traubac_attack",
    start: 0,
    end: 4,
    frameRate: 10,
  },

  // 🧟 Minotaur 2
  {
    key: "trauvang",
    animName: "trauvang_idle",
    start: 0,
    end: 9,
    frameRate: 10,
  },
  {
    key: "trauvang_chay",
    animName: "trauvang_run",
    start: 0,
    end: 11,
    frameRate: 10,
  },
  {
    key: "trauvang_danh",
    animName: "trauvang_attack",
    start: 0,
    end: 4,
    frameRate: 10,
  },

  // 🧟 Boss - Fire_Spirit
  {
    key: "quylua",
    animName: "quylua_idle",
    start: 0,
    end: 5,
    frameRate: 10,
  },
  {
    key: "quylua_chay",
    animName: "quylua_run",
    start: 0,
    end: 6,
    frameRate: 10,
  },
  {
    key: "quylua_danh",
    animName: "quylua_attack",
    start: 0,
    end: 12,
    frameRate: 14,
  },

  // 🧟 Boss - Plent
  {
    key: "quycay",
    animName: "quycay_idle",
    start: 0,
    end: 4,
    frameRate: 10,
  },
  {
    key: "quycay_chay",
    animName: "quycay_run",
    start: 0,
    end: 8,
    frameRate: 10,
  },
  {
    key: "quycay_danh",
    animName: "quycay_attack",
    start: 0,
    end: 6,
    frameRate: 10,
  },

  // Skill
  {
    key: "fireball_anim",
    animName: "fireball",
    start: 0,
    end: 3,
    frameRate: 10,
  },
  {
    key: "healthsteal_anim",
    animName: "healthsteal",
    start: 0,
    end: 7,
    frameRate: 10,
  },
  {
    key: "lazer_anim",
    animName: "lazer",
    start: 0,
    end: 7,
    frameRate: 10,
  },
  {
    key: "poison_anim",
    animName: "poison",
    start: 0,
    end: 7,
    frameRate: 10,
  },
];

/**
 * Thiết lập tất cả animation cho sprite
 * Tạo các chuỗi animation cho các trạng thái di chuyển của người chơi
 */
export function setupAnimations(scene: Phaser.Scene): void {
  animationConfigs.forEach((anim) => {
    if (!scene.textures.exists(anim.key)) {
      console.warn(`Texture '${anim.key}' KHÔNG TỒN TẠI`);
      return;
    }

    scene.anims.create({
      key: anim.animName,
      frames: scene.anims.generateFrameNumbers(anim.key, {
        start: anim.start,
        end: anim.end,
      }),
      frameRate: anim.frameRate,
      repeat: -1,
    });
  });
}
