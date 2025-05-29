// GameScene.ts
import { getBaseCodeForQuest } from "@/features/quests/questMap";
import { createStudentAPI } from "@/game/api/learning-api";
import { Player } from "@/game/player"; // ← đường dẫn đến file player.ts của bạn
import { preloadAssets } from "./preloadAssets";

import * as Phaser from "phaser";

interface Quest {
  id: string;
  name: string;
  baseCode: string;
  mode: "guided" | "free";
}

export class Game_Scene extends Phaser.Scene {
  private sandbox!: Record<string, any>;
  private quest: Quest;
  private userLayer!: Phaser.GameObjects.Layer;
  private boss!: Phaser.Physics.Arcade.Sprite;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private bg!: Phaser.GameObjects.Image;
  private floor!: Phaser.Physics.Arcade.Sprite;
  private player!: Player;

  constructor(quest: Quest) {
    super("Game_Scene");
    this.quest = quest;
  }

  preload() {
    preloadAssets(this);
  }

  create() {
    // Tạo nhóm platforms và gán trực tiếp vào scene
    this.platforms = this.physics.add.staticGroup();
    (this as any).platforms = this.platforms;

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

    // Tạo nhân vật
    this.player = new Player(this, 400, 400);
    this.player.addCollider(this.platforms); // Va chạm với tất cả platforms

    // Tạo sandbox
    this.sandbox = createStudentAPI(this);

    // Tạo layer cho code học sinh
    this.userLayer = this.add.layer();

    try {
      const previewCode = getBaseCodeForQuest(this.quest.id);
      this.runPreviewCode(previewCode);
    } catch (error) {
      console.error("Lỗi khi chạy preview code:", error);
    }

    // Lắng nghe code học sinh khi ấn RUN
    window.addEventListener("run-user-code", (e: any) => {
      this.userLayer.removeAll(true); // Xoá nội dung cũ
      this.platforms.clear(true, true); // Xóa platforms cũ
      this.runUserCode(e.detail.code); // chạy code vừa nhập
    });
  }

  //Thực thi code của trẻ nhập vào
  runUserCode(code: string) {
    try {
      const wrapped = `
        with (sandbox) {
          ${code}
        }
      `;
      new Function("sandbox", wrapped)(this.sandbox); // Dùng lại sandbox đã tạo ở preview
    } catch (err) {
      console.error("Lỗi khi chạy user code:", err);
    }
  }
  // runUserCode(code: string) {
  //   const sandbox = createStudentAPI(this);
  //   try {
  //     const wrapped = `
  //     with (sandbox) {
  //       ${code}
  //     }
  //   `;
  //     new Function("sandbox", wrapped)(sandbox);
  //   } catch (err) {
  //     console.error("Lỗi khi chạy user code:", err);
  //   }
  // }

  runPreviewCode(code: string) {
    console.log("Running preview code:", code);
    try {
      this.platforms.clear(true, true); // Xóa platforms cũ trước khi chạy preview
      this.sandbox = createStudentAPI(this); // Dùng 1 lần duy nhất
      const fn = new Function("scene", "sandbox", code);
      fn(this, this.sandbox); // Dùng chung sandbox
    } catch (err) {
      console.error("Lỗi khi chạy preview code:", err);
    }
  }
  // runPreviewCode(code: string) {
  //   try {
  //     const sandbox = createStudentAPI(this); // Tạo sandbox để truyền vào code
  //     const fn = new Function("scene", "sandbox", code); // Nhận cả scene và sandbox
  //     fn(this, sandbox); // Truyền cả hai
  //   } catch (err) {
  //     console.error("Lỗi khi chạy preview code:", err);
  //   }
  // }

  update() {
    if (this.player) {
      this.player.update(); // <-- Cái này là bắt buộc để hoạt ảnh và điều khiển chạy
    }
  }
}
