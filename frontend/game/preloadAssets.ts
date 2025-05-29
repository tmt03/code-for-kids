// preloadAssets.ts
import * as Phaser from "phaser";

export function preloadAssets(scene: Phaser.Scene) {
  scene.load.setPath(`/assets/game_assets`);

  // Chap 0 nhiem vu 1
  scene.load.image("background_no_color", "/sky/no_color_sky_1.png");
  scene.load.image("sky_1", "/sky/sky_1.png");
  scene.load.image("sky_2", "/sky/sky_2.png");
  scene.load.image("sky_3", "/sky/sky_3.png");
  scene.load.image("sky_4", "/sky/sky_4.png");
  scene.load.image("sky_5", "/sky/sky_5.png");
  scene.load.image("sky_6", "/sky/sky_6.png");
  scene.load.image("sky_7", "/sky/sky_7.png");

  // Chap 0 nhiem vu 2
  scene.load.image("ground_1", "/ground/ground_1.png");
  scene.load.image("ground_2", "/ground/ground_2.png");

  // Chap 1 nhiem vu 1, 2
  scene.load.image("castle", "/castle/castle.png");

  // Chap 1 nhiem vu 3
  scene.load.image("tree_1", "/tree/tree_1.png");
  scene.load.image("tree_2", "/tree/tree_2.png");
  scene.load.image("tree_3", "/tree/tree_3.png");
  scene.load.image("tree_4", "/tree/tree_4.png");

  // Chap 1 thu thach
  scene.load.image("shrub_1", "/tree/shrub_1.png");
  scene.load.image("shrub_2", "/tree/shrub_2.png");
  scene.load.image("shrub_3", "/tree/shrub_3.png");
  scene.load.image("shrub_4", "/tree/shrub_4.png");
  scene.load.image("rock_1", "/rock/rock_1.png");
  scene.load.image("rock_2", "/rock/rock_2.png");
  scene.load.image("rock_3", "/rock/rock_3.png");
  scene.load.image("rock_4", "/rock/rock_4.png");
  scene.load.image("mountain_1", "/mountain/mountain_1.png");
  scene.load.image("mountain_2", "/mountain/mountain_2.png");
  scene.load.image("mountain_3", "/mountain/mountain_3.png");
  scene.load.image("mountain_4", "/mountain/mountain_4.png");
  scene.load.image("mountain_5", "/mountain/mountain_5.png");
  scene.load.image("mountain_6", "/mountain/mountain_6.png");
  scene.load.image("forest_1", "/forest/forest_1.png");
  scene.load.image("forest_2", "/forest/forest_2.png");
  scene.load.image("forest_3", "/forest/forest_3.png");
  scene.load.image("forest_4", "/forest/forest_4.png");
  scene.load.image("forest_5", "/forest/forest_5.png");
  scene.load.image("forest_6", "/forest/forest_6.png");
  scene.load.image("forest_7", "/forest/forest_7.png");

  // Chap 2 nhiem vu 1, 2, 3
  scene.load.spritesheet("player_run", "/player/knight_1/Run.png", {
    frameWidth: 96,
    frameHeight: 96,
  });
  scene.load.spritesheet("player_idle", "/player/knight_1/Idle.png", {
    frameWidth: 96,
    frameHeight: 96,
  });
  scene.load.spritesheet("player_jump", "/player/knight_1/Jump.png", {
    frameWidth: 96,
    frameHeight: 96,
  });

  // Chap 2 thu thach
  scene.load.spritesheet("player_run", "/player/knight_2/Run.png", {
    frameWidth: 96,
    frameHeight: 96,
  });
  scene.load.spritesheet("player_idle", "/player/knight_2/Idle.png", {
    frameWidth: 96,
    frameHeight: 96,
  });
  scene.load.spritesheet("player_jump", "/player/knight_2/Jump.png", {
    frameWidth: 96,
    frameHeight: 96,
  });
  scene.load.spritesheet("player_run", "/player/knight_3/Run.png", {
    frameWidth: 96,
    frameHeight: 96,
  });
  scene.load.spritesheet("player_idle", "/player/knight_3/Idle.png", {
    frameWidth: 96,
    frameHeight: 96,
  });
  scene.load.spritesheet("player_jump", "/player/knight_3/Jump.png", {
    frameWidth: 96,
    frameHeight: 96,
  });

  // Chap 3 thu thach
  scene.load.image("fly_ground", "/ground/fly_ground.png");
  scene.load.image("win_flag", "/ground/win_flag.png");

  // Chap 4 nhiem vu 1
  scene.load.spritesheet("monster_run", "/monster/Orc_1/Run.png", {
    frameWidth: 96,
    frameHeight: 96,
  });
  scene.load.spritesheet("monster_idle", "/monster/Orc_1/Idle.png", {
    frameWidth: 96,
    frameHeight: 96,
  });
  scene.load.spritesheet("monster_jump", "/monster/Orc_1/Jump.png", {
    frameWidth: 96,
    frameHeight: 96,
  });

  // Chap 5 nhiem vu 1
  scene.load.image("sword", "/player/item/sword.png");

  // Chap 5 nhiem vu 2
  scene.load.image("axe", "/player/item/axe.png");
  scene.load.image("spear", "/player/item/spear.png");

  // Chap 6 nhiem vu 1
  scene.load.spritesheet("boss_run", "/boss/monitaur_1/Run.png", {
    frameWidth: 128,
    frameHeight: 128,
  });
  scene.load.spritesheet("boss_idle", "/boss/monitaur_1/Idle.png", {
    frameWidth: 128,
    frameHeight: 128,
  });
}
