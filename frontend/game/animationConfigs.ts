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
  // 🔥 Fireball
  {
    key: "fireball_anim",
    animName: "fireball_anim",
    start: 0,
    end: 0,
    frameRate: 0,
  },

  // 🧍 Knight 1
  {
    key: "kiemsi_dung",
    animName: "kiemsi_dung_dung",
    start: 0,
    end: 0,
    frameRate: 0,
  },
  {
    key: "kiemsi_chay",
    animName: "kiemsi_chay_chay",
    start: 0,
    end: 0,
    frameRate: 0,
  },
  {
    key: "kiemsi_nhay",
    animName: "kiemsi_nhay_nhay",
    start: 0,
    end: 0,
    frameRate: 0,
  },
  {
    key: "kiemsi_danh",
    animName: "kiemsi_danh_danh",
    start: 0,
    end: 0,
    frameRate: 0,
  },

  // 🏹 Knight 2
  {
    key: "thosan_dung",
    animName: "thosan_dung_dung",
    start: 0,
    end: 0,
    frameRate: 0,
  },
  {
    key: "thosan_chay",
    animName: "thosan_chay_chay",
    start: 0,
    end: 0,
    frameRate: 0,
  },
  {
    key: "thosan_nhay",
    animName: "thosan_nhay_nhay",
    start: 0,
    end: 0,
    frameRate: 0,
  },
  {
    key: "thosan_danh",
    animName: "thosan_danh_danh",
    start: 0,
    end: 0,
    frameRate: 0,
  },

  // 🛡️ Knight 3
  {
    key: "kisi_dung",
    animName: "kisi_dung_dung",
    start: 0,
    end: 0,
    frameRate: 0,
  },
  {
    key: "kisi_chay",
    animName: "kisi_chay_chay",
    start: 0,
    end: 0,
    frameRate: 0,
  },
  {
    key: "kisi_nhay",
    animName: "kisi_nhay_nhay",
    start: 0,
    end: 0,
    frameRate: 0,
  },
  {
    key: "kisi_danh",
    animName: "kisi_danh_danh",
    start: 0,
    end: 0,
    frameRate: 0,
  },

  // 🧌 Orc xanh
  {
    key: "orcxanh_dung",
    animName: "orcxanh_dung_dung",
    start: 0,
    end: 0,
    frameRate: 0,
  },
  {
    key: "orcxanh_chay",
    animName: "orcxanh_chay_chay",
    start: 0,
    end: 0,
    frameRate: 0,
  },
  {
    key: "orcxanh_nhay",
    animName: "orcxanh_nhay_nhay",
    start: 0,
    end: 0,
    frameRate: 0,
  },
  {
    key: "orcxanh_danh",
    animName: "orcxanh_danh_danh",
    start: 0,
    end: 0,
    frameRate: 0,
  },

  // 🧌 Orc cam
  {
    key: "orccam_dung",
    animName: "orccam_dung_dung",
    start: 0,
    end: 0,
    frameRate: 0,
  },
  {
    key: "orccam_chay",
    animName: "orccam_chay_chay",
    start: 0,
    end: 0,
    frameRate: 0,
  },
  {
    key: "orccam_nhay",
    animName: "orccam_nhay_nhay",
    start: 0,
    end: 0,
    frameRate: 0,
  },
  {
    key: "orccam_danh",
    animName: "orccam_danh_danh",
    start: 0,
    end: 0,
    frameRate: 0,
  },

  // 🧌 Orc đỏ
  {
    key: "orcdo_dung",
    animName: "orcdo_dung_dung",
    start: 0,
    end: 0,
    frameRate: 0,
  },
  {
    key: "orcdo_chay",
    animName: "orcdo_chay_chay",
    start: 0,
    end: 0,
    frameRate: 0,
  },
  {
    key: "orcdo_nhay",
    animName: "orcdo_nhay_nhay",
    start: 0,
    end: 0,
    frameRate: 0,
  },
  {
    key: "orcdo_danh",
    animName: "orcdo_danh_danh",
    start: 0,
    end: 0,
    frameRate: 0,
  },

  // ☠️ Skeleton
  {
    key: "boxuong_dung",
    animName: "boxuong_dung_dung",
    start: 0,
    end: 0,
    frameRate: 0,
  },
  {
    key: "boxuong_chay",
    animName: "boxuong_chay_chay",
    start: 0,
    end: 0,
    frameRate: 0,
  },
  {
    key: "boxuong_nhay",
    animName: "boxuong_nhay_nhay",
    start: 0,
    end: 0,
    frameRate: 0,
  },
  {
    key: "boxuong_danh",
    animName: "boxuong_danh_danh",
    start: 0,
    end: 0,
    frameRate: 0,
  },

  // 🧟 Minotaur 1
  {
    key: "traubac_dung",
    animName: "traubac_dung_dung",
    start: 0,
    end: 0,
    frameRate: 0,
  },
  {
    key: "traubac_chay",
    animName: "traubac_chay_chay",
    start: 0,
    end: 0,
    frameRate: 0,
  },
  {
    key: "traubac_danh",
    animName: "traubac_danh_danh",
    start: 0,
    end: 0,
    frameRate: 0,
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
