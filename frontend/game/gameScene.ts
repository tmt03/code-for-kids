// GameScene.ts
import { getBaseCodeForQuest } from "@/features/quests/questMap";
import { createStudentAPI } from "@/game/api/learning-api";
import { Player } from "@/game/player"; // ← đường dẫn đến file player.ts của bạn


import * as Phaser from "phaser";

interface Quest {
  id: string;
  name: string;
  baseCode: string;
  mode: "guided" | "free";
}

export class Game_Scene extends Phaser.Scene {
  private sandbox!: Record<string, any>;
  private chapterId: number;
  private quest: Quest;
  private userLayer!: Phaser.GameObjects.Layer;
  private boss!: Phaser.Physics.Arcade.Sprite;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private bg!: Phaser.GameObjects.Image;
  private floor!: Phaser.Physics.Arcade.Sprite;
  private player!: Player;

  constructor(chapterId: number, quest: Quest) {
    super("Game_Scene");
    this.chapterId = chapterId;
    this.quest = quest;
  }

  preload() {
    this.load.setPath(`/assets/game_assets`);

      // Chap 0 nhiem vu 1
      this.load.image("background_no_color", "/sky/no_color_sky_1.png");
      this.load.image("sky_1", "/sky/sky_1.png");
      this.load.image("sky_2", "/sky/sky_2.png");
      this.load.image("sky_3", "/sky/sky_3.png");
      this.load.image("sky_4", "/sky/sky_4.png");
      this.load.image("sky_5", "/sky/sky_5.png");
      this.load.image("sky_6", "/sky/sky_6.png");
      this.load.image("sky_7", "/sky/sky_7.png");

      // Chap 0 nhiem vu 2
      this.load.image("ground_1", "/ground/ground_1.png");
      this.load.image("ground_2", "/ground/ground_2.png");

      // Chap 1 nhiem vu 1, 2
      this.load.image("castle", "/castle/castle.png");

      // Chap 1 nhiem vu 3
      this.load.image("tree_1","/tree/tree_1.png");
      this.load.image("tree_2","/tree/tree_2.png");
      this.load.image("tree_3","/tree/tree_3.png");
      this.load.image("tree_4","/tree/tree_4.png");

      // Chap 1 thu thach
      this.load.image("shrub_1","/tree/shrub_1.png");
      this.load.image("shrub_2","/tree/shrub_2.png");
      this.load.image("shrub_3","/tree/shrub_3.png");
      this.load.image("shrub_4","/tree/shrub_4.png");
      this.load.image("rock_1","/rock/rock_1.png");
      this.load.image("rock_2","/rock/rock_2.png");
      this.load.image("rock_3","/rock/rock_3.png");
      this.load.image("rock_4","/rock/rock_4.png");
      this.load.image("mountain_1","/mountain/mountain_1.png");
      this.load.image("mountain_2","/mountain/mountain_2.png");
      this.load.image("mountain_3","/mountain/mountain_3.png");
      this.load.image("mountain_4","/mountain/mountain_4.png");
      this.load.image("mountain_5","/mountain/mountain_5.png");
      this.load.image("mountain_6","/mountain/mountain_6.png");
      this.load.image("forest_1","/forest/forest_1.png");
      this.load.image("forest_2","/forest/forest_2.png");
      this.load.image("forest_3","/forest/forest_3.png");
      this.load.image("forest_4","/forest/forest_4.png");
      this.load.image("forest_5","/forest/forest_5.png");
      this.load.image("forest_6","/forest/forest_6.png");
      this.load.image("forest_7","/forest/forest_7.png");

      // Chap 2 nhiem vu 1, 2, 3
      this.load.spritesheet("player_run", "/player/knight_1/Run.png", {
        frameWidth: 96,
        frameHeight: 96,
      });
      this.load.spritesheet("player_idle", "/player/knight_1/Idle.png", {
        frameWidth: 96,
        frameHeight: 96,
      });
      this.load.spritesheet("player_jump", "/player/knight_1/Jump.png", {
        frameWidth: 96,
        frameHeight: 96,
      });

      // Chap 2 thu thach
      this.load.spritesheet("player_run", "/player/knight_2/Run.png", {
        frameWidth: 96,
        frameHeight: 96,
      });
      this.load.spritesheet("player_idle", "/player/knight_2/Idle.png", {
        frameWidth: 96,
        frameHeight: 96,
      });
      this.load.spritesheet("player_jump", "/player/knight_2/Jump.png", {
        frameWidth: 96,
        frameHeight: 96,
      });
      this.load.spritesheet("player_run", "/player/knight_3/Run.png", {
        frameWidth: 96,
        frameHeight: 96,
      });
      this.load.spritesheet("player_idle", "/player/knight_3/Idle.png", {
        frameWidth: 96,
        frameHeight: 96,
      });
      this.load.spritesheet("player_jump", "/player/knight_3/Jump.png", {
        frameWidth: 96,
        frameHeight: 96,
      });

      //Chap 3 thu thach
      this.load.image("fly_ground","/ground/fly_ground.png");
      this.load.image("win_flag","/ground/win_flag.png");

      //Chap 4 nhiem vu 1
      this.load.spritesheet("monster_run", "/monster/Orc_1/Run.png", {
        frameWidth: 96,
        frameHeight: 96,
      });
      this.load.spritesheet("monster_idle", "/monster/Orc_1/Idle.png", {
        frameWidth: 96,
        frameHeight: 96,
      });
      this.load.spritesheet("monster_jump", "/monster/Orc_1/Jump.png", {
        frameWidth: 96,
        frameHeight: 96,
      });

      //Chap 5 nhiem vu 1
      this.load.image("sword","/player/item/sword.png");

      //Chap 5 nhiem vu 2
      this.load.image("axe","/player/item/axe.png");
      this.load.image("spear","/player/item/spear.png");

      //Chap 6 nhiem vu 1
      this.load.spritesheet("boss_run", "/boss/monitaur_1/Run.png", {
        frameWidth: 128,
        frameHeight: 128,
      });
      this.load.spritesheet("boss_idle", "/boss/monitaur_1/Idle.png", {
        frameWidth: 128,
        frameHeight: 128,
      });
  }

  create() {

    // Tạo animation cho player
    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNumbers("player_run", { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });
    
    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("player_idle", { start: 0, end: 4 }),
      frameRate: 6,
      repeat: -1,
    });
    
    this.anims.create({
      key: "jump",
      frames: this.anims.generateFrameNumbers("player_jump", { start: 0, end: 4 }),
      frameRate: 4,
      repeat: 0,
    });    

    this.player = new Player(this, 400, 200); // Vị trí tùy chọn

    // Tạo trọng lực cho game
    this.physics.world.gravity.y = 800;

    // Tạo sandbox dùng chung cho preview & user code
    this.sandbox = createStudentAPI(this);

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
    try {
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
