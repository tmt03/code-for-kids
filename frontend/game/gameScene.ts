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
  // private userLayer!: Phaser.GameObjects.Layer;
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

    // Tạo animation cho quai
    this.anims.create({
      key: "mrun",
      frames: this.anims.generateFrameNumbers("monster_run", {
        start: 0,
        end: 5,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "midle",
      frames: this.anims.generateFrameNumbers("monster_idle", {
        start: 0,
        end: 4,
      }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: "mjump",
      frames: this.anims.generateFrameNumbers("monster_jump", {
        start: 0,
        end: 4,
      }),
      frameRate: 4,
      repeat: 0,
    });

        // Tạo animation cho boss
    this.anims.create({
      key: "brun",
      frames: this.anims.generateFrameNumbers("boss_run", {
        start: 0,
        end: 11,
      }),
      frameRate: 12,
      repeat: -1,
    });

    this.anims.create({
      key: "bidle",
      frames: this.anims.generateFrameNumbers("boss_idle", {
        start: 0,
        end: 9,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "fireball_anim",
      frames: this.anims.generateFrameNumbers("fireball_anim", { 
        start: 0, 
        end: 3, 
      }),
      frameRate: 10,
      repeat: -1,
    });

    // Tạo nhân vật
    this.player = new Player(this, 400, 400);
    this.player.addCollider(this.platforms); // Va chạm với tất cả platforms

    // Tạo sandbox
    this.sandbox = createStudentAPI(this);

    // // Tạo layer cho code học sinh nếu chưa có
    // if (!this.userLayer) {
    //   this.userLayer = this.add.layer();
    // }

    // Chạy preview code nếu có
    const previewCode = getBaseCodeForQuest(this.quest.id);
    if (previewCode) {
      try {
        previewCode(this, this.sandbox);
      } catch (error) {
        console.error("Lỗi khi chạy preview code:", error);
      }
    } else {
      console.warn("Không tìm thấy preview code cho quest:", this.quest.id);
    }

    // Lắng nghe code học sinh khi ấn RUN
    window.addEventListener("run-user-code", (e: any) => {
      try {
        // if (
        //   this.userLayer &&
        //   typeof this.userLayer.removeAll === "function" &&
        //   Array.isArray(this.userLayer.list)
        // ) {
        //   this.userLayer.removeAll(true);
        // }

        if (this.platforms && typeof this.platforms.clear === "function") {
          this.platforms.clear(true, true);
        }

        this.runUserCode(e.detail.code);
      } catch (err) {
        console.error("Lỗi khi chạy user code:", err);
      }
    });
  }

  // // Tạo layer cho code học sinh
  // this.userLayer = this.add.layer();

  // try {
  //   const previewCode = getBaseCodeForQuest(this.quest.id);
  //   this.runPreviewCode(previewCode);
  // } catch (error) {
  //   console.error("Lỗi khi chạy preview code:", error);
  // }

  // // Lắng nghe code học sinh khi ấn RUN
  // window.addEventListener("run-user-code", (e: any) => {
  //   this.userLayer.removeAll(true); // Xoá nội dung cũ
  //   this.platforms.clear(true, true); // Xóa platforms cũ
  //   this.runUserCode(e.detail.code); // chạy code vừa nhập
  // });

  // Thực thi code của trẻ nhập vào
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

  // Dùng Function
  runPreviewCode(previewFn: (scene: Phaser.Scene, sandbox: any) => void) {
    try {
      this.platforms.clear(true, true); // Xóa platforms cũ
      this.sandbox = createStudentAPI(this); // Tạo sandbox mới
      previewFn(this, this.sandbox); // Gọi trực tiếp function đã khai báo
    } catch (err) {
      console.error("Lỗi khi chạy preview code:", err);
    }
  }

  // Dùng String
  // runPreviewCode(code: string) {
  //   console.log("Running preview code:", code);
  //   try {
  //     this.platforms.clear(true, true); // Xóa platforms cũ trước khi chạy preview
  //     this.sandbox = createStudentAPI(this); // Dùng 1 lần duy nhất
  //     const fn = new Function("scene", "sandbox", code);
  //     fn(this, this.sandbox); // Dùng chung sandbox
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
