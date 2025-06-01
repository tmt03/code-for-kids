// frontend/quests/questBaseCodeFunctions.ts

/**
 * Trả về đoạn mã khởi tạo scene (dưới dạng hàm) cho mỗi quest cụ thể.
 * Dùng cho chế độ "guided" hoặc preview quest.
 */

export const baseCodeFunctions: Record<string, (scene: any, sandbox: any) => void> = {
    C00_H01: (scene, sandbox) => {
      scene.bg = scene.add.image(0, 0, "background_no_color")
        .setOrigin(0)
        .setScale(0.51);
    },
  
    C00_H02: (scene, sandbox) => {
      scene.bg = scene.add.image(0, 0, "blue_sky")
        .setOrigin(0)
        .setScale(0.51);
        
    },
  
    C01_Q01: (scene, sandbox) => {
      scene.bg = scene.add.image(0, 0, "blue_sky")
        .setOrigin(0)
        .setScale(0.6);
  
      scene.floor = scene.add.image(425, 453, "ground_2")
        .setScale(0.67);
  
      const castle = scene.add.image(410, 293, "castle")
        .setOrigin(0.5)
        .setScale(0.3);
  
      scene["castle"] = castle;
      sandbox["castle"] = castle;
    },
  
    C01_Q02: (scene, sandbox) => {
      scene.bg = scene.add.image(0, 0, "blue_sky")
        .setOrigin(0)
        .setScale(0.51);
  
      const floor = scene.physics.add.staticSprite(425, 453, "ground_2")
        .setScale(0.67)
        .refreshBody();
  
      scene.floor = floor;
      sandbox["floor"] = floor;
      sandbox.platforms.add(floor);
  
      const castle = scene.add.image(640, 130, "castle")
        .setOrigin(0.5)
        .setScale(0.3);
  
      scene["castle"] = castle;
      sandbox["castle"] = castle;
    },
  
    C01_Q03: (scene, sandbox) => {
      scene.bg = scene.add.image(0, 0, "blue_sky")
        .setOrigin(0)
        .setScale(0.51);
  
      scene.floor = scene.add.image(425, 453, "ground_2")
        .setScale(0.67);
  
      const castle = scene.add.image(410, 293, "castle")
        .setOrigin(0.5)
        .setScale(0.3);
  
      scene["castle"] = castle;
      sandbox["castle"] = castle;
    },
  
    C01_Q04: (scene, sandbox) => {
      scene.bg = scene.add.image(0, 0, "blue_sky")
        .setOrigin(0)
        .setScale(0.51);
  
      scene.floor = scene.add.image(425, 453, "ground_2")
        .setScale(0.67);
  
      const castle = scene.add.image(410, 293, "castle")
        .setOrigin(0.5)
        .setScale(0.3);
  
      scene["castle"] = castle;
      sandbox["castle"] = castle;
    },

    C02_Q01: (scene, sandbox) => {
        scene.bg = scene.add.image(0, 0, "blue_sky").setOrigin(0).setScale(0.51);
    
        const floor = scene.physics.add.staticImage(425, 453, "ground_2")
          .setScale(0.67)
          .refreshBody();
        scene.floor = floor;
        sandbox["floor"] = floor;
    
        const castle = scene.add.image(410, 293, "castle")
          .setOrigin(0.5)
          .setScale(0.3);
        scene["castle"] = castle;
        sandbox["castle"] = castle;
    
        const player = scene.physics.add.sprite(100, 100, "player_idle")
          .setScale(1)
          .setCollideWorldBounds(true);
        sandbox["player"] = player;
    
        scene.physics.add.collider(player, floor);
      },
    
      C02_Q02: (scene, sandbox) => {
        scene.bg = scene.add.image(0, 0, "blue_sky").setOrigin(0).setScale(0.51);
    
        const floor = scene.physics.add.staticImage(425, 453, "ground_2")
          .setScale(0.67)
          .refreshBody();
        scene.floor = floor;
        sandbox["floor"] = floor;
    
        const castle = scene.add.image(410, 293, "castle")
          .setOrigin(0.5)
          .setScale(0.3);
        scene["castle"] = castle;
        sandbox["castle"] = castle;
    
        const player = scene.physics.add.sprite(100, 100, "player_idle")
          .setScale(1)
          .setCollideWorldBounds(true);
        sandbox["player"] = player;
    
        scene.physics.add.collider(player, floor);
      },
    
      C02_Q03: (scene, sandbox) => {
        scene.bg = scene.add.image(0, 0, "blue_sky").setOrigin(0).setScale(0.51);
    
        const floor = scene.physics.add.staticImage(425, 453, "ground_2")
          .setScale(0.67)
          .refreshBody();
        scene.floor = floor;
        sandbox["floor"] = floor;
    
        const castle = scene.add.image(410, 293, "castle")
          .setOrigin(0.5)
          .setScale(0.3);
        scene["castle"] = castle;
        sandbox["castle"] = castle;
    
        const player = scene.physics.add.sprite(100, 100, "player_idle")
          .setScale(1)
          .setCollideWorldBounds(true);
        sandbox["player"] = player;
    
        scene.physics.add.collider(player, floor);
      },
    
      C02_Q04: (scene, sandbox) => {
        scene.bg = scene.add.image(0, 0, "blue_sky").setOrigin(0).setScale(0.51);
    
        const floor = scene.physics.add.staticImage(425, 453, "ground_2")
          .setScale(0.67)
          .refreshBody();
        scene.floor = floor;
        sandbox["floor"] = floor;
    
        const castle = scene.add.image(410, 293, "castle")
          .setOrigin(0.5)
          .setScale(0.3);
        scene["castle"] = castle;
        sandbox["castle"] = castle;
    
        const player = scene.physics.add.sprite(100, 100, "player_idle")
          .setScale(1)
          .setCollideWorldBounds(true);
        sandbox["player"] = player;
    
        scene.physics.add.collider(player, floor);
      },
    
      C03_Q01: (scene, sandbox) => {
        scene.bg = scene.add.image(0, 0, "plain_mountain").setOrigin(0).setScale(0.51);
    
        const floor = scene.physics.add.staticImage(425, 470, "ground_2")
          .setScale(0.67)
          .refreshBody();
        scene.floor = floor;
        sandbox["floor"] = floor;
    
        const player = scene.physics.add.sprite(100, 100, "player_idle")
          .setScale(1.5)
          .setCollideWorldBounds(true);
        sandbox["player"] = player;
    
        scene.physics.add.collider(player, floor);
      },
    
      C03_Q02: (scene, sandbox) => {
        scene.bg = scene.add.image(0, 0, "plain_mountain").setOrigin(0).setScale(0.51);
    
        const floor = scene.physics.add.staticImage(425, 470, "ground_2")
          .setScale(0.67)
          .refreshBody();
        scene.floor = floor;
        sandbox["floor"] = floor;
    
        const player = scene.physics.add.sprite(100, 100, "player_idle")
          .setScale(1.5)
          .setCollideWorldBounds(true);
        sandbox["player"] = player;
    
        scene.physics.add.collider(player, floor);
      },
    
      C03_Q03: (scene, sandbox) => {
        scene.bg = scene.add.image(0, 0, "plain_mountain").setOrigin(0).setScale(0.51);
    
        const floor = scene.physics.add.staticImage(425, 470, "ground_2")
          .setScale(0.67)
          .refreshBody();
        scene.floor = floor;
        sandbox["floor"] = floor;
    
        const player = scene.physics.add.sprite(100, 100, "player_idle")
          .setScale(1.5)
          .setCollideWorldBounds(true);
        sandbox["player"] = player;
    
        scene.physics.add.collider(player, floor);
      },
    
      C03_Q04: (scene, sandbox) => {
        scene.bg = scene.add.image(0, 0, "plain_mountain").setOrigin(0).setScale(0.51);
    
        const floor = scene.physics.add.staticImage(425, 470, "ground_2")
          .setScale(0.67)
          .refreshBody();
        scene.floor = floor;
        sandbox["floor"] = floor;
    
        const win_flag = scene.physics.add.staticImage(250, 80, "win_flag")
          .setScale(0.2);
        scene.win_flag = win_flag;
        sandbox["win_flag"] = win_flag;
    
        const fly_ground_1 = scene.physics.add.staticImage(600, 130, "fly_ground")
          .setScale(0.15)
          .refreshBody();
        scene.fly_ground_1 = fly_ground_1;
        sandbox["fly_ground_1"] = fly_ground_1;
    
        const fly_ground_2 = scene.physics.add.staticImage(800, 230, "fly_ground")
          .setScale(0.15)
          .refreshBody();
        scene.fly_ground_2 = fly_ground_2;
        sandbox["fly_ground_2"] = fly_ground_2;
    
        const fly_ground_3 = scene.physics.add.staticImage(670, 300, "fly_ground")
          .setScale(0.15)
          .refreshBody();
        scene.fly_ground_3 = fly_ground_3;
        sandbox["fly_ground_3"] = fly_ground_3;
    
        const fly_ground_4 = scene.physics.add.staticImage(540, 370, "fly_ground")
          .setScale(0.15)
          .refreshBody();
        scene.fly_ground_4 = fly_ground_4;
        sandbox["fly_ground_4"] = fly_ground_4;
    
        const fly_ground_5 = scene.physics.add.staticImage(300, 130, "fly_ground")
          .setScale(0.15)
          .refreshBody();
        scene.fly_ground_5 = fly_ground_5;
        sandbox["fly_ground_5"] = fly_ground_5;
    
        const player = scene.physics.add.sprite(100, 100, "player_idle")
          .setScale(1)
          .setCollideWorldBounds(true);
        sandbox["player"] = player;
    
        scene.physics.add.collider(player, floor);
        scene.physics.add.collider(player, fly_ground_1);
        scene.physics.add.collider(player, fly_ground_2);
        scene.physics.add.collider(player, fly_ground_3);
        scene.physics.add.collider(player, fly_ground_4);
        scene.physics.add.collider(player, fly_ground_5);
      },

      C04_Q01: (scene, sandbox) => {
        scene.bg = scene.add.image(0, 0, "sunset_sky").setOrigin(0).setScale(0.51);
    
        const floor = scene.physics.add.staticImage(425, 470, "ground_2")
          .setScale(0.67)
          .refreshBody();
        scene.floor = floor;
        sandbox["floor"] = floor;
    
        const monster = scene.physics.add.sprite(100, 100, "monster_idle")
          .setScale(1.5)
          .setCollideWorldBounds(true);
        sandbox["monster"] = monster;
    
        scene.physics.add.collider(monster, floor);
      },
    
      C04_Q02: (scene, sandbox) => {
        scene.bg = scene.add.image(0, 0, "sunset_sky").setOrigin(0).setScale(0.51);
    
        const floor = scene.physics.add.staticImage(425, 470, "ground_2")
          .setScale(0.67)
          .refreshBody();
        scene.floor = floor;
        sandbox["floor"] = floor;
    
        const monster = scene.physics.add.sprite(100, 100, "monster_idle")
          .setScale(1.5)
          .setCollideWorldBounds(true);
        sandbox["monster"] = monster;
    
        scene.physics.add.collider(monster, floor);
      },
    
      C04_Q03: (scene, sandbox) => {
        scene.bg = scene.add.image(0, 0, "sunset_sky").setOrigin(0).setScale(0.51);
    
        const floor = scene.physics.add.staticImage(425, 470, "ground_2")
          .setScale(0.67)
          .refreshBody();
        scene.floor = floor;
        sandbox["floor"] = floor;
    
        const monster = scene.physics.add.sprite(100, 100, "monster_idle")
          .setScale(1.5)
          .setCollideWorldBounds(true);
        sandbox["monster"] = monster;
    
        scene.physics.add.collider(monster, floor);
      },
    
      C04_Q04: (scene, sandbox) => {
        scene.bg = scene.add.image(0, 0, "ice_mountain").setOrigin(0).setScale(0.51);
    
        const floor = scene.physics.add.staticImage(425, 470, "ground_2")
          .setScale(0.67)
          .refreshBody();
        scene.floor = floor;
        sandbox["floor"] = floor;
    
        const player = scene.physics.add.sprite(100, 100, "player_idle")
          .setScale(1.5)
          .setCollideWorldBounds(true);
        sandbox["player"] = player;
    
        scene.physics.add.collider(player, floor);
      },

      C05_Q01: (scene, sandbox) => {
        scene.bg = scene.add.image(0, 0, "blue_sky").setOrigin(0).setScale(0.51);
    
        const castle = scene.add.image(660, 293, "castle")
          .setOrigin(0.5)
          .setScale(0.3);
        scene["castle"] = castle;
        sandbox["castle"] = castle;
    
        const floor = scene.physics.add.staticImage(425, 453, "ground_2")
          .setScale(0.67)
          .refreshBody();
        scene.floor = floor;
        sandbox["floor"] = floor;
    
        const player = scene.physics.add.sprite(100, 100, "player_idle")
          .setScale(1.5)
          .setCollideWorldBounds(true);
    
        sandbox["player"] = player;
    
        scene.physics.add.collider(player, floor);
      },
    
      C05_Q02: (scene, sandbox) => {
        scene.bg = scene.add.image(0, 0, "blue_sky").setOrigin(0).setScale(0.51);
    
        const castle = scene.add.image(660, 293, "castle")
          .setOrigin(0.5)
          .setScale(0.3);
        scene["castle"] = castle;
        sandbox["castle"] = castle;
    
        const sword = scene.add.image(660, 293, "sword")
          .setOrigin(0.5)
          .setScale(0.3);
        scene["sword"] = sword;
        sandbox["sword"] = sword;
    
        const floor = scene.physics.add.staticImage(425, 453, "ground_2")
          .setScale(0.67)
          .refreshBody();
        scene.floor = floor;
        sandbox["floor"] = floor;
    
        const player = scene.physics.add.sprite(100, 100, "player_idle")
          .setScale(1.5)
          .setCollideWorldBounds(true);
    
        sandbox["player"] = player;
    
        scene.physics.add.collider(player, floor);
      },
    
      C05_Q03: (scene, sandbox) => {
        scene.bg = scene.add.image(0, 0, "blue_sky").setOrigin(0).setScale(0.51);
    
        const castle = scene.add.image(660, 293, "castle")
          .setOrigin(0.5)
          .setScale(0.3);
        scene["castle"] = castle;
        sandbox["castle"] = castle;
    
        const floor = scene.physics.add.staticImage(425, 453, "ground_2")
          .setScale(0.67)
          .refreshBody();
        scene.floor = floor;
        sandbox["floor"] = floor;
    
        const player = scene.physics.add.sprite(100, 100, "player_idle")
          .setScale(1.5)
          .setCollideWorldBounds(true);
    
        sandbox["player"] = player;
    
        scene.physics.add.collider(player, floor);
      },
    
      C05_Q04: (scene, sandbox) => {
        scene.bg = scene.add.image(0, 0, "blue_sky").setOrigin(0).setScale(0.51);
    
        const castle = scene.add.image(660, 293, "castle")
          .setOrigin(0.5)
          .setScale(0.3);
        scene["castle"] = castle;
        sandbox["castle"] = castle;
    
        const floor = scene.physics.add.staticImage(425, 453, "ground_2")
          .setScale(0.67)
          .refreshBody();
        scene.floor = floor;
        sandbox["floor"] = floor;
    
        const player = scene.physics.add.sprite(100, 100, "player_idle")
          .setScale(1.5)
          .setCollideWorldBounds(true);
    
        sandbox["player"] = player;
    
        scene.physics.add.collider(player, floor);
      },
    
      C05_Q05: (scene, sandbox) => {
        scene.bg = scene.add.image(0, 0, "blue_sky").setOrigin(0).setScale(0.51);
    
        const floor = scene.physics.add.staticImage(425, 453, "ground_2")
          .setScale(0.67)
          .refreshBody();
        scene.floor = floor;
        sandbox["floor"] = floor;
    
        const player = scene.physics.add.sprite(100, 100, "player_idle")
          .setScale(1.5)
          .setCollideWorldBounds(true);
    
        sandbox["player"] = player;
    
        scene.physics.add.collider(player, floor);
      },
    
      C06_Q01: (scene, sandbox) => {
        scene.bg = scene.add.image(0, 0, "blue_sky").setOrigin(0).setScale(0.51);
    
        const floor = scene.physics.add.staticImage(425, 453, "ground_2")
          .setScale(0.67)
          .refreshBody();
        scene.floor = floor;
        sandbox["floor"] = floor;
    
        const player = scene.physics.add.sprite(100, 100, "player_idle")
          .setScale(1.5)
          .setCollideWorldBounds(true);
    
        sandbox["player"] = player;
    
        scene.physics.add.collider(player, floor);
      },
    
      C06_Q02: (scene, sandbox) => {
        scene.bg = scene.add.image(0, 0, "blue_sky").setOrigin(0).setScale(0.51);
    
        const floor = scene.physics.add.staticImage(425, 453, "ground_2")
          .setScale(0.67)
          .refreshBody();
        scene.floor = floor;
        sandbox["floor"] = floor;
    
        const player = scene.physics.add.sprite(100, 100, "player_idle")
          .setScale(1.5)
          .setCollideWorldBounds(true);
    
        const boss = scene.physics.add.sprite(600, 100, "boss_idle")
          .setScale(1.5)
          .setCollideWorldBounds(true);
    
        sandbox["player"] = player;
        sandbox["boss"] = boss;
    
        scene.physics.add.collider(player, floor);
        scene.physics.add.collider(boss, floor);
      },
    
      C06_Q03: (scene, sandbox) => {
        scene.bg = scene.add.image(0, 0, "blue_sky").setOrigin(0).setScale(0.51);
    
        const floor = scene.physics.add.staticImage(425, 453, "ground_2")
          .setScale(0.67)
          .refreshBody();
        scene.floor = floor;
        sandbox["floor"] = floor;
    
        const player = scene.physics.add.sprite(100, 100, "player_idle")
          .setScale(1.5)
          .setCollideWorldBounds(true);
    
        const boss = scene.physics.add.sprite(600, 100, "boss_idle")
          .setScale(1.5)
          .setCollideWorldBounds(true);
    
        sandbox["player"] = player;
        sandbox["boss"] = boss;
    
        scene.physics.add.collider(player, floor);
        scene.physics.add.collider(boss, floor);
      },
    };

  export function getBaseCodeForQuest(questId: string): ((scene: any, sandbox: any) => void) | undefined {
    return baseCodeFunctions[questId];
  }
  