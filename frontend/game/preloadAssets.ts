// preloadAssets.ts
import * as Phaser from "phaser";

export function preloadAssets(scene: Phaser.Scene) {
  scene.load.setPath(`/assets/game_assets`);

  scene.load.spritesheet("fireball_anim", "/skill/fireball_anim.png", {
    frameWidth: 72,
    frameHeight: 72,
  });
  // Chap 0 nhiem vu 1
  scene.load.image("background_no_color", "/sky/no_color_sky_1.png");
  scene.load.image("blue_sky", "/sky/sky_1.png");
  scene.load.image("midnight_sky", "/sky/sky_2.png");
  scene.load.image("pink_sky", "/sky/sky_3.png");
  scene.load.image("cloudy_sky", "/sky/sky_4.png");
  scene.load.image("afternoon_sky", "/sky/sky_5.png");
  scene.load.image("sunset_sky", "/sky/sky_6.png");
  scene.load.image("night_sky", "/sky/sky_7.png");

  // Chap 0 nhiem vu 2
  scene.load.image("ground_1", "/ground/ground_1.png");
  scene.load.image("ground_2", "/ground/ground_2.png");

  // Chap 1 nhiem vu 1, 2
  scene.load.image("castle", "/castle/castle.png");

  // Chap 1 nhiem vu 3
  scene.load.image("pine_tree", "/tree/tree_1.png");
  scene.load.image("tree", "/tree/tree_2.png");
  scene.load.image("small_tree", "/tree/tree_3.png");
  scene.load.image("big_tree", "/tree/tree_4.png");

  // Chap 1 thu thach
  scene.load.image("small_shrub", "/tree/shrub_1.png");
  scene.load.image("cherry_shrub", "/tree/shrub_2.png");
  scene.load.image("berry_shrub", "/tree/shrub_3.png");
  scene.load.image("big_shrub", "/tree/shrub_4.png");
  scene.load.image("small_rock", "/rock/rock_1.png");
  scene.load.image("tall_rock", "/rock/rock_2.png");
  scene.load.image("strike_rock", "/rock/rock_3.png");
  scene.load.image("big_rock", "/rock/rock_4.png");
  scene.load.image("mountain_1", "/mountain/mountain_1.png");
  scene.load.image("ice_mountain", "/mountain/mountain_2.png");
  scene.load.image("meadow_mountain", "/mountain/mountain_3.png");
  scene.load.image("plain_mountain", "/mountain/mountain_4.png");
  scene.load.image("snow_mountain", "/mountain/mountain_5.png");
  scene.load.image("dirt_mountain", "/mountain/mountain_6.png");
  scene.load.image("plain_forest", "/forest/forest_1.png");
  scene.load.image("dark_forest", "/forest/forest_2.png");
  scene.load.image("night_forest", "/forest/forest_3.png");
  scene.load.image("forest_4", "/forest/forest_4.png");
  scene.load.image("fog_forest", "/forest/forest_5.png");
  scene.load.image("sunset_forest", "/forest/forest_6.png");

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
