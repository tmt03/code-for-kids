import * as Phaser from "phaser";

interface Quest {
  id: string;
  name: string;
  baseCode: string;
  mode: "guided" | "free";
}

export class Preloader extends Phaser.Scene {
  private chapterId: number;
  private quest: Quest;

  constructor(chapterId: number, quest: Quest) {
    super("Preloader");
    this.chapterId = chapterId;
    this.quest = quest;
  }

  preload() {
    const basePath = `/chapters_game/Chap_${this.chapterId}/chapter_${this.chapterId}/assets`;
    console.log("Loading assets from:", basePath);

    this.load.setPath(`${basePath}/background`);
    if (this.chapterId === 1) {
      // Chapter 1 assets
      this.load.image("background", "sky/sky_2.png");
      this.load.image("floor", "ground/ground_2.png");
      this.load.image("castle", "castle/castle.png");
      this.load.image("tree", "tree/tree_4.png");
      this.load.image("shrub", "tree/shrub_3.png");
      this.load.image("rock", "rock/rock_4.png");
    } else if (this.chapterId === 2) {
      // Chapter 2 assets
      this.load.image("background", "sky/sky_4.png");
      this.load.image("floor", "ground/ground_2.png");
      this.load.image("castle", "castle/kingdom_1.png");
      this.load.image("tree", "tree/tree_3.png");
      this.load.image("shrub", "tree/shrub_1.png");
      this.load.image("rock", "rock/rock_1.png");
    } else if (this.chapterId === 3) {
      // Chapter 3 assets
      console.log("Loading Chapter 3 assets");
      this.load.image("background", "forest.png");
    }

    this.load.setPath(`${basePath}/player`);
    if (this.chapterId === 2 || this.chapterId === 3) {
      console.log("Loading player assets for chapter", this.chapterId);
      // Player assets for Chapter 2 and 3
      if (this.chapterId === 2) {
        this.load.image("sword", "sword.png");
      }
      this.load.spritesheet("player_run", "player_run.png", {
        frameWidth: 96,
        frameHeight: 64,
      });
      this.load.spritesheet("player_idle", "player_idle.png", {
        frameWidth: 96,
        frameHeight: 64,
      });
      this.load.spritesheet("player_jump", "player_jump.png", {
        frameWidth: 96,
        frameHeight: 64,
      });
    }

    if (this.chapterId === 6) {
      this.load.setPath(""); //Set path rỗng
      this.load.image("floor_ground_1", "/chapters_game/grounds/ground_1.png");
      this.load.image(
        "bg_mountain_1",
        "/chapters_game/backgrounds/mountain_1.png"
      );
      this.load.spritesheet(
        "monitaur_idle",
        "/chapters_game/boss/monitaur_1/monitaur_idle.png",
        {
          frameWidth: 128,
          frameHeight: 128,
        }
      );
      this.load.spritesheet(
        "monitaur_dead",
        "/chapters_game/boss/monitaur_1/Dead.png",
        {
          frameWidth: 128,
          frameHeight: 128,
        }
      );
    }
  }

  create() {
    console.log("Creating animations for chapter", this.chapterId);
    if (this.chapterId === 2 || this.chapterId === 3) {
      // Create animations
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
          end: 3,
        }),
        frameRate: 4,
        repeat: 0,
      });
    } else if (this.chapterId === 6) {
      try {
        this.anims.create({
          key: "idle",
          frames: this.anims.generateFrameNumbers("monitaur_idle", {
            start: 0,
            end: 9,
          }),
          frameRate: 10,
          repeat: -1,
        });

        this.anims.create({
          key: "dead",
          frames: this.anims.generateFrameNumbers("monitaur_dead", {
            start: 0,
            end: 4,
          }),
          frameRate: 5,
          repeat: -1,
        });
      } catch (error) {
        console.log(error);
      }
    }

    this.scene.start("GameScene");
  }
}
