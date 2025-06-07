// preloadAssets.ts
import * as Phaser from "phaser";

export function preloadAssets(scene: Phaser.Scene) {
  scene.load.setPath("/assets/game_assets");

  // 🌤️ Background Skies
  scene.load.image("sky_gray", "/sky/no_color_sky_1.png");
  scene.load.image("sky_blue", "/sky/sky_1.png");
  scene.load.image("sky_midnight", "/sky/sky_2.png");
  scene.load.image("sky_pink", "/sky/sky_3.png");
  scene.load.image("sky_cloudy", "/sky/sky_4.png");
  scene.load.image("sky_afternoon", "/sky/sky_5.png");
  scene.load.image("sky_sunset", "/sky/sky_6.png");
  scene.load.image("sky_night", "/sky/sky_7.png");

  // 🟫 Grounds
  scene.load.image("ground_plain", "/ground/ground_1.png");
  scene.load.image("ground_rocky", "/ground/ground_2.png");
  scene.load.image("ground_floating", "/ground/fly_ground.png");
  scene.load.image("goal_flag", "/ground/win_flag.png");

  // 🏰 Castle
  scene.load.image("castle_main", "/castle/castle.png");

  // 🌲 Trees
  scene.load.image("tree_pine", "/tree/tree_1.png");
  scene.load.image("tree_round", "/tree/tree_2.png");
  scene.load.image("tree_small", "/tree/tree_3.png");
  scene.load.image("tree_big", "/tree/tree_4.png");

  // 🌿 Shrubs
  scene.load.image("shrub_small", "/tree/shrub_1.png");
  scene.load.image("shrub_cherry", "/tree/shrub_2.png");
  scene.load.image("shrub_berry", "/tree/shrub_3.png");
  scene.load.image("shrub_big", "/tree/shrub_4.png");

  // 🪨 Rocks
  scene.load.image("rock_small", "/rock/rock_1.png");
  scene.load.image("rock_tall", "/rock/rock_2.png");
  scene.load.image("rock_cracked", "/rock/rock_3.png");
  scene.load.image("rock_big", "/rock/rock_4.png");

  // 🏔️ Mountains
  scene.load.image("mountain_gray", "/mountain/mountain_1.png");
  scene.load.image("mountain_ice", "/mountain/mountain_2.png");
  scene.load.image("mountain_meadow", "/mountain/mountain_3.png");
  scene.load.image("mountain_plain", "/mountain/mountain_4.png");
  scene.load.image("mountain_snow", "/mountain/mountain_5.png");
  scene.load.image("mountain_dirt", "/mountain/mountain_6.png");

  // 🌳 Forests
  scene.load.image("forest_plain", "/forest/forest_1.png");
  scene.load.image("forest_dark", "/forest/forest_2.png");
  scene.load.image("forest_night", "/forest/forest_3.png");
  scene.load.image("forest_4", "/forest/forest_4.png");
  scene.load.image("forest_foggy", "/forest/forest_5.png");
  scene.load.image("forest_sunset", "/forest/forest_6.png");

  // 🧍 Knight Players (Knight 1, 2, 3)
  const knightVersions = ["knight_1", "knight_2", "knight_3"];
  knightVersions.forEach((knight, i) => {
    const prefix = `player${i + 1}`;
    scene.load.spritesheet(`${prefix}_run`, `/player/${knight}/Run.png`, {
      frameWidth: 96,
      frameHeight: 96,
    });
    scene.load.spritesheet(`${prefix}_idle`, `/player/${knight}/Idle.png`, {
      frameWidth: 96,
      frameHeight: 96,
    });
    scene.load.spritesheet(`${prefix}_jump`, `/player/${knight}/Jump.png`, {
      frameWidth: 96,
      frameHeight: 96,
    });
  });

  // 🧌 Monster - Orc 1
  scene.load.spritesheet("orc_run", "/monster/Orc_1/Run.png", {
    frameWidth: 96,
    frameHeight: 96,
  });
  scene.load.spritesheet("orc_idle", "/monster/Orc_1/Idle.png", {
    frameWidth: 96,
    frameHeight: 96,
  });
  scene.load.spritesheet("orc_jump", "/monster/Orc_1/Jump.png", {
    frameWidth: 96,
    frameHeight: 96,
  });

  // 🧟 Boss
  // === Minotaur 1 === //
  scene.load.spritesheet("Minotaur_run", "/boss/monitaur_1/Idle.png", {
    frameWidth: 128,
    frameHeight: 128,
  });
  scene.load.spritesheet("boss_run", "/boss/monitaur_1/Run.png", {
    frameWidth: 128,
    frameHeight: 128,
  });
  scene.load.spritesheet("boss_idle", "/boss/monitaur_1/Attack.png", {
    frameWidth: 128,
    frameHeight: 128,
  });
  scene.load.spritesheet("boss_idle", "/boss/monitaur_1/Dead.png", {
    frameWidth: 128,
    frameHeight: 128,
  });

  // 🔥 Skill Animations
  scene.load.spritesheet("fireball_anim", "/skill/fireball_anim.png", {
    frameWidth: 72,
    frameHeight: 72,
  });

  // ⚔️ Weapons
  scene.load.image("item_sword", "/player/item/sword.png");
  scene.load.image("item_axe", "/player/item/axe.png");
  scene.load.image("item_spear", "/player/item/spear.png");
}
