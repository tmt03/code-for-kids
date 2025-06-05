import { getBaseCodeForQuest } from "@/features/quests/questMap";
import { createStudentAPI } from "@/game/api/learning-api";
import { preloadAssets } from "./preloadAssets";

import * as Phaser from "phaser";

interface Quest {
  id: string;
  name: string;
  baseCode: string;
  mode: "guided" | "free";
}

export class Game_Scene extends Phaser.Scene {
  private static LOGICAL_WIDTH = 1440;
  private static LOGICAL_HEIGHT = 720;
  private sandbox!: Record<string, any>;
  private quest: Quest;
  private userLayer!: Phaser.GameObjects.Layer;

  constructor(quest: Quest) {
    super("Game_Scene");
    this.quest = quest;
  }

  preload() {
    preloadAssets(this);
  }

  create() {
    // Tạo animation cho player
    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNumbers("player_run", {
        start: 0,
        end: 5,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("player_idle", {
        start: 0,
        end: 4,
      }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: "jump",
      frames: this.anims.generateFrameNumbers("player_jump", {
        start: 0,
        end: 4,
      }),
      frameRate: 4,
      repeat: 0,
    });

    // Tạo sandbox
    this.sandbox = createStudentAPI(this);

    this.userLayer = this.add.layer();

    // Lắng nghe sự kiện resize
    this.scale.on("resize", (gameSize: Phaser.Structs.Size) => {
      console.log(`Canvas resized: ${gameSize.width}x${gameSize.height}`);
    });

    // Chạy preview code nếu có
    const previewCode = getBaseCodeForQuest(this.quest.id);
    if (previewCode) {
      try {
        previewCode(this, this.sandbox);
      } catch (error) {
        console.error("Lỗi khi chạy preview code:", error);
      }
    } else {
      console.warn("Không tìm thấy preview code:", this.quest.id);
    }

    // Lắng nghe code học sinh khi ấn RUN
    window.addEventListener("run-user-code", (e: any) => {
      try {
        this.userLayer.removeAll(true);
        this.runUserCode(e.detail.code);
      } catch (err) {
        console.error("Lỗi khi chạy user code:", err);
      }
    });
  }

  update() {}

  // Thực thi code của trẻ nhập vào
  runUserCode(code: string) {
    try {
      const wrapped = `
        with (sandbox) {
          ${code}
        }
      `;
      new Function("sandbox", wrapped)(this.sandbox);
    } catch (err) {
      console.error("Lỗi khi chạy user code:", err);
    }
  }

  // Dùng Function
  runPreviewCode(previewFn: (scene: Phaser.Scene, sandbox: any) => void) {
    try {
      this.sandbox = createStudentAPI(this);
      previewFn(this, this.sandbox);
    } catch (err) {
      console.error("Lỗi khi chạy preview code:", err);
    }
  }
}
