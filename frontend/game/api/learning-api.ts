import * as Phaser from "phaser";
import { allowedKeys } from "../constants/allowedKeys";

type HitboxOptions = {
  widthPercent?: number; // % chiều rộng sprite
  heightPercent?: number; // % chiều cao sprite
  offsetY?: number; // offset Y tùy chỉnh
  scaleFactor: number; // scale factor hiện tại
};

const setupHitbox = (
  sprite: Phaser.GameObjects.Sprite,
  options: HitboxOptions
) => {
  if (!sprite.body) {
    console.warn("Sprite không có physics body");
    return;
  }

  const {
    widthPercent = 0.5, // Mặc định 80% chiều rộng
    heightPercent = 0.5, // Mặc định 60% chiều cao
    offsetY = 0, // Mặc định không offset Y
    scaleFactor,
  } = options;

  // Tính toán kích thước hitbox
  const hitboxWidth = sprite.width * widthPercent;
  const hitboxHeight = sprite.height * heightPercent;
  const offsetX = (sprite.width - hitboxWidth) / 2; // Căn giữa theo chiều ngang
  const finalOffsetY = sprite.height - hitboxHeight + offsetY; // Sát dưới chân sprite

  // Cấu hình hitbox
  if (sprite.body instanceof Phaser.Physics.Arcade.Body) {
    sprite.body.setSize(hitboxWidth, hitboxHeight);
    sprite.body.setOffset(offsetX, finalOffsetY);
    sprite.body.updateBounds();
  }

  // Lưu kích thước hitbox gốc để sử dụng khi scale
  sprite.setData("originalHitbox", {
    width: hitboxWidth,
    height: hitboxHeight,
    offsetX,
    offsetY: finalOffsetY,
    widthPercent,
    heightPercent,
  });

  console.log(
    `Hitbox configured for sprite: width=${hitboxWidth}, height=${hitboxHeight}, ` +
      `offsetX=${offsetX}, offsetY=${finalOffsetY}`
  );
};

//==============================================================================//
//API GAME
export function createStudentAPI(
  scene: Phaser.Scene,
  scaleFactor: number
): Record<string, any> {
  const sandbox: Record<string, any> = {};
  sandbox.platforms = scene.physics.add.staticGroup();
  sandbox.controls = []; // Lưu các lệnh điều khiển
  sandbox.attackControls = []; // Lưu các lệnh tấn công

  // === Core APIs from BOOK 1 ===

  // 1. Set background - DONE
  sandbox.setBackground = (bgKey: string) => {
    scene.add
      .image(0, 0, bgKey)
      .setOrigin(0)
      .setScale(scaleFactor * 0.55)
      .setDepth(0);
  };

  // 2. Set floor (tự động thêm vào platforms) - DONE
  sandbox.setFloor = (
    floorKey: string,
    x: number,
    y: number,
    refName = "floor"
  ) => {
    const scaledX = x * scaleFactor;
    const scaledY = y * scaleFactor;
    const floor = scene.physics.add
      .staticSprite(scaledX, scaledY, floorKey)
      .setOrigin(0, 0)
      .setDepth(1)
      .setDisplaySize(340 * scaleFactor, 40 * scaleFactor)
      .refreshBody();
    floor.body.checkCollision.up = true;
    floor.body.checkCollision.down = true;
    floor.body.checkCollision.left = true;
    floor.body.checkCollision.right = true;
    sandbox[refName] = floor;
    sandbox.platforms.add(floor);
    console.log(
      `Floor '${floorKey}' set at (${scaledX}, ${scaledY}) with size (${
        340 * scaleFactor
      }, ${40 * scaleFactor})`
    );
    console.log("Platforms after setFloor:", sandbox.platforms.getChildren());
    return floor;
  };

  // 3. steColor - thay đổi màu sắc - DONE
  sandbox.setColor = (refName: string, colorName: string) => {
    const sprite = sandbox[refName];
    if (!sprite) {
      console.warn(`Không tìm thấy đối tượng với key '${refName}'`);
      return;
    }

    // Danh sách màu mở rộng
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
      teal: 0x008080,
      navy: 0x000080,
      maroon: 0x800000,
      olive: 0x808000,
      lime: 0x00ff00,
      aqua: 0x00ffff,
      silver: 0xc0c0c0,
      gold: 0xffd700,
      indigo: 0x4b0082,
      violet: 0xee82ee,
    };

    const key = colorName.toLowerCase().replace(/\s/g, "");

    // Kiểm tra HEX color
    if (key.startsWith("#") && key.length === 7) {
      const hex = parseInt(key.substring(1), 16);
      if (!isNaN(hex)) {
        sprite.setTint(hex);
        return;
      }
    }

    // Kiểm tra trong colorMap
    const tint = colorMap[key];
    if (!tint) {
      console.warn(
        `Màu '${colorName}' không hợp lệ. Các màu hợp lệ là: ${Object.keys(
          colorMap
        ).join(", ")} hoặc mã HEX (ví dụ: #FF0000)`
      );
      return;
    }
    sprite.setTint(tint);
  };

  // Lệnh spawn - Tích hợp hitbox mặc định
  sandbox.spawn = (
    spriteKey: string,
    x: number,
    y: number,
    options: { animation?: string },
    refName: string
  ) => {
    const scaledX = x * scaleFactor;
    const scaledY = y * scaleFactor;
    const sprite = scene.physics.add.sprite(scaledX, scaledY, spriteKey);
    sprite
      .setScale(scaleFactor * 1)
      .setDepth(2)
      .setGravityY(1000)
      .setCollideWorldBounds(true);
    sandbox[refName] = sprite;

    // Thêm animation mặc định là "idle" nếu không có animation
    const animationToPlay = options?.animation
      ? `${spriteKey}_${options.animation}`
      : `${spriteKey}_idle`;

    if (sprite.anims.get(animationToPlay)) {
      sprite.anims.play(animationToPlay, true);
    } else {
      console.warn(
        `Animation '${animationToPlay}' không tồn tại cho '${spriteKey}'`
      );
    }

    // Sử dụng setupHitbox để cấu hình hitbox
    setupHitbox(sprite, { scaleFactor });

    console.log(
      `Player '${spriteKey}' spawned at (${scaledX}, ${scaledY}) with scale ${scaleFactor}`
    );
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

      // Thêm hitbox cho sprite
      setupHitbox(sprite, { scaleFactor });

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

  // 6. Set name - DONE
  sandbox.setName = (refName: string, name: string) => {
    const sprite = sandbox[refName] as Phaser.GameObjects.Sprite;
    if (!sprite) {
      console.warn(`Không tìm thấy đối tượng với key '${refName}'`);
      return;
    }

    // Tạo container để chứa tên
    const container = scene.add.container(
      sprite.x,
      sprite.y - 40 * scaleFactor
    );
    container.setDepth(3); // Đảm bảo tên hiển thị trên sprite

    // Tạo nền cho tên
    const background = scene.add.rectangle(
      0,
      0,
      50 * scaleFactor,
      20 * scaleFactor,
      0x000000,
      0.7
    );
    container.add(background);

    // Tạo text cho tên
    const text = scene.add
      .text(0, 0, name, {
        font: `${20 * scaleFactor}px Arial`,
        color: "#ffffff",
      })
      .setOrigin(0.5);
    container.add(text);

    // Gắn container vào sprite để di chuyển cùng
    sprite.setData("nameContainer", container);

    // Lưu refName để theo dõi
    container.setData("refName", refName);

    // Cập nhật vị trí container khi sprite di chuyển
    const updateHandler = () => {
      const currentSprite = sandbox[refName] as Phaser.GameObjects.Sprite;
      if (
        currentSprite &&
        currentSprite.data &&
        currentSprite.data.get("nameContainer")
      ) {
        const currentContainer = currentSprite.data.get("nameContainer");
        currentContainer.setPosition(
          currentSprite.x,
          currentSprite.y - 40 * scaleFactor
        );
      } else {
        // Nếu sprite không còn, hủy container và gỡ sự kiện
        if (container.data.get("refName")) {
          container.destroy();
          scene.events.off("update", updateHandler); // Gỡ sự kiện khi sprite không còn
        }
      }
    };

    scene.events.on("update", updateHandler);

    console.log(`Đã đặt tên '${name}' cho sprite '${refName}'`);
  };

  // 7. Scale - Cập nhật hitbox khi scale sprite
  sandbox.scale = (refName: string, factor: number) => {
    const sprite = sandbox[refName] as Phaser.GameObjects.Sprite;
    if (!sprite) {
      console.warn(`Không tìm thấy đối tượng với key '${refName}'`);
      return;
    }
    if (factor < 0.5 || factor > 2) {
      console.warn(
        `Yêu cầu scale '${factor}' không hợp lệ. Giới hạn từ 0.5 đến 2.`
      );
      return;
    }

    // Lưu lại scale factor hiện tại
    const currentScale = sprite.scaleX;
    sprite.setScale(factor);

    // Lấy thông tin hitbox gốc
    const originalHitbox = sprite.data.get("originalHitbox");
    if (originalHitbox && sprite.body instanceof Phaser.Physics.Arcade.Body) {
      // Tính toán kích thước mới dựa trên kích thước gốc của sprite và tỷ lệ hitbox
      const originalWidth = sprite.width; // Lấy kích thước gốc của sprite
      const originalHeight = sprite.height;

      // Tính toán hitbox mới dựa trên kích thước gốc và tỷ lệ phần trăm
      const newHitboxWidth =
        originalWidth * originalHitbox.widthPercent * factor * 0.5;
      const newHitboxHeight =
        originalHeight * originalHitbox.heightPercent * factor * 0.5;

      // Tính toán offset mới
      const newOffsetX = (sprite.width - newHitboxWidth) / 2; // Căn giữa theo chiều ngang
      const newOffsetY = sprite.height - newHitboxHeight; // Sát dưới chân sprite

      // Cập nhật hitbox
      sprite.body.setSize(newHitboxWidth, newHitboxHeight);
      sprite.body.setOffset(newOffsetX, newOffsetY);
      sprite.body.updateBounds();

      // Cập nhật lại dữ liệu hitbox gốc với kích thước mới
      sprite.setData("originalHitbox", {
        ...originalHitbox,
        width: newHitboxWidth,
        height: newHitboxHeight,
        offsetX: newOffsetX,
        offsetY: newOffsetY,
      });

      console.log(
        `Updated hitbox for ${refName}: width=${newHitboxWidth}, height=${newHitboxHeight}, ` +
          `offsetX=${newOffsetX}, offsetY=${newOffsetY}`
      );
    }

    // Giữ nguyên kích thước của container tên, chỉ cập nhật vị trí
    const container = sprite.data.get("nameContainer");
    if (container) {
      container.setPosition(
        sprite.x,
        sprite.y - 40 * scaleFactor // Giữ offset cố định
      );
    }

    console.log(`Đã scale '${refName}' với factor ${factor}`);
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

  // 10. On key - DONE
  sandbox.onKey = (
    key: string,
    options: { animation?: string },
    refName: string,
    valueX: number,
    valueY: number
  ) => {
    const sprite = sandbox[refName] as Phaser.GameObjects.Sprite;
    if (!sprite) {
      console.warn(`Sprite with refName '${refName}' not found`);
      return;
    }
    if (!sprite.body) {
      console.warn(`Sprite '${refName}' has no physics body`);
      return;
    }
    if (Math.abs(valueX) > 500 || Math.abs(valueY) > 1000) {
      console.warn(`Velocity values for ${refName} exceed limit (1000)`);
      return;
    }
    const spriteKey = sprite.texture.key;
    const upperKey = key.toUpperCase();
    if (!allowedKeys[upperKey]) {
      console.warn(
        `Key '${key}' is not allowed. Allowed keys: ${Object.keys(
          allowedKeys
        ).join(", ")}`
      );
      return;
    }
    const keyCode = allowedKeys[upperKey];
    if (!Array.isArray(sandbox.controls)) sandbox.controls = [];
    sandbox.controls.push({
      key: keyCode,
      sprite: sprite,
      animation: options?.animation
        ? `${spriteKey}_${options.animation}`
        : null,
      velocityX: valueX * scaleFactor,
      velocityY: valueY * scaleFactor,
      refName: refName,
      isJumpKey: upperKey === "SPACE" || upperKey === "UP" || upperKey === "W",
    });
    console.log(
      `Added control for ${refName}: key=${key}, keyCode=${keyCode}, velocityX=${valueX}, velocityY=${valueY}`
    );
  };

  // 10b. On attack (lệnh mới) - DONE
  sandbox.onAttack = (
    key: string,
    config: { animation?: string },
    projectileType: string,
    refName: string,
    DAMAGE: number = 10 //mặc định
  ) => {
    const sprite = sandbox[refName] as Phaser.GameObjects.Sprite;
    if (!sprite) {
      console.warn(`Sprite '${refName}' không tồn tại trong sandbox`);
      return;
    }
    const upperKey = key.toUpperCase();
    if (!allowedKeys[upperKey]) {
      console.warn(
        `Key '${key}' is not allowed. Allowed keys: ${Object.keys(
          allowedKeys
        ).join(", ")}`
      );
      return;
    }
    const keyCode = allowedKeys[upperKey];
    if (!sandbox.attackControls) sandbox.attackControls = [];
    sandbox.attackControls.push({
      key: keyCode,
      sprite,
      refName,
      animation: config.animation,
      projectileType,
    });

    // Lắng nghe phím để kích hoạt tấn công
    scene.input.keyboard?.on("keydown-" + key.toUpperCase(), () => {
      if (config.animation) {
        sprite.anims.play(config.animation, true);
      }
      attackHandler(scene, sprite, projectileType, sandbox, DAMAGE);
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
      // Chỉ cho phép tăng power (nhặt vật phẩm) hoặc giảm hp (va chạm quái)
      if (action === "gain" && attribute === "power") {
        scene.events.emit("stat-upgrade", { stat: "power", value });
      } else if (action === "lose" && attribute === "hp") {
        scene.events.emit("lose-health", { refName: refName1, value });
      }
    });
  };

  //12. Auto Attack - (DONE)
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
      },
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
    (
      scene: Phaser.Scene,
      shooter: Phaser.GameObjects.Sprite,
      range: number,
      damage: number
    ) => void
  > = {
    fireball: (scene, shooter, range, damage) => {
      const direction = shooter.flipX ? -1 : 1;

      const fireball = scene.physics.add
        .sprite(shooter.x, shooter.y, "fireball")
        .setScale(1)
        .setAngle(direction > 0 ? 180 : 0) // 🔁 Quay góc theo hướng
        .setVelocityX(direction * 300)
        .setGravity(0, 0);

      fireball.body.allowGravity = false;

      // Bay hết quãng đường rồi biến mất
      const travelTime = (range / 300) * 1000;
      scene.time.delayedCall(travelTime, () => fireball.destroy());

      // Gây sát thương khi chạm bất kỳ đối tượng nào (trừ bản thân)
      scene.physics.add.overlap(
        fireball,
        scene.children.list,
        (skillObj, targetObj) => {
          const target = targetObj as Phaser.GameObjects.Sprite;
          if (target === shooter || target === fireball) return;

          const targetKey = Object.keys(sandbox).find(
            (k) => sandbox[k] === target
          );
          if (!targetKey) return;

          const currHealth = (scene as any)[`${targetKey}.health`] ?? 100;
          const newHealth = Math.max(0, currHealth - damage);

          (scene as any)[`${targetKey}.health`] = newHealth;
          scene.events.emit("update-health", {
            refName: targetKey,
            health: newHealth,
          });

          fireball.destroy();
        }
      );
    },
  };

  //==============================================================================//
  // Hàm xử lý tấn công
  const attackHandler = (
    scene: Phaser.Scene,
    shooter: Phaser.GameObjects.Sprite,
    projectileType: string,
    sandbox: Record<string, any>,
    DAMAGE: number // Truền vào từ attackHandler
  ) => {
    const direction = shooter.flipX ? -1 : 1;
    const projectile = scene.physics.add
      .sprite(shooter.x + (direction > 0 ? 10 : -10), shooter.y, projectileType)
      .setScale(0.25)
      .setVelocityX(direction * 300)
      .setGravity(0, 0);

    projectile.body.allowGravity = false;

    // Biến mất sau 1 giây
    scene.time.delayedCall(1000, () => projectile.destroy());

    // Gây sát thương cho các sprite va chạm (trừ người bắn, chính đạn, và platforms)
    scene.physics.add.overlap(
      projectile,
      scene.children.list,
      (skillObj, targetObj) => {
        const target = targetObj as Phaser.GameObjects.Sprite;
        if (target === shooter || target === projectile) return;

        // Kiểm tra xem target có phải là platform không
        const platforms = sandbox.platforms?.getChildren() || [];
        if (platforms.includes(target)) {
          projectile.destroy(); // Chỉ phá hủy đạn khi va chạm platform, không gây sát thương
          return;
        }

        // Tìm targetKey trong sandbox (cho các sprite như enemy)
        const targetKey = Object.keys(sandbox).find(
          (k) => sandbox[k] === target
        );
        if (!targetKey) return;

        // Lấy máu hiện tại và tính toán máu mới
        const currHealth = (scene as any)[`${targetKey}.health`] ?? 100;
        const newHealth = Math.max(0, currHealth - DAMAGE); // Sử dụng damage tùy chỉnh
        sandbox.setHealth(targetKey, newHealth); // Gọi setHealth để cập nhật máu

        // Hủy sprite nếu health <= 0
        if (newHealth <= 0 && target && target.destroy) {
          target.destroy();
          delete sandbox[targetKey]; // Xóa khỏi sandbox
        }

        projectile.destroy();
      }
    );
  };

  return sandbox;
}
