import * as Phaser from "phaser";
import { allowedKeys } from "../constants/allowedKeys";

type HitboxOptions = {
  widthPercent?: number; // % chiều rộng sprite
  heightPercent?: number; // % chiều cao sprite
  offsetY?: number; // offset Y tùy chỉnh
  scaleFactor: number; // scale factor hiện tại
};

type SkillOptions = {
  scene: Phaser.Scene;
  shooter: Phaser.GameObjects.Sprite;
  range: number;
  damage: number;
  direction?: number; // hướng bắn
  speed?: number;
  duration?: number;
  [key: string]: any;
};

const setupHitbox = (
  sprite: Phaser.GameObjects.Sprite,
  options: HitboxOptions
) => {
  if (!sprite.body || !(sprite.body instanceof Phaser.Physics.Arcade.Body)) {
    console.warn("Sprite không có Arcade physics body");
    return;
  }

  const {
    widthPercent = 0.5, // Mặc định 50% chiều rộng sprite
    heightPercent = 0.5, // Mặc định 50% chiều cao sprite
    offsetY = 0,
    scaleFactor = 1,
  } = options;

  const hitboxWidth = sprite.width * widthPercent;
  const hitboxHeight = sprite.height * heightPercent;
  const offsetX = (sprite.width - hitboxWidth) / 2;
  const finalOffsetY = sprite.height - hitboxHeight + offsetY;

  sprite.body.setSize(hitboxWidth, hitboxHeight);
  sprite.body.setOffset(offsetX, finalOffsetY);

  sprite.setData("originalHitbox", {
    width: hitboxWidth,
    height: hitboxHeight,
    offsetX,
    offsetY: finalOffsetY,
    widthPercent,
    heightPercent,
  });
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
  sandbox.stats = sandbox.stats || {};
  sandbox.statTexts = sandbox.statTexts || {};
  const lastHitTime: Record<string, number> = {}; // Biến kiểm soát cooldown va chạm

  // === Core APIs from BOOK 1 ===

  // 1. Set background - DONE
  sandbox.setBackground = (bgKey: string) => {
    scene.add
      .image(0, 0, bgKey)
      .setOrigin(0)
      .setScale(scaleFactor * 0.85)
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
    return floor;
  };

  // 3. steColor - thay đổi màu sắc - DONE
  sandbox.setColor = (refName: string, colorName: string) => {
    const sprite = sandbox[refName];
    if (!sprite) {
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

  // 4. Lệnh spawn - Tích hợp hitbox mặc định - DONE
  sandbox.spawn = (
    spriteKey: string,
    x: number,
    y: number,
    options: { animation?: string } = {},
    refName: string
  ) => {
    const scaledX = x * scaleFactor;
    const scaledY = y * scaleFactor;

    const sprite = scene.physics.add.sprite(scaledX, scaledY, spriteKey);
    sprite
      .setScale(scaleFactor)
      .setDepth(2)
      .setGravityY(1000)
      .setCollideWorldBounds(true);

    sandbox[refName] = sprite;

    const animationToPlay = options.animation
      ? `${spriteKey}_${options.animation}`
      : `${spriteKey}_idle`;

    if (scene.anims.exists(animationToPlay)) {
      sprite.anims.play(animationToPlay, true);
    } else {
      console.warn(
        `Animation '${animationToPlay}' không tồn tại cho '${spriteKey}'. Hãy kiểm tra lại tên animation trong animationConfigs.ts`
      );
    }

    // Gắn thêm metadata vào sprite
    (sprite as any).defaultAnimation = animationToPlay;
    (sprite as any).currentAnimState = "idle"; // idle | run | jump | attack

    sandbox[refName] = sprite;

    setupHitbox(sprite, { scaleFactor });

    return sprite;
  };

  //5. Spawn random character
  sandbox.spawnRandom = (
    spriteKey: string,
    xMin: number,
    xMax: number,
    y: number,
    refName: string,
    interval = 2000,
    maxEntities = 10
  ) => {
    if (!scene.textures.exists(spriteKey)) {
      console.error(`Sprite key '${spriteKey}' không tồn tại.`);
      return;
    }

    if (!sandbox[refName]) sandbox[refName] = [];

    // Thiết lập collider 1 lần với nhóm platform
    const platforms = sandbox.platforms;

    const spawnItem = () => {
      if (sandbox[refName].length >= maxEntities) {
        const oldest = sandbox[refName].shift();
        oldest?.destroy();
      }

      const x = Phaser.Math.Between(xMin, xMax) * scaleFactor;
      const yScaled = y * scaleFactor;

      const entity = scene.physics.add.sprite(x, yScaled, spriteKey);
      entity.setScale(0.2).setDepth(2).setGravityY(1000);

      if (platforms) {
        scene.physics.add.collider(entity, platforms);
      }

      setupHitbox(entity, { scaleFactor });

      scene.time.delayedCall(10000, () => {
        const idx = sandbox[refName].indexOf(entity);
        if (idx !== -1) {
          entity.destroy();
          sandbox[refName].splice(idx, 1);
        }
      });

      sandbox[refName].push(entity);
    };

    scene.time.addEvent({ delay: interval, loop: true, callback: spawnItem });
    spawnItem();
  };

  // 6. Set name - DONE
  sandbox.setName = (refName: string, name: string) => {
    const sprite = sandbox[refName];
    if (!sprite) {
      console.warn(`Không tìm thấy đối tượng với key '${refName}'`);
      return;
    }

    let container = sprite.getData("nameContainer");
    if (!container) {
      container = scene.add
        .container(sprite.x, sprite.y - 20 * scaleFactor)
        .setDepth(3);

      const text = scene.add
        .text(0, 0, name, {
          font: `${20 * scaleFactor}px Arial`,
          color: "#ffff00",
        })
        .setOrigin(0.5);

      container.add([text]);
      sprite.setData("nameContainer", container);

      scene.events.on("update", () => {
        if (sprite.active) {
          container.setPosition(sprite.x, sprite.y - 20 * scaleFactor);
        } else {
          container.destroy();
        }
      });
    } else {
      const text = container.list.find(
        (child: any) => child instanceof Phaser.GameObjects.Text
      );
      if (text) text.setText(name);
    }
  };

  // 7. Scale - Cập nhật hitbox khi scale sprite
  sandbox.scale = (refName: string, factor: number) => {
    const sprite = sandbox[refName] as Phaser.GameObjects.Sprite;
    if (!sprite) return;

    if (factor < 0.5 || factor > 2) return;

    // Lưu lại scale factor hiện tại
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
        sprite.y - 40 * factor // Giữ offset cố định
      );
    }

    console.log(`Đã scale '${refName}' với factor ${factor}`);
  };

  // 8. Move (to absolute position)
  sandbox.move = (refName: string, x: number, y: number) => {
    const sprite = sandbox[refName] as Phaser.GameObjects.Sprite;
    if (!sprite) return;

    sprite.x = x;
    sprite.y = y;
  };

  // 9. Move random
  sandbox.moveRandom = (
    refName: string,
    xMin: number,
    xMax: number,
    speed: number = 50,
    animKey: string = "run"
  ) => {
    const sprite = sandbox[refName] as Phaser.Physics.Arcade.Sprite;
    if (!sprite || !sprite.body) return;

    let direction = Math.random() < 0.5 ? -1 : 1;
    sprite.setVelocityX(direction * speed);
    sprite.flipX = direction < 0;

    const fullAnimKey = `${refName}_${animKey}`;
    // Bắt đầu animation nếu có
    if (sprite.anims && sprite.anims.currentAnim?.key !== animKey) {
      sprite.anims.play(fullAnimKey, true);
    }

    // Hàm kiểm tra vị trí và đổi hướng nếu vượt phạm vi
    const updateMove = () => {
      if (!sprite.body) return;
      if (sprite.x <= xMin) {
        sprite.setVelocityX(speed);
        sprite.flipX = false;
      } else if (sprite.x >= xMax) {
        sprite.setVelocityX(-speed);
        sprite.flipX = true;
      }
    };

    // Lưu lại interval để có thể dừng nếu cần
    const moveEvent = scene.time.addEvent({
      delay: 200,
      callback: updateMove,
      loop: true,
    });

    // Lưu lại event nếu muốn dừng sau này
    // sprite.moveEvent = moveEvent;
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
    if (!sprite || !sprite.body) return;

    if (Math.abs(valueX) > 500 || Math.abs(valueY) > 1000) {
      console.warn(`Velocity values for ${refName} exceed limit (1000)`);
      return;
    }
    const spriteKey = sprite.texture.key;
    const upperKey = key.toUpperCase();

    if (!allowedKeys[upperKey]) return;

    const keyCode = allowedKeys[upperKey];
    if (!Array.isArray(sandbox.controls)) sandbox.controls = [];

    const finalAnimation = options.animation
      ? `${spriteKey}_${options.animation}`
      : `${spriteKey}_run`;

    sandbox.controls.push({
      key: keyCode,
      sprite: sprite,
      animation: finalAnimation,
      velocityX: valueX * sprite.scaleX, //đảm bảo nhân vật nào to lên thì sẽ chạy nhanh/tốc độ nhảy lớn hơn
      velocityY: valueY * sprite.scaleY, //đảm bảo nhân vật nào to lên sẽ chạy nhanh/tốc độ nhảy lớn hơn
      refName: refName,
      isJumpKey: upperKey === "SPACE" || upperKey === "UP" || upperKey === "W",
    });

    // Tự động đổi animation idle nếu không bấm phím
    scene.input.keyboard?.on("keyup-" + upperKey, () => {
      const defaultAnim =
        (sprite as any).defaultAnimation || `${spriteKey}_idle`;
      if (scene.anims.exists(defaultAnim)) {
        sprite.anims.play(defaultAnim, true);
        (sprite as any).currentAnimState = "idle";
      }
      (sprite as any).setVelocityX(0);
    });

    // Khi bấm phím → play animation run
    scene.input.keyboard?.on("keydown-" + upperKey, () => {
      if (scene.anims.exists(finalAnimation)) {
        sprite.anims.play(finalAnimation, true);
        (sprite as any).currentAnimState = "run";
      }
    });
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
    if (!sprite) return;

    const upperKey = key.toUpperCase();
    if (!allowedKeys[upperKey]) return;

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
    scene.input.keyboard?.on("keydown-" + upperKey, () => {
      const anim = config.animation
        ? `${sprite.texture.key}_${config.animation}`
        : null;
      if (anim && scene.anims.exists(anim)) {
        sprite.anims.play(anim, true);
        (sprite as any).currentAnimState = "attack";

        // Sau 500ms, trở lại trạng thái idle hoặc run nếu đang di chuyển
        setTimeout(() => {
          if (!sprite.body) return;
          const vx = sprite.body.velocity.x;
          const nextAnim =
            Math.abs(vx) > 10
              ? `${sprite.texture.key}_run`
              : (sprite as any).defaultAnimation;
          if (scene.anims.exists(nextAnim)) {
            sprite.anims.play(nextAnim, true);
            (sprite as any).currentAnimState =
              Math.abs(vx) > 10 ? "run" : "idle";
          }
        }, 1000);
      }
      attackHandler(scene, sprite, projectileType, sandbox, DAMAGE);
    });
  };

  // 11. Interact -DONE
  sandbox.interact = (
    sourceRef: string,
    targetRef: string,
    effectType: "gain" | "lose",
    statKey: "hp" | "power",
    value: number
  ) => {
    const source = sandbox[sourceRef];
    const targetsGroup = sandbox[targetRef];
    if (!source || !targetsGroup) return;

    if (!sandbox.stats[sourceRef]) {
      sandbox.stats[sourceRef] = { hp: 100, power: 0 };
    }

    const processed = new WeakSet(); // để không bị overlap nhiều lần

    scene.time.addEvent({
      delay: 300, // mỗi 0.3 giây check lại
      loop: true,
      callback: () => {
        const targets = Array.isArray(targetsGroup)
          ? targetsGroup
          : [targetsGroup];

        targets.forEach((target: any) => {
          if (!target.body || processed.has(target)) return;

          scene.physics.add.overlap(source, target, () => {
            const now = scene.time.now;

            if (effectType === "lose") {
              if (lastHitTime[sourceRef] && now - lastHitTime[sourceRef] < 2000)
                return;
              lastHitTime[sourceRef] = now;

              const curr = sandbox.stats[sourceRef][statKey] ?? 0;
              const newVal = Math.max(0, curr - value);
              sandbox.stats[sourceRef][statKey] = newVal;
              sandbox.setStatDisplay(sourceRef);

              scene.tweens.add({
                targets: source,
                x: source.x + (source.x < target.x ? -20 : 20),
                duration: 500,
                ease: "power3",
              });

              if (statKey === "hp" && newVal <= 0 && source.destroy) {
                source.destroy();
                delete sandbox[sourceRef];
                delete sandbox.stats[sourceRef];
                if (sandbox.statTexts[sourceRef]) {
                  sandbox.statTexts[sourceRef].destroy();
                  delete sandbox.statTexts[sourceRef];
                }
              }
            } else if (effectType === "gain") {
              const curr = sandbox.stats[sourceRef][statKey] ?? 0;
              const newVal = curr + value;
              sandbox.stats[sourceRef][statKey] = newVal;
              sandbox.setStatDisplay(sourceRef);

              if (target.destroy) {
                target.destroy();
                if (Array.isArray(targetsGroup)) {
                  const idx = targetsGroup.indexOf(target);
                  if (idx !== -1) targetsGroup.splice(idx, 1);
                } else {
                  delete sandbox[targetRef];
                }

                delete sandbox.stats[targetRef];
                if (sandbox.statTexts[targetRef]) {
                  sandbox.statTexts[targetRef].destroy();
                  delete sandbox.statTexts[targetRef];
                }
              }
            }
          });

          processed.add(target); // đánh dấu đã gán overlap rồi
        });
      },
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
        // console.log(`🔁 AutoAttack check: ${refName}`);
        if ((sandbox.stats?.[refName]?.hp ?? 0) <= 0) return;
        skillHandlers[skillKey]({
          scene,
          shooter,
          range,
          damage,
        });
      },
    });
  };

  sandbox.when = (
    condition: string, // ví dụ: "power:kiemsi >= 200"
    action: "end", // hiện tại chỉ hỗ trợ "end"
    effect: "win" | "lose"
  ) => {
    const comparisonRegex = /^(\w+)(?::(\w+))?\s*(>=|<=|==|>|<)\s*(\d+)$/;
    const match = condition.match(comparisonRegex);

    if (!match) return;

    const [, statKey, refName, operator, valueStr] = match;
    const value = Number(valueStr);

    let hasEnded = false;

    scene.time.addEvent({
      delay: 200,
      loop: true,
      callback: () => {
        if (hasEnded) return;

        let statValue = 0;

        if (statKey === "time") {
          if (!sandbox.timerEvent) return;
          const remainingMs = sandbox.timerEvent.getRemaining();
          statValue = remainingMs;
        } else if (refName) {
          statValue = sandbox.stats?.[refName]?.[statKey] ?? 0;
        } else {
          statValue = Object.values(sandbox.stats ?? {}).reduce(
            (acc: number, s: any) => acc + (s[statKey] ?? 0),
            0
          );
        }

        // So sánh
        let isConditionMet = false;
        switch (operator) {
          case ">=":
            isConditionMet = statValue >= value;
            break;
          case "<=":
            isConditionMet = statValue <= value;
            break;
          case ">":
            isConditionMet = statValue > value;
            break;
          case "<":
            isConditionMet = statValue < value;
            break;
          case "==":
            isConditionMet = statValue == value;
            break;
        }

        if (isConditionMet && action === "end") {
          hasEnded = true;
          sandbox.endGame(effect);
        }
      },
    });
  };

  // 14. Set health - DONE
  sandbox.setHealth = (refName: string, value: number) => {
    if (!sandbox.stats[refName]) {
      sandbox.stats[refName] = { hp: value, power: 0 };
    } else {
      sandbox.stats[refName].hp = value;
    }

    sandbox.setStatDisplay(refName);

    const sprite = sandbox[refName];
    if (value <= 0 && sprite?.destroy) {
      sprite.destroy();
      delete sandbox[refName];
      delete sandbox.stats[refName];
      if (sandbox.statTexts[refName]) {
        sandbox.statTexts[refName].destroy();
        delete sandbox.statTexts[refName];
      }
    }
  };

  // setPower -DONE
  sandbox.setPower = (refName: string, value: number) => {
    if (!sandbox.stats[refName]) {
      sandbox.stats[refName] = { hp: 100, power: value };
    } else {
      sandbox.stats[refName].power = value;
    }

    sandbox.setStatDisplay(refName);
  };

  // 15. Start timer
  sandbox.setTimer = (seconds: number) => {
    if (sandbox.timerText) sandbox.timerText.destroy();

    const startTime = scene.time.now;
    const timerX = scene.cameras.main.centerX;
    const timerY = 20;

    const style = { fontSize: "24px", color: "#ff0", fontFamily: "monospace" };
    sandbox.timerText = scene.add
      .text(timerX, timerY, "", style)
      .setOrigin(0.5)
      .setScrollFactor(0);

    const totalMs = seconds * 1000;

    sandbox.timerEvent = scene.time.addEvent({
      delay: 100,
      loop: true,
      callback: () => {
        const elapsed = scene.time.now - startTime;
        const remaining = Math.max(0, totalMs - elapsed);
        const sec = Math.floor(remaining / 1000);
        const min = Math.floor(sec / 60);
        const secStr = (sec % 60).toString().padStart(2, "0");
        sandbox.timerText.setText(`${min}:${secStr}`);

        // Không tự động endGame nữa, để when xử lý
        if (remaining <= 0) {
          sandbox.timerEvent.remove();
        }
      },
    });
  };

  //===================================================================================================================================================//

  const skillHandlers: Record<string, (opts: SkillOptions) => void> = {
    fireball: ({
      scene,
      shooter,
      range,
      damage = 20,
      speed = 300,
      direction = shooter.flipX ? -1 : 1,
    }) => {
      if (!scene.textures.exists("fireball_anim")) {
        return;
      }

      const fireball = scene.physics.add
        .sprite(shooter.x, shooter.y, "fireball_anim")
        .play("fireball")
        .setScale(1.5)
        .setAngle(direction < 0 ? 180 : 0)
        .setVelocityX(direction * speed)
        .setGravity(0, 0);

      fireball.body.allowGravity = false;
      // const travelTime = (range / speed) * 1000;
      scene.time.delayedCall(range, () => fireball.destroy());

      // Lấy danh sách mục tiêu hợp lệ từ sandbox (nhân vật, không phải kỹ năng hay platforms)
      const validTargets = Object.values(sandbox).filter(
        (obj) =>
          obj instanceof Phaser.GameObjects.Sprite &&
          obj !== shooter &&
          obj !== fireball &&
          !sandbox.platforms.getChildren().includes(obj)
      );

      //Thiết lập kiểm tra va chạm (overlap) giữa fireball và tất cả đối tượng trong scene
      scene.physics.add.overlap(
        fireball,
        // scene.children.list,
        validTargets,
        (skillObj, targetObj) => {
          const target = targetObj as Phaser.GameObjects.Sprite;
          if (target === shooter || target === fireball) return;

          // Dùng utility applyDamage
          applyDamage(sandbox, scene, shooter, target, damage);

          fireball.destroy();
        }
      );
    },

    poison: ({ scene, shooter, range = 100, damage = 3 }) => {
      if (!scene.textures.exists("poison_anim")) {
        return;
      }

      // Tạo sprite poison dưới chân shooter
      const poison = scene.physics.add
        .sprite(shooter.x, shooter.y, "poison_anim")
        .play("poison")
        .setScale(range / 100, 1) // scale theo chiều ngang
        .setGravity(0, 0);

      poison.body.allowGravity = false;

      // Căn đáy của poison và shooter trùng nhau
      poison.setOrigin(0.5, 1);
      poison.y = shooter.getBottomCenter().y;

      // Tạo timer gây sát thương định kỳ
      const interval = scene.time.addEvent({
        delay: 500, // Gây sát thương mỗi 0.5s
        loop: true,
        callback: () => {
          // Lấy danh sách mục tiêu hợp lệ từ sandbox
          const validTargets = Object.values(sandbox).filter(
            (obj) =>
              obj instanceof Phaser.GameObjects.Sprite &&
              obj !== shooter &&
              obj !== poison &&
              !sandbox.platforms.getChildren().includes(obj)
          );

          // Kiểm tra va chạm với các mục tiêu hợp lệ
          scene.physics.overlap(
            poison,
            // scene.children.list,
            validTargets,
            (poisonObj, targetObj) => {
              const target = targetObj as Phaser.GameObjects.Sprite;

              const body = target.body as Phaser.Physics.Arcade.Body;
              if (!body || !body.enable) return;
              if (target === shooter || target === poison) return;

              // Kiểm tra mục tiêu còn sống
              const targetName = Object.keys(sandbox).find(
                (k) => sandbox[k] === target
              );
              if (targetName && sandbox.stats?.[targetName]?.hp > 0) {
                applyDamage(sandbox, scene, shooter, target, damage);
              }
            }
          );
        },
      });

      // Phá hủy poison sau duration
      scene.time.delayedCall(3000, () => {
        poison.destroy();
        interval.remove();
      });
    },

    healthsteal: ({ scene, shooter, range, damage = 2 }) => {
      if (!scene.textures.exists("healthsteal_anim")) {
        return;
      }

      // Tạo animation healthsteal gắn trên đầu chủ thể
      const healthsteal = scene.add
        .sprite(
          shooter.x,
          shooter.y - shooter.displayHeight,
          "healthsteal_anim"
        )
        .play("healthsteal")
        .setScale(0.5)
        .setDepth(10);

      // Gắn theo chuyển động của shooter (cập nhật mỗi frame)
      const followInterval = scene.time.addEvent({
        delay: 30,
        loop: true,
        callback: () => {
          if (!shooter.scene) {
            healthsteal.destroy();
            followInterval.remove();
            return;
          }

          healthsteal.x = shooter.x;
          healthsteal.y = shooter.y - shooter.displayHeight / 2;
        },
      });

      // Gây sát thương cho mục tiêu gần và hút máu
      const drainInterval = scene.time.addEvent({
        delay: 500, // mỗi 0.5s gây sát thương & hồi máu
        loop: true,
        callback: () => {
          scene.children.each((child) => {
            const target = child as Phaser.GameObjects.Sprite;

            // Bỏ qua chính chủ và các object không liên quan
            if (
              !target.body ||
              !(target.body as Phaser.Physics.Arcade.Body).enable ||
              target === shooter
            )
              return;

            const dx = target.x - shooter.x;
            const dy = target.y - shooter.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist <= range) {
              // Gây damage cho target
              applyDamage(sandbox, scene, shooter, target, damage);

              // Hồi máu cho shooter
              const shooterStat = sandbox.stats?.[shooter.name];
              if (shooterStat) {
                shooterStat.hp += damage;
                sandbox.setStatDisplay(shooter.name);
              }
            }
          });
        },
      });

      scene.time.delayedCall(3000, () => {
        healthsteal.destroy();
        followInterval.remove();
        drainInterval.remove();
      });
    },

    lazer: ({
      scene,
      shooter,
      range,
      damage = 15,
      direction = shooter.flipX ? -1 : 1,
    }) => {
      if (!scene.textures.exists("lazer_anim")) return;

      // Tính tọa độ y cách đáy shooter 20px
      const startY = shooter.getBottomCenter().y - 40;

      // Tạo sprite lazer
      const lazer = scene.physics.add.sprite(shooter.x, startY, "lazer_anim");

      lazer.play("lazer");
      lazer.body.allowGravity = false;

      // Scale chiều ngang theo range
      lazer.setScale(range / 100, 1);

      // Đặt lại origin để gốc luôn ở gần shooter
      if (direction > 0) {
        lazer.setOrigin(0, 0.5); // Gốc trái
        lazer.x = shooter.x + 20; // Gần mặt phải
      } else {
        lazer.setOrigin(1, 0.5); // Gốc phải
        lazer.x = shooter.x - 20; // Gần mặt trái
        lazer.setFlipX(true); // Lật nếu cần
      }

      lazer.body.setSize(lazer.width, lazer.height - 30);

      // Lấy danh sách mục tiêu hợp lệ từ sandbox
      const validTargets = Object.values(sandbox).filter(
        (obj) =>
          obj instanceof Phaser.GameObjects.Sprite &&
          obj !== shooter &&
          obj !== lazer &&
          !sandbox.platforms.getChildren().includes(obj)
      );

      // Biến mất sau 3s
      scene.time.delayedCall(800, () => {
        if (lazer && lazer.destroy) lazer.destroy();
      });

      // Gây sát thương khi chạm
      scene.physics.add.overlap(
        lazer,
        // scene.children.list,
        validTargets,
        (lazerObj, targetObj) => {
          const target = targetObj as Phaser.GameObjects.Sprite;
          if (
            !target.body ||
            !(target.body as Phaser.Physics.Arcade.Body).enable ||
            target === shooter
          )
            return;

          applyDamage(sandbox, scene, shooter, target, damage);
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
    baseDamage: number
  ) => {
    const direction = shooter.flipX ? -1 : 1;
    const scale = shooter.scaleX || 1;

    const projectileSpeed = 300 * scale;
    const projectileRange = 1000;
    const damage = baseDamage;

    // Tính tọa độ y cách đáy shooter 30px
    const startY = shooter.getBottomCenter().y - 30;

    const projectile = scene.physics.add
      .sprite(shooter.x + (direction > 0 ? 10 : -10), startY, projectileType)
      .setScale(0.25)
      .setVelocityX(direction * projectileSpeed)
      .setGravity(0, 0)
      .setAngle(direction > 0 ? 45 : 225);

    projectile.body.allowGravity = false;

    scene.time.delayedCall((projectileRange / projectileSpeed) * 1000, () =>
      projectile.destroy()
    );

    // Lấy danh sách mục tiêu hợp lệ từ sandbox
    const validTargets = Object.values(sandbox).filter(
      (obj) =>
        obj instanceof Phaser.GameObjects.Sprite &&
        obj !== shooter &&
        obj !== projectile &&
        !sandbox.platforms.getChildren().includes(obj)
    );

    // Kiểm tra va chạm với các mục tiêu hợp lệ
    scene.physics.add.overlap(
      projectile,
      // scene.children.list,
      validTargets,
      (proj, targetObj) => {
        const target = targetObj as Phaser.GameObjects.Sprite;
        if (target === shooter || target === proj) return;

        const platforms = sandbox.platforms?.getChildren() || [];
        if (platforms.includes(target)) {
          proj.destroy();
          return;
        }

        // Dùng utility applyDamage
        applyDamage(sandbox, scene, shooter, target, baseDamage);

        proj.destroy();
      }
    );
  };

  // Hiển thị máu và sức mạnh: Cập nhật setStatDisplay: theo sprite di chuyển
  sandbox.setStatDisplay = (refName: string) => {
    const sprite = sandbox[refName];
    if (!sprite || !sandbox.stats[refName]) return;

    const stats = sandbox.stats[refName];
    const text = `♥️ ${stats.hp}  ️🗡 ${stats.power}`;

    if (!sandbox.statTexts[refName]) {
      sandbox.statTexts[refName] = scene.add
        .text(sprite.x, sprite.y - 30, text, {
          fontSize: "12px",
          color: "#f00",
          stroke: "#f00",
          strokeThickness: 2,
        })
        .setOrigin(0.5);
    } else {
      sandbox.statTexts[refName].setText(text);
    }

    // Cập nhật vị trí theo sprite
    scene.events.on("update", () => {
      Object.entries(sandbox.statTexts).forEach(([refName, textObj]) => {
        const sprite = sandbox[refName];
        if (sprite && textObj) {
          (textObj as Phaser.GameObjects.Text).setPosition(
            sprite.x,
            sprite.y - 40
          );
        }
      });
    });
  };

  // hàm tiện ích applyDamage() dùng chung để cập nhật máu
  const applyDamage = (
    sandbox: Record<string, any>,
    scene: Phaser.Scene,
    shooter: Phaser.GameObjects.Sprite,
    target: Phaser.GameObjects.Sprite,
    baseDamage: number
  ) => {
    const shooterKey = Object.keys(sandbox).find((k) => sandbox[k] === shooter);
    const targetKey = Object.keys(sandbox).find((k) => sandbox[k] === target);
    if (!targetKey || !shooterKey) return;

    const attackerStats = sandbox.stats?.[shooterKey];
    if (!attackerStats || attackerStats.power <= 0) return;

    const actualDamage = attackerStats.power ?? baseDamage;
    const currHP = sandbox.stats?.[targetKey]?.hp ?? 100;
    const newHP = Math.max(0, currHP - actualDamage);

    // Cập nhật HP
    sandbox.setHealth(targetKey, newHP);

    // Gửi event để cập nhật UI (nếu cần)
  };

  // End game
  sandbox.endGame = (result: "win" | "lose") => {
    if (sandbox.timerEvent) sandbox.timerEvent.remove();

    const cam = scene.cameras.main;

    // 1. Tạo lớp phủ nền
    const overlay = scene.add
      .rectangle(cam.centerX, cam.centerY, cam.width, cam.height, 0x000000, 0)
      .setDepth(99)
      .setScrollFactor(0);

    scene.tweens.add({
      targets: overlay,
      alpha: { from: 0, to: 0.7 },
      duration: 800,
      ease: "Quad.easeOut",
    });

    // 2. Thông báo kết thúc
    const msg = result === "win" ? "🎉 YOU WIN!" : "💀 GAME OVER!";
    const color = result === "win" ? "#00ff88" : "#ff4444";

    const endText = scene.add
      .text(cam.centerX, cam.centerY, msg, {
        fontSize: "60px",
        fontFamily: "monospace",
        color,
        stroke: "#000",
        strokeThickness: 8,
      })
      .setOrigin(0.5)
      .setDepth(100)
      .setScrollFactor(0)
      .setScale(0);

    // 3. Phóng to + lắc
    scene.tweens.add({
      targets: endText,
      scale: 1,
      ease: "Back.Out",
      duration: 1000,
      onComplete: () => {
        scene.tweens.add({
          targets: endText,
          angle: { from: -2, to: 2 },
          yoyo: true,
          repeat: -1,
          duration: 100,
        });

        // ✅ Dừng vật lý và sự kiện thay vì đóng băng toàn bộ
        scene.physics.pause();
        scene.time.removeAllEvents();
        // scene.scene.pause(); // Tùy chọn: dừng toàn bộ scene
      },
    });
  };

  return sandbox;
}
