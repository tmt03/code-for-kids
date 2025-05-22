// GameScene.ts
import Phaser from "phaser";

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

  constructor(chapterId: number, quest: Quest) {
    super("Game_Scene");
    this.chapterId = chapterId;
    this.quest = quest;
  }

  preload() {}

  create() {
    // Tạo layer riêng cho code học sinh
    this.userLayer = this.add.layer();

    // Nếu quest dạng hướng dẫn → chạy preview
    if (this.quest.mode === "guided") {
      this.runPreviewCode(this.quest.baseCode); //chạy code preview của từng quests
    }

    // Lắng nghe code học sinh khi ấn RUN
    window.addEventListener("run-user-code", (e: any) => {
      this.userLayer.removeAll(true); // Xoá nội dung cũ
      this.runUserCode(e.detail.code);
    });
  }

  runPreviewCode(code: string) {
    try {
      const sandbox = this.getSandbox(false);
      new Function("game", code)(sandbox);
    } catch (err) {
      console.error("Preview error:", err);
    }
  }

  runUserCode(code: string) {
    try {
      const sandbox = this.getSandbox(true);
      new Function("game", code)(sandbox);
    } catch (err) {
      console.error("User code error:", err);
    }
  }

  // Trả về môi trường cho code chạy, phân biệt preview/user bằng useUserLayer
  getSandbox(useUserLayer: boolean) {
    const layer = useUserLayer ? this.userLayer : this.add.layer();

    return {
      spawn: (key: string, x: number, y: number) => {
        const sprite = this.add.sprite(x, y, key);
        layer.add(sprite);
        return sprite;
      },

      // Thêm các API khác nếu cần
    };
  }
}
