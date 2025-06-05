import * as Phaser from "phaser";

export function createStudentAPI(scene: Phaser.Scene): Record<string, any> {
  const sandbox: Record<string, any> = {};

  // === Core APIs from BOOK 1 ===

  // 1. Set background
  sandbox.setBackground = (bgKey: string) => {
    scene.add.image(0, 0, bgKey).setOrigin(0).setScale(0.51);
  };

  // Set floor (tự động thêm vào platforms, tạo platforms nếu chưa có)
sandbox.setFloor = (
  floorKey: string,
  x: number,
  y: number,
  refName: string = "floor"
) => {
  if (!sandbox.platforms) {
    sandbox.platforms = scene.physics.add.staticGroup();
  }
  const floor = scene.physics.add.staticSprite(x, y, floorKey)
    .setScale(0.67)
    .refreshBody();
  sandbox[refName] = floor;
  sandbox.platforms.add(floor);
  return floor;
};

  // Set màu cho đối tượng dựa trên key và màu định danh
  sandbox.setColor = (refName: string, colorName: string) => {
    const sprite = sandbox[refName];
    if (!sprite) {
      console.warn(`Không tìm thấy đối tượng với key '${refName}'`);
      return;
    }
    const colorMap: Record<string, number> = {
      green: 0x00ff00,
      blue: 0x0000ff,
      red: 0xff0000,
      yellow: 0xffff00,
      purple: 0x800080,
      orange: 0xffa500,
      pink: 0xff69b4,
      white: 0xffffff,
      black: 0x000000,
      gray: 0x808080,
    };
    const key = colorName.toLowerCase().replace(/\s/g, "");
    const tint = colorMap[key];
    if (!tint) {
      console.warn(
        `Màu '${colorName}' không hợp lệ. Các màu hợp lệ là: ${Object.keys(
          colorMap
        ).join(", ")}`
      );
      return;
    }
    sprite.setTint(tint);
  };

  // // 4. Spawn character with animation (optional)
  // sandbox.spawn = (
  //   spriteKey: string,
  //   x: number,
  //   y: number,
  //   options: { animation?: string },
  //   refName: string
  // ) => {
  //   const sprite = scene.physics.add.sprite(
  //     x,
  //     y,
  //     spriteKey
  //   ) as Phaser.GameObjects.Sprite;
  //   sandbox[refName] = sprite;
  //   if (options?.animation) {
  //     const animationKey = `${spriteKey}_${options.animation}`;
  //     sprite.anims.play(animationKey, true);
  //   }
  //   return sprite;
  // };

  //4. Spawn character with animation (optional)
  sandbox.spawn = (
    spriteKey: string,
    x: number,
    y: number,
    options: { animation?: string },
    refName: string
  ) => {
    const sprite = scene.physics.add.sprite(
      x,
      y,
      spriteKey
    ) as Phaser.GameObjects.Sprite;
    sandbox[refName] = sprite;
    if (options?.animation) {
      sprite.anims.play(options.animation, true);
    }
    scene.physics.add.collider(sprite, sandbox.platforms); // Thêm va chạm với platforms
    return sprite;
  };

  //5. Spawn random character
  sandbox.spawnRandom = (
    spriteKey: string,
    xMin: number,
    xMax: number,
    y: number,
    refName: string,
    interval: number
  ) => {
    const spawnItem = () => {
      const x = Phaser.Math.Between(xMin, xMax);
      const sprite = scene.physics.add.sprite(
        x,
        y,
        spriteKey
      ) as Phaser.GameObjects.Sprite;
      sandbox[refName] = sprite;
      scene.physics.add.collider(sprite, sandbox.platforms); // Thêm va chạm với platforms
    };
    scene.time.addEvent({
      delay: interval,
      loop: true,
      callback: spawnItem,
    });
    spawnItem(); // Spawn ngay lần đầu
  };

  // 6. Set name
  sandbox.setName = (refName: string, name: string) => {
    const sprite = sandbox[refName] as Phaser.GameObjects.Sprite;
    if (!sprite) return;
    scene.add
      .text(sprite.x, sprite.y - 50, name, {
        font: "20px Arial",
        color: "#ffffff",
      })
      .setOrigin(0.5);
  };

  // 7. Scale
  sandbox.scale = (refName: string, factor: number) => {
    const sprite = sandbox[refName] as Phaser.GameObjects.Sprite;
    if (!sprite || factor < 0.5 || factor > 2) return;
    sprite.setScale(factor);
  };

  // 8. Move
  sandbox.move = (refName: string, deltaX: number, deltaY: number) => {
    const sprite = sandbox[refName] as Phaser.GameObjects.Sprite;
    if (!sprite || Math.abs(deltaX) > 50 || Math.abs(deltaY) > 50) return;
    sprite.x += deltaX;
    sprite.y += deltaY;
  };

  // 9. Move random
  sandbox.moveRandom = (
    refName: string,
    xMin: number,
    xMax: number,
    timeMs: number
  ) => {
    const sprite = sandbox[refName] as Phaser.GameObjects.Sprite;
    if (!sprite || timeMs > 10000) return;
    scene.time.addEvent({
      delay: timeMs,
      loop: true,
      callback: () => {
        sprite.x = Phaser.Math.Between(xMin, xMax);
      },
    });
  };

  // 10. On key
  sandbox.onKey = (
    key: string,
    options: { animation?: string },
    refName: string,
    valueX: number,
    valueY: number
  ) => {
    const sprite = sandbox[refName] as Phaser.GameObjects.Sprite;
    if (!sprite || Math.abs(valueX) > 50 || Math.abs(valueY) > 50) return;
    const spriteKey = sprite.texture.key; // Lấy trực tiếp từ sprite
    scene.input.keyboard?.on("keydown-" + key.toUpperCase(), () => {
      if (options?.animation) {
        const animationKey = `${spriteKey}_${options.animation}`;
        sprite.anims.play(animationKey, true);
      }
      sprite.x += valueX;
      sprite.y += valueY;
    });
  };

  // 11. Interact
  sandbox.interact = (
    refName1: string,
    refName2: string,
    action: string,
    attribute: string,
    value: number
  ) => {
    const sprite1 = sandbox[refName1] as Phaser.GameObjects.Sprite;
    const sprite2 = sandbox[refName2] as Phaser.GameObjects.Sprite;
    if (!sprite1 || !sprite2 || Math.abs(value) > 10) return;
    scene.physics.add.overlap(sprite1, sprite2, () => {
      if (action === "gain" && attribute === "power") {
        scene.events.emit("stat-upgrade", { stat: "power", value });
      }
      if (action === "lose" && attribute === "hp") {
        scene.events.emit("lose-health", value);
      }
    });
  };


  //12. Auto Attack
  sandbox.autoAttack = (
    refName: string,
    range: number,
    skillKey: string,
    damage: number,
    cooldown: number
  ) => {
    const shooter = sandbox[refName] as Phaser.GameObjects.Sprite;
    if (!shooter || !skillHandlers[skillKey]) return;
  
    scene.time.addEvent({
      delay: cooldown,
      loop: true,
      callback: () => {
        skillHandlers[skillKey](scene, shooter, range, damage);
      }
    });
  };
  
  
  // 13. When
  sandbox.when = (
    condition: string,
    value: number,
    action: string,
    effect: string
  ) => {
    scene.events.on("check-condition", () => {
      const health = (scene as any)[condition] || 0;
      if (health === value) {
        if (action === "effect" && effect === "victory") {
          scene.add.sprite(400, 240, "victory_effect");
        }
        if (action === "effect" && effect === "lose") {
          scene.add.sprite(400, 240, "lose_effect");
        }
      }
    });
  };

  // 14. Set health
  sandbox.setHealth = (refName: string, health: number) => {
    const sprite = sandbox[refName] as Phaser.GameObjects.Sprite;
    if (!sprite || health > 100) return;
    (scene as any)[`${refName}.health`] = health;
    scene.events.emit("update-health", { refName, health });
  };

  // 15. Start timer
  sandbox.startTimer = (duration: number) => {
    if (duration > 600000) return; // Giới hạn 10 phút
    scene.time.delayedCall(duration, () => {
      scene.events.emit("check-condition");
      if (
        !scene.children.list.some(
          (c) =>
            (c as Phaser.GameObjects.Sprite).texture.key === "victory_effect"
        )
      ) {
        scene.add.sprite(400, 240, "game_over");
      }
    });
  };

//===================================================================================================================================================//

  //hàm skill
  const skillHandlers: Record<
  string,
  (scene: Phaser.Scene, shooter: Phaser.GameObjects.Sprite, range: number, damage: number) => void
> = {
  fireball: (scene, shooter, range, damage) => {
    const direction = shooter.flipX ? -1 : 1;

    const fireball = scene.physics.add.sprite(shooter.x, shooter.y, "fireball")
      .setScale(1)
      .setAngle(direction > 0 ? 180 : 0) // 🔁 Quay góc theo hướng
      .setVelocityX(direction * 300)
      .setGravity(0, 0);

    fireball.body.allowGravity = false;

    // Bay hết quãng đường rồi biến mất
    const travelTime = (range / 300) * 1000;
    scene.time.delayedCall(travelTime, () => fireball.destroy());

    // Gây sát thương khi chạm bất kỳ đối tượng nào (trừ bản thân)
    scene.physics.add.overlap(fireball, scene.children.list, (skillObj, targetObj) => {
      const target = targetObj as Phaser.GameObjects.Sprite;
      if (target === shooter || target === fireball) return;

      const targetKey = Object.keys(sandbox).find(k => sandbox[k] === target);
      if (!targetKey) return;

      const currHealth = (scene as any)[`${targetKey}.health`] ?? 100;
      const newHealth = Math.max(0, currHealth - damage);

      (scene as any)[`${targetKey}.health`] = newHealth;
      scene.events.emit("update-health", { refName: targetKey, health: newHealth });

      fireball.destroy();
    });
  },

};



  return sandbox;
}
