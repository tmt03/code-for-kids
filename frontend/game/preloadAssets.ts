// preloadAssets.ts
import * as Phaser from "phaser";

export function preloadAssets(scene: Phaser.Scene) {
  scene.load.setPath("/assets/game_assets");

  //============================== animation ==============================//

  // 🔥 Skill Animations
  scene.load.spritesheet("fireball_anim", "/skill/fireball_anim.png", {
    frameWidth: 20,
    frameHeight: 20,
  });
  scene.load.spritesheet("poison_anim", "/skill/poison_anim.png", {
    frameWidth: 72,
    frameHeight: 72,
  });
  scene.load.spritesheet("healthsteal_anim", "/skill/healthsteal_anim.png", {
    frameWidth: 72,
    frameHeight: 72,
  });
  scene.load.spritesheet("lazer_anim", "/skill/lazer_anim.png", {
    frameWidth: 72,
    frameHeight: 72,
  });

  // 🌤️ Background Skies
  scene.load.image("sky_gray", "/bg/sky/no_color_sky_1.png"); //sau xóa
  scene.load.image("bautroi_1", "/bg/sky/sky_1.png");
  scene.load.image("bautroi_2", "/bg/sky/sky_2.png");
  scene.load.image("bautroi_3", "/bg/sky/sky_3.png");
  scene.load.image("bautroi_4", "/bg/sky/sky_4.png");
  scene.load.image("bautroi_5", "/bg/sky/sky_5.png");
  scene.load.image("bautroi_6", "/bg/sky/sky_6.png");
  scene.load.image("bautroi_7", "/bg/sky/sky_7.png");
  // 🏔️Background Mountains
  scene.load.image("nui_1", "/bg/mountain/mountain_1.png");
  scene.load.image("nui_2", "/bg/mountain/mountain_2.png");
  scene.load.image("nui_3", "/bg/mountain/mountain_3.png");
  scene.load.image("nui_4", "/bg/mountain/mountain_4.png");
  scene.load.image("nui_5", "/bg/mountain/mountain_5.png");
  scene.load.image("nui_6", "/bg/mountain/mountain_6.png");
  // 🌳Background Forests
  scene.load.image("rung_1", "/bg/forest/forest_1.png");
  scene.load.image("rung_2", "/bg/forest/forest_2.png");
  scene.load.image("rung_3", "/bg/forest/forest_3.png");
  scene.load.image("rung_4", "/bg/forest/forest_4.png");
  scene.load.image("rung_5", "/bg/forest/forest_5.png");
  scene.load.image("rung_6", "/bg/forest/forest_6.png");

  //==========================================================================//

  // 🟫 Grounds
  scene.load.image("nendat_1", "/floor/ground_1.png");
  scene.load.image("nendat_2", "/floor/ground_2.png");
  scene.load.image("nendat_3", "/floor/fly_ground.png");

  // 🟫 Flags
  scene.load.image("laco_1", "/flags/win_flag.png");

  // 🏰 Castle
  scene.load.image("laudai_1", "/castle/castle.png");

  // 🌲 Trees
  scene.load.image("cay_1", "/tree/tree_1.png");
  scene.load.image("cay_2", "/tree/tree_2.png");
  scene.load.image("cay_3", "/tree/tree_3.png");
  scene.load.image("cay_4", "/tree/tree_4.png");

  // 🌿 Shrubs
  scene.load.image("buico_1", "/tree/shrub_1.png");
  scene.load.image("buico_2", "/tree/shrub_2.png");
  scene.load.image("buico_3", "/tree/shrub_3.png");
  scene.load.image("buico_4", "/tree/shrub_4.png");

  // 🪨 Rocks
  scene.load.image("cucda_1", "/rock/rock_1.png");
  scene.load.image("cucda_2", "/rock/rock_2.png");
  scene.load.image("cucda_3", "/rock/rock_3.png");
  scene.load.image("cucda_4", "/rock/rock_4.png");

  //==========================================================================//

  // 🧍 Knight Players (Knight 1, 2, 3)
  scene.load.spritesheet("kiemsi_dung", "/player/knight_1/Idle.png", {
    frameWidth: 96,
    frameHeight: 96,
  });
  scene.load.spritesheet("kiemsi_chay", "/player/knight_1/Run.png", {
    frameWidth: 96,
    frameHeight: 96,
  });
  scene.load.spritesheet("kiemsi_nhay", "/player/knight_1/Jump.png", {
    frameWidth: 96,
    frameHeight: 96,
  });
  scene.load.spritesheet("kiemsi_danh", "/player/knight_1/Attack.png", {
    frameWidth: 96,
    frameHeight: 96,
  });

  //---------------------

  scene.load.spritesheet("thosan_dung", "/player/knight_2/Idle.png", {
    frameWidth: 96,
    frameHeight: 96,
  });
  scene.load.spritesheet("thosan_chay", "/player/knight_2/Run.png", {
    frameWidth: 96,
    frameHeight: 96,
  });
  scene.load.spritesheet("thosan_nhay", "/player/knight_2/Jump.png", {
    frameWidth: 96,
    frameHeight: 96,
  });
  scene.load.spritesheet("thosan_danh", "/player/knight_2/Attack.png", {
    frameWidth: 96,
    frameHeight: 96,
  });

  //---------------------

  scene.load.spritesheet("kisi_dung", "/player/knight_3/Idle.png", {
    frameWidth: 96,
    frameHeight: 96,
  });
  scene.load.spritesheet("kisi_chay", "/player/knight_3/Run.png", {
    frameWidth: 96,
    frameHeight: 96,
  });
  scene.load.spritesheet("kisi_nhay", "/player/knight_3/Jump.png", {
    frameWidth: 96,
    frameHeight: 96,
  });
  scene.load.spritesheet("kisi_danh", "/player/knight_3/Jump.png", {
    frameWidth: 96,
    frameHeight: 96,
  });

  //==========================================================================//

  //---------------------
  // 🧌 Monster - Orc 1
  scene.load.spritesheet("orcxanh_dung", "/monster/Orc_1/Idle.png", {
    frameWidth: 96,
    frameHeight: 96,
  });
  scene.load.spritesheet("orcxanh_chay", "/monster/Orc_1/Run.png", {
    frameWidth: 96,
    frameHeight: 96,
  });
  scene.load.spritesheet("orcxanh_nhay", "/monster/Orc_1/Jump.png", {
    frameWidth: 96,
    frameHeight: 96,
  });
  scene.load.spritesheet("orcxanh_danh", "/monster/Orc_1/Attack.png", {
    frameWidth: 96,
    frameHeight: 96,
  });
  
  //---------------------
  // 🧌 Monster - Orc 2
  scene.load.spritesheet("orccam_dung", "/monster/Orc_2/Idle.png", {
    frameWidth: 96,
    frameHeight: 96,
  });
  scene.load.spritesheet("orccam_chay", "/monster/Orc_2/Run.png", {
    frameWidth: 96,
    frameHeight: 96,
  });
  scene.load.spritesheet("orccam_nhay", "/monster/Orc_2/Jump.png", {
    frameWidth: 96,
    frameHeight: 96,
  });
  scene.load.spritesheet("orccam_danh", "/monster/Orc_2/Attack.png", {
    frameWidth: 96,
    frameHeight: 96,
  });

  //---------------------
  // 🧌 Monster - Orc 3
  scene.load.spritesheet("orcdo_dung", "/monster/Orc_3/Idle.png", {
    frameWidth: 96,
    frameHeight: 96,
  });
  scene.load.spritesheet("orcdo_chay", "/monster/Orc_3/Run.png", {
    frameWidth: 96,
    frameHeight: 96,
  });
  scene.load.spritesheet("orcdo_nhay", "/monster/Orc_3/Jump.png", {
    frameWidth: 96,
    frameHeight: 96,
  });
  scene.load.spritesheet("orcdo_danh", "/monster/Orc_3/Attack.png", {
    frameWidth: 96,
    frameHeight: 96,
  });

  //---------------------
  // 🧌 Monster - Skeleton
  scene.load.spritesheet("boxuong_dung", "/monster/Skeleton/Idle.png", {
    frameWidth: 128,
    frameHeight: 128,
  });
  scene.load.spritesheet("boxuong_chay", "/monster/Skeleton/Run.png", {
    frameWidth: 128,
    frameHeight: 128,
  });
  scene.load.spritesheet("boxuong_nhay", "/monster/Skeleton/Jump.png", {
    frameWidth: 128,
    frameHeight: 128,
  });
  scene.load.spritesheet("boxuong_danh", "/monster/Skeleton/Attack_1.png", {
    frameWidth: 128,
    frameHeight: 128,
  });

  //==========================================================================//

  //---------------------
  // 🧟 Boss - Minotaur 1
  scene.load.spritesheet("traubac_dung", "/boss/Minotaur_1/Idle.png", {
    frameWidth: 128,
    frameHeight: 128,
  });
  scene.load.spritesheet("traubac_chay", "/boss/Minotaur_1/Run.png", {
    frameWidth: 128,
    frameHeight: 128,
  });
  scene.load.spritesheet("traubac_danh", "/boss/Minotaur_1/Attack.png", {
    frameWidth: 128,
    frameHeight: 128,
  });

  //---------------------
  // 🧟 Boss - Minotaur 2
  scene.load.spritesheet("trauvang_dung", "/boss/Minotaur_2/Idle.png", {
    frameWidth: 128,
    frameHeight: 128,
  });
  scene.load.spritesheet("trauvang_chay", "/boss/Minotaur_2/Run.png", {
    frameWidth: 128,
    frameHeight: 128,
  });
  scene.load.spritesheet("trauvang_danh", "/boss/Minotaur_2/Attack.png", {
    frameWidth: 128,
    frameHeight: 128,
  });

  //---------------------
  // 🧟 Boss - Fire_Spirit
  scene.load.spritesheet("quylua_dung", "/boss/Fire_Spirit/Idle_2.png", {
    frameWidth: 128,
    frameHeight: 128,
  });
  scene.load.spritesheet("quylua_chay", "/boss/Fire_Spirit/Run.png", {
    frameWidth: 128,
    frameHeight: 128,
  });
  scene.load.spritesheet("quylua_danh", "/boss/Fire_Spirit/Flame.png", {
    frameWidth: 128,
    frameHeight: 128,
  });

  //---------------------
  // 🧟 Boss - Plent
  scene.load.spritesheet("quycay_dung", "/boss/Plent/Idle.png", {
    frameWidth: 128,
    frameHeight: 128,
  });
  scene.load.spritesheet("quycay_chay", "/boss/Plent/Walk.png", {
    frameWidth: 128,
    frameHeight: 128,
  });
  scene.load.spritesheet("quycay_danh", "/boss/Plent/Poison.png", {
    frameWidth: 128,
    frameHeight: 128,
  });

  //==========================================================================//

  // ⚔️ Items
  scene.load.image("kiem", "/items/sword.png");
  scene.load.image("riu", "/items/axe.png");
  scene.load.image("thuong", "/items/spear.png");
  scene.load.image("tim", "/items/heart.png");
}
