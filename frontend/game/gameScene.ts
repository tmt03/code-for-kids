// GameScene.ts
import { getBaseCodeForQuest } from "@/features/quests/questMap";
import { createStudentAPI } from "@/game/api/learning-api";

import * as Phaser from "phaser";

interface Quest {
  id: string;
  name: string;
  baseCode: string;
  mode: "guided" | "free";
}

export class Game_Scene extends Phaser.Scene {
  private chapterId: number;
  private quest: Quest;
  private userLayer!: Phaser.GameObjects.Layer;
  private boss!: Phaser.Physics.Arcade.Sprite;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private bg!: Phaser.GameObjects.Image;
  private floor!: Phaser.Physics.Arcade.Sprite;

  constructor(chapterId: number, quest: Quest) {
    super("Game_Scene");
    this.chapterId = chapterId;
    this.quest = quest;
  }

  preload() {
    // this.load.setPath(""); //Set path rỗng
    this.load.image("floor_ground_1", "/chapters_game/grounds/ground_1.png");
    this.load.image(
      "bg_mountain_1",
      "/chapters_game/backgrounds/mountain_1.png"
    );
    this.load.image(
      "bg_mountain_2",
      "/chapters_game/backgrounds/mountain_2.png"
    );
    this.load.spritesheet(
      "monitaur_idle",
      "/chapters_game/boss/monitaur_1/monitaur_idle.png",
      {
        frameWidth: 128,
        frameHeight: 128,
      }
    );
  }

  create() {
    // Tạo layer riêng cho code học sinh
    this.userLayer = this.add.layer();

    try {
      const idd = "C01_Q01"; //Giả lập chuyển id cho chapter 1 - quest
      const previewCode = getBaseCodeForQuest(idd); //Idd chuyển vào sẽ đổi thành this.quest.id (lấy id từ DB)
      this.runPreviewCode(previewCode);
    } catch (error) {
      console.log("Lỗi r");
    }

    // Lắng nghe code học sinh khi ấn RUN
    window.addEventListener("run-user-code", (e: any) => {
      this.userLayer.removeAll(true); // Xoá nội dung cũ
      this.runUserCode(e.detail.code); // chạy code vừa nhập
    });
  }

  //Thực thi code của trẻ nhập vào
  runUserCode(code: string) {
    const sandbox = createStudentAPI(this);
    try {
      const wrapped = `
      with (sandbox) {
        ${code}
      }
    `;
      new Function("sandbox", wrapped)(sandbox);
    } catch (err) {
      console.error("Lỗi khi chạy user code:", err);
    }
  }

  runPreviewCode(code: string) {
    try {
      // Tạo function mới với tham số 'scene' để code có thể truy cập scene
      const fn = new Function("scene", code);
      // Gọi hàm với this = scene hiện tại
      fn(this);
    } catch (err) {
      console.error("Lỗi khi chạy preview code:", err);
    }
  }
}
