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
    
      // Dùng hàm setFloor để tạo floor và tự thêm vào platforms
      const floor = sandbox.setFloor("ground_2", 425, 453);
      scene.floor = floor;
    
      const castle = scene.add.image(410, 293, "castle")
        .setOrigin(0.5)
        .setScale(0.3);
    
      sandbox.castle = castle;
      scene.castle = castle;
    },

    C01_Q02: (scene, sandbox) => {
      scene.bg = scene.add.image(0, 0, "blue_sky")
        .setOrigin(0)
        .setScale(0.51);
    
      // Dùng hàm setFloor để tạo floor và tự thêm vào platforms
      const floor = sandbox.setFloor("ground_2", 425, 453);
      scene.floor = floor;
    },
    
  
    C01_Q03: (scene, sandbox) => {
      scene.bg = scene.add.image(0, 0, "blue_sky")
        .setOrigin(0)
        .setScale(0.51);
    
      // Tạo floor có vật lý và thêm vào platforms
      const floor = sandbox.setFloor("ground_2", 425, 453);
      scene.floor = floor;
    
      const castle = scene.add.image(410, 293, "castle")
        .setOrigin(0.5)
        .setScale(0.3);
    
      scene["castle"] = castle;
      sandbox["castle"] = castle;
    },
    
  
    C01_Q04: (scene, sandbox) => {

    },
    

    C02_Q01: (scene, sandbox) => {
      scene.bg = scene.add.image(0, 0, "blue_sky").setOrigin(0).setScale(0.51);
    
      const floor = sandbox.setFloor("ground_2", 425, 453);
      scene.floor = floor;
    
      const castle = scene.add.image(410, 293, "castle")
        .setOrigin(0.5)
        .setScale(0.3);
      scene["castle"] = castle;
      sandbox["castle"] = castle;
    
      // Spawn player sẵn (có thể xoá nếu để học sinh nhập lệnh)
      const player = scene.physics.add.sprite(100, 100, "player_idle")
        .setScale(1)
        .setCollideWorldBounds(true);
      sandbox["player"] = player;
      scene.physics.add.collider(player, sandbox.platforms);
    },
    
    C02_Q02: (scene, sandbox) => {
      scene.bg = scene.add.image(0, 0, "blue_sky").setOrigin(0).setScale(0.51);
    
      // Đảm bảo có platforms
      sandbox.platforms ??= scene.physics.add.staticGroup();
    
      // Dùng setFloor tự động thêm vào platforms
      const floor = sandbox.setFloor("ground_2", 425, 453);
      scene.floor = floor;
    
      const castle = scene.add.image(410, 293, "castle")
        .setOrigin(0.5)
        .setScale(0.3);
      scene["castle"] = castle;
      sandbox["castle"] = castle;
    
      const player = scene.physics.add.sprite(100, 100, "player_idle")
        .setScale(1)
        .setCollideWorldBounds(true);
      sandbox["player"] = player;
    
      scene.physics.add.collider(player, sandbox.platforms);
    },
    
    C02_Q03: (scene, sandbox) => {
      scene.bg = scene.add.image(0, 0, "blue_sky").setOrigin(0).setScale(0.51);
      sandbox.platforms ??= scene.physics.add.staticGroup();
    
      const floor = sandbox.setFloor("ground_2", 425, 453);
      scene.floor = floor;
    
      const castle = scene.add.image(410, 293, "castle")
        .setOrigin(0.5)
        .setScale(0.3);
      scene["castle"] = castle;
      sandbox["castle"] = castle;
    
      const player = scene.physics.add.sprite(100, 100, "player_idle")
        .setScale(1)
        .setCollideWorldBounds(true);
      sandbox["player"] = player;
    
      scene.physics.add.collider(player, sandbox.platforms);
    },
    
    C02_Q04: (scene, sandbox) => {
      scene.bg = scene.add.image(0, 0, "blue_sky").setOrigin(0).setScale(0.51);
      sandbox.platforms ??= scene.physics.add.staticGroup();
    
      const floor = sandbox.setFloor("ground_2", 425, 453);
      scene.floor = floor;
    
      const castle = scene.add.image(410, 293, "castle")
        .setOrigin(0.5)
        .setScale(0.3);
      scene["castle"] = castle;
      sandbox["castle"] = castle;
    
      const player = scene.physics.add.sprite(100, 100, "player_idle")
        .setScale(1)
        .setCollideWorldBounds(true);
      sandbox["player"] = player;
    
      scene.physics.add.collider(player, sandbox.platforms);
    },    
    
    C03_Q01: (scene, sandbox) => {
      scene.bg = scene.add.image(0, 0, "plain_mountain").setOrigin(0).setScale(0.51);
    
      sandbox.platforms ??= scene.physics.add.staticGroup();
      const floor = sandbox.setFloor("ground_2", 425, 470);
      scene.floor = floor;
    
      const player = scene.physics.add.sprite(100, 100, "player_idle")
        .setScale(1.5)
        .setCollideWorldBounds(true);
      sandbox["player"] = player;
    
      scene.physics.add.collider(player, sandbox.platforms);
    },
    
    C03_Q02: (scene, sandbox) => {
      scene.bg = scene.add.image(0, 0, "plain_mountain").setOrigin(0).setScale(0.51);
    
      sandbox.platforms ??= scene.physics.add.staticGroup();
      const floor = sandbox.setFloor("ground_2", 425, 470);
      scene.floor = floor;
    
      const player = scene.physics.add.sprite(100, 100, "player_idle")
        .setScale(1.5)
        .setCollideWorldBounds(true);
      sandbox["player"] = player;
    
      scene.physics.add.collider(player, sandbox.platforms);
    },
    
    C03_Q03: (scene, sandbox) => {
      scene.bg = scene.add.image(0, 0, "plain_mountain").setOrigin(0).setScale(0.51);
    
      sandbox.platforms ??= scene.physics.add.staticGroup();
      const floor = sandbox.setFloor("ground_2", 425, 470);
      scene.floor = floor;
    
      const player = scene.physics.add.sprite(100, 100, "player_idle")
        .setScale(1.5)
        .setCollideWorldBounds(true);
      sandbox["player"] = player;
    
      scene.physics.add.collider(player, sandbox.platforms);
    },
    
    C03_Q04: (scene, sandbox) => {
      scene.bg = scene.add.image(0, 0, "plain_mountain").setOrigin(0).setScale(0.51);
    
      sandbox.platforms ??= scene.physics.add.staticGroup();
      const floor = sandbox.setFloor("ground_2", 425, 470);
      scene.floor = floor;
    
      const win_flag = scene.physics.add.staticImage(250, 80, "win_flag")
        .setScale(0.2);
      scene.win_flag = win_flag;
      sandbox["win_flag"] = win_flag;
      sandbox.platforms.add(win_flag);
    
      const flyGroundData = [
        [600, 130],
        [800, 230],
        [670, 300],
        [540, 370],
        [300, 130],
      ];
    
      flyGroundData.forEach(([x, y], index) => {
        const ref = `fly_ground_${index + 1}`;
        const g = scene.physics.add.staticImage(x, y, "fly_ground")
          .setScale(0.15)
          .refreshBody();
        scene[ref] = g;
        sandbox[ref] = g;
        sandbox.platforms.add(g);
      });
    
      const player = scene.physics.add.sprite(100, 100, "player_idle")
        .setScale(1)
        .setCollideWorldBounds(true);
      sandbox["player"] = player;
    
      scene.physics.add.collider(player, sandbox.platforms);
    },
    

    C04_Q01: (scene, sandbox) => {
      scene.bg = scene.add.image(0, 0, "sunset_sky").setOrigin(0).setScale(0.51);
    
      sandbox.platforms ??= scene.physics.add.staticGroup();
      const floor = sandbox.setFloor("ground_2", 425, 470);
      scene.floor = floor;
    
      const monster = scene.physics.add.sprite(100, 100, "monster_idle")
        .setScale(1.5)
        .setCollideWorldBounds(true);
      sandbox["monster"] = monster;
    
      scene.physics.add.collider(monster, sandbox.platforms);
    },
    
    C04_Q02: (scene, sandbox) => {
      scene.bg = scene.add.image(0, 0, "sunset_sky").setOrigin(0).setScale(0.51);
    
      sandbox.platforms ??= scene.physics.add.staticGroup();
      const floor = sandbox.setFloor("ground_2", 425, 470);
      scene.floor = floor;
    
      const monster = scene.physics.add.sprite(100, 100, "monster_idle")
        .setScale(1.5)
        .setCollideWorldBounds(true);
      sandbox["monster"] = monster;
    
      scene.physics.add.collider(monster, sandbox.platforms);
    },
    
    C04_Q03: (scene, sandbox) => {
      scene.bg = scene.add.image(0, 0, "sunset_sky").setOrigin(0).setScale(0.51);
    
      sandbox.platforms ??= scene.physics.add.staticGroup();
      const floor = sandbox.setFloor("ground_2", 425, 470);
      scene.floor = floor;
    
      const monster = scene.physics.add.sprite(100, 100, "monster_idle")
        .setScale(1.5)
        .setCollideWorldBounds(true);
      sandbox["monster"] = monster;
    
      scene.physics.add.collider(monster, sandbox.platforms);
    },
    
    C04_Q04: (scene, sandbox) => {
      scene.bg = scene.add.image(0, 0, "ice_mountain").setOrigin(0).setScale(0.51);
    
      sandbox.platforms ??= scene.physics.add.staticGroup();
      const floor = sandbox.setFloor("ground_2", 425, 470);
      scene.floor = floor;
    
      const player = scene.physics.add.sprite(100, 100, "player_idle")
        .setScale(1.5)
        .setCollideWorldBounds(true);
      sandbox["player"] = player;
    
      scene.physics.add.collider(player, sandbox.platforms);
    },    

    C05_Q01: (scene, sandbox) => {
      scene.bg = scene.add.image(0, 0, "blue_sky").setOrigin(0).setScale(0.51);
    
      const castle = scene.add.image(660, 293, "castle").setOrigin(0.5).setScale(0.3);
      scene.castle = castle;
      sandbox.castle = castle;
    
      sandbox.platforms ??= scene.physics.add.staticGroup();
      const floor = sandbox.setFloor("ground_2", 425, 453);
      scene.floor = floor;
    
      const player = scene.physics.add.sprite(100, 100, "player_idle")
        .setScale(1.5)
        .setCollideWorldBounds(true);
      sandbox.player = player;
    
      scene.physics.add.collider(player, sandbox.platforms);
    },
    
    C05_Q02: (scene, sandbox) => {
      scene.bg = scene.add.image(0, 0, "blue_sky").setOrigin(0).setScale(0.51);
    
      const castle = scene.add.image(660, 293, "castle").setOrigin(0.5).setScale(0.3);
      scene.castle = castle;
      sandbox.castle = castle;
    
      const sword = scene.add.image(660, 293, "sword").setOrigin(0.5).setScale(0.3);
      scene.sword = sword;
      sandbox.sword = sword;
    
      sandbox.platforms ??= scene.physics.add.staticGroup();
      const floor = sandbox.setFloor("ground_2", 425, 453);
      scene.floor = floor;
    
      const player = scene.physics.add.sprite(100, 100, "player_idle")
        .setScale(1.5)
        .setCollideWorldBounds(true);
      sandbox.player = player;
    
      scene.physics.add.collider(player, sandbox.platforms);
    },
    
    C05_Q03: (scene, sandbox) => {
      scene.bg = scene.add.image(0, 0, "blue_sky").setOrigin(0).setScale(0.51);
    
      const castle = scene.add.image(660, 293, "castle").setOrigin(0.5).setScale(0.3);
      scene.castle = castle;
      sandbox.castle = castle;
    
      sandbox.platforms ??= scene.physics.add.staticGroup();
      const floor = sandbox.setFloor("ground_2", 425, 453);
      scene.floor = floor;
    
      const player = scene.physics.add.sprite(100, 100, "player_idle")
        .setScale(1.5)
        .setCollideWorldBounds(true);
      sandbox.player = player;
    
      scene.physics.add.collider(player, sandbox.platforms);
    },
    
    C05_Q04: (scene, sandbox) => {
      scene.bg = scene.add.image(0, 0, "blue_sky").setOrigin(0).setScale(0.51);
    
      const castle = scene.add.image(660, 293, "castle").setOrigin(0.5).setScale(0.3);
      scene.castle = castle;
      sandbox.castle = castle;
    
      sandbox.platforms ??= scene.physics.add.staticGroup();
      const floor = sandbox.setFloor("ground_2", 425, 453);
      scene.floor = floor;
    
      const player = scene.physics.add.sprite(100, 100, "player_idle")
        .setScale(1.5)
        .setCollideWorldBounds(true);
      sandbox.player = player;
    
      scene.physics.add.collider(player, sandbox.platforms);
    },
    
    C05_Q05: (scene, sandbox) => {
      scene.bg = scene.add.image(0, 0, "blue_sky").setOrigin(0).setScale(0.51);
    
      sandbox.platforms ??= scene.physics.add.staticGroup();
      const floor = sandbox.setFloor("ground_2", 425, 453);
      scene.floor = floor;
    
      const player = scene.physics.add.sprite(100, 100, "player_idle")
        .setScale(1.5)
        .setCollideWorldBounds(true);
      sandbox.player = player;
    
      scene.physics.add.collider(player, sandbox.platforms);
    },
    
    
    C06_Q01: (scene, sandbox) => {
      scene.bg = scene.add.image(0, 0, "blue_sky").setOrigin(0).setScale(0.51);
    
      sandbox.platforms ??= scene.physics.add.staticGroup();
      const floor = sandbox.setFloor("ground_2", 425, 453);
      scene.floor = floor;
    
      const player = scene.physics.add.sprite(100, 100, "player_idle")
        .setScale(1.5)
        .setCollideWorldBounds(true);
      sandbox.player = player;
    
      scene.physics.add.collider(player, sandbox.platforms);
    },
    
    C06_Q02: (scene, sandbox) => {
      scene.bg = scene.add.image(0, 0, "blue_sky").setOrigin(0).setScale(0.51);
    
      sandbox.platforms ??= scene.physics.add.staticGroup();
      const floor = sandbox.setFloor("ground_2", 425, 453);
      scene.floor = floor;
    
      const player = scene.physics.add.sprite(100, 100, "player_idle")
        .setScale(1.5)
        .setCollideWorldBounds(true);
      const boss = scene.physics.add.sprite(600, 100, "boss_idle")
        .setScale(1.5)
        .setCollideWorldBounds(true);
      sandbox.player = player;
      sandbox.boss = boss;
    
      scene.physics.add.collider(player, sandbox.platforms);
      scene.physics.add.collider(boss, sandbox.platforms);
    },
    
    C06_Q03: (scene, sandbox) => {
      scene.bg = scene.add.image(0, 0, "blue_sky").setOrigin(0).setScale(0.51);
    
      sandbox.platforms ??= scene.physics.add.staticGroup();
      const floor = sandbox.setFloor("ground_2", 425, 453);
      scene.floor = floor;
    
      const player = scene.physics.add.sprite(100, 100, "player_idle")
        .setScale(1.5)
        .setCollideWorldBounds(true);
      const boss = scene.physics.add.sprite(600, 100, "boss_idle")
        .setScale(1.5)
        .setCollideWorldBounds(true);
      sandbox.player = player;
      sandbox.boss = boss;
    
      scene.physics.add.collider(player, sandbox.platforms);
      scene.physics.add.collider(boss, sandbox.platforms);
    }
  };

  export function getBaseCodeForQuest(questId: string): ((scene: any, sandbox: any) => void) | undefined {
    return baseCodeFunctions[questId];
  }
  