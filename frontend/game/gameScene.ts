/**
 * Game Scene - Scene chính xử lý điều khiển người chơi, vật lý và logic game
 * Scene này quản lý:
 * - Di chuyển và animation của người chơi
 * - Cơ chế tấn công
 * - Vật lý và va chạm
 * - Thực thi code (preview và code người dùng)
 */

import { getBaseCodeForQuest } from "@/features/quests/questMap";
import { createStudentAPI } from "@/game/api/learning-api";
import { preloadAssets } from "./preloadAssets";

import * as Phaser from "phaser";

// ===== Định Nghĩa Các Kiểu Dữ Liệu =====

/**
 * Interface cấu hình nhiệm vụ
 * @property id - Định danh duy nhất của nhiệm vụ
 * @property mode - Chế độ nhiệm vụ: 'guided' cho hướng dẫn hoặc 'free' cho sandbox
 */
interface Quest {
  id: string;
  mode: "guided" | "free";
}

/**
 * Cấu hình điều khiển cho di chuyển người chơi
 * Định nghĩa cách một phím ảnh hưởng đến di chuyển và animation của sprite
 */
interface ControlConfig {
  key: number; // Mã phím bàn phím
  sprite: Phaser.GameObjects.Sprite; // Sprite cần điều khiển
  animation?: string; // Animation phát khi nhấn phím
  velocityX: number; // Tốc độ di chuyển ngang
  velocityY: number; // Tốc độ di chuyển dọc (cho nhảy)
  isJumpKey: boolean; // Phím này có phải là phím nhảy không
  refName: string; // Tên tham chiếu cho sprite
}

/**
 * Cấu hình tấn công cho người chơi
 * Định nghĩa cách một phím kích hoạt animation và hành động tấn công
 */
interface AttackConfig {
  key: number; // Mã phím bàn phím
  sprite: Phaser.GameObjects.Sprite; // Sprite thực hiện tấn công
  animation?: string; // Animation phát khi tấn công
  refName: string; // Tên tham chiếu cho sprite
}

// ===== Lớp Scene Game Chính =====

export class Game_Scene extends Phaser.Scene {
  // Hằng số cho kích thước game
  private static readonly LOGICAL_WIDTH = 1440;
  private static readonly LOGICAL_HEIGHT = 720;

  // Trạng thái và cấu hình game
  private sandbox!: Record<string, any>; // Môi trường sandbox cho code người dùng
  private quest: Quest; // Cấu hình nhiệm vụ hiện tại
  private scaleFactor: number = 1; // Hệ số tỷ lệ cho responsive
  private keys: { [key: number]: Phaser.Input.Keyboard.Key } = {}; // Theo dõi input bàn phím
  private lastAttackTime: { [refName: string]: number } = {}; // Theo dõi thời gian hồi tấn công
  private attackCooldown = 500; // Thời gian hồi tấn công (ms)
  private swordCounter = 0; // Bộ đếm cho các instance kiếm

  constructor(quest: Quest) {
    super("Game_Scene");
    this.quest = quest;
  }

  // ===== Các Phương Thức Vòng Đời Scene =====

  /**
   * Tải tài nguyên game
   * Được gọi tự động bởi Phaser trước create()
   */
  preload(): void {
    preloadAssets(this);
  }

  /**
   * Khởi tạo scene game
   * Được gọi tự động bởi Phaser sau preload()
   */
  create(): void {
    this.initializeScaleFactor();
    this.setupAnimations();
    this.initializeSandbox();
    this.setupResizeListener();
    this.runPreviewCodeIfAvailable();
    this.setupRunUserCodeListener();
  }

  /**
   * Vòng lặp game chính
   * Được gọi mỗi frame bởi Phaser
   * Xử lý di chuyển, tấn công và cập nhật vật lý
   */
  update(): void {
    if (!this.sandbox.controls && !this.sandbox.attackControls) return;

    // Theo dõi trạng thái cho mỗi sprite
    const spriteStates: {
      [refName: string]: {
        velocityX: number;
        wasKeyDown: boolean;
        isJumping: boolean;
        wasAttackKeyDown: boolean;
      };
    } = {};

    this.handleMovement(spriteStates);
    this.handleAttacks(spriteStates);
    this.applyVelocities(spriteStates);
  }

  // ===== Các Phương Thức Khởi Tạo =====

  /**
   * Tính toán và thiết lập hệ số tỷ lệ dựa trên kích thước màn hình
   * Đảm bảo các phần tử game scale phù hợp trên các kích thước màn hình khác nhau
   */
  private initializeScaleFactor(): void {
    this.scaleFactor = Math.min(
      this.cameras.main.width / Game_Scene.LOGICAL_WIDTH,
      this.cameras.main.height / Game_Scene.LOGICAL_HEIGHT
    );
  }

  /**
   * Thiết lập tất cả animation cho sprite
   * Tạo các chuỗi animation cho các trạng thái di chuyển của người chơi
   */
  private setupAnimations(): void {
    // Animation chạy
    this.anims.create({
      key: "player_run_run",
      frames: this.anims.generateFrameNumbers("player_run", {
        start: 0,
        end: 5,
      }),
      frameRate: 10,
      repeat: -1,
    });

    // Animation đứng yên
    this.anims.create({
      key: "player_run_idle",
      frames: this.anims.generateFrameNumbers("player_idle", {
        start: 0,
        end: 4,
      }),
      frameRate: 6,
      repeat: -1,
    });

    // Animation nhảy
    this.anims.create({
      key: "player_run_jump",
      frames: this.anims.generateFrameNumbers("player_jump", {
        start: 0,
        end: 4,
      }),
      frameRate: 4,
      repeat: 0,
    });
  }

  /**
   * Khởi tạo môi trường sandbox cho code người dùng
   * Tạo các hàm và đối tượng API có thể truy cập từ code người dùng
   */
  private initializeSandbox(): void {
    this.sandbox = createStudentAPI(this, this.scaleFactor);
  }

  /**
   * Thiết lập xử lý thay đổi kích thước cửa sổ
   * Cập nhật hệ số tỷ lệ và các phần tử game khi kích thước cửa sổ thay đổi
   */
  private setupResizeListener(): void {
    this.scale.on("resize", (gameSize: Phaser.Structs.Size) => {
      this.scaleFactor = Math.min(
        gameSize.width / Game_Scene.LOGICAL_WIDTH,
        gameSize.height / Game_Scene.LOGICAL_HEIGHT
      );
      console.log(
        `Canvas đã thay đổi kích thước: ${gameSize.width}x${gameSize.height}, Tỷ lệ: ${this.scaleFactor}`
      );
      this.scaleObjects();
    });
  }

  // ===== Các Phương Thức Di Chuyển và Điều Khiển =====

  /**
   * Xử lý di chuyển người chơi dựa trên input bàn phím
   * Cập nhật vận tốc và animation cho mỗi sprite được điều khiển
   */
  private handleMovement(spriteStates: {
    [refName: string]: {
      velocityX: number;
      wasKeyDown: boolean;
      isJumping: boolean;
      wasAttackKeyDown: boolean;
    };
  }): void {
    if (!this.sandbox.controls || this.sandbox.controls.length === 0) return;

    // Xử lý từng cấu hình điều khiển
    this.sandbox.controls.forEach((control: ControlConfig) => {
      const {
        key,
        sprite,
        refName,
        animation,
        velocityX,
        velocityY,
        isJumpKey,
      } = control;

      // Khởi tạo input bàn phím nếu chưa có
      if (!this.keys[key]) {
        this.keys[key] = this.input.keyboard!.addKey(key);
      }
      const isKeyDown = this.keys[key].isDown;

      // Kiểm tra sprite
      if (!sprite || !sprite.body) {
        console.warn(
          `Sprite '${refName}' không tồn tại hoặc không có physics body trong controls`
        );
        return;
      }

      // Khởi tạo trạng thái sprite nếu chưa có
      if (!spriteStates[refName]) {
        spriteStates[refName] = {
          velocityX: 0,
          wasKeyDown: false,
          isJumping: false,
          wasAttackKeyDown: false,
        };
      }

      // Xử lý khi nhấn phím
      if (isKeyDown) {
        // Logic nhảy
        if (
          isJumpKey &&
          (sprite.body as Phaser.Physics.Arcade.Body).touching.down
        ) {
          (sprite as Phaser.Physics.Arcade.Sprite).setVelocityY(-velocityY);
          spriteStates[refName].isJumping = true;
          if (animation && sprite.anims.currentAnim?.key !== animation) {
            sprite.anims.play(animation, true);
          }
        }
        // Logic di chuyển
        else if (!isJumpKey) {
          spriteStates[refName].velocityX = velocityX;
          if (velocityX > 0) sprite.setFlipX(false);
          else if (velocityX < 0) sprite.setFlipX(true);
          if (
            animation &&
            !spriteStates[refName].isJumping &&
            sprite.anims.currentAnim?.key !== animation
          ) {
            sprite.anims.play(animation, true);
          }
        }
      }
      // Xử lý khi thả phím - trở về animation đứng yên
      else if (
        animation &&
        sprite.anims.currentAnim?.key === animation &&
        !isJumpKey &&
        !spriteStates[refName].isJumping
      ) {
        const idleAnimation = `${sprite.texture.key}_idle`;
        if (sprite.anims.get(idleAnimation)) {
          sprite.anims.play(idleAnimation, true);
        }
      }

      // Cập nhật theo dõi trạng thái
      spriteStates[refName].wasKeyDown = isKeyDown;

      // Xử lý khi tiếp đất sau khi nhảy
      if (
        spriteStates[refName].isJumping &&
        (sprite.body as Phaser.Physics.Arcade.Body).touching.down
      ) {
        spriteStates[refName].isJumping = false;
        const spriteKey = sprite.texture.key;
        if (isKeyDown && !isJumpKey && sprite.anims.get(`${spriteKey}_run`)) {
          sprite.anims.play(`${spriteKey}_run`, true);
        } else {
          const idleAnimation = `${spriteKey}_idle`;
          if (sprite.anims.get(idleAnimation)) {
            sprite.anims.play(idleAnimation, true);
          }
        }
      }
    });

    // Reset vận tốc khi không có phím di chuyển nào được nhấn
    for (const refName in spriteStates) {
      const state = spriteStates[refName];
      const sprite = this.sandbox[refName];
      if (sprite && sprite.body) {
        let hasMovementKeyPressed = false;
        this.sandbox.controls.forEach((control: ControlConfig) => {
          if (
            control.refName === refName &&
            !control.isJumpKey &&
            this.keys[control.key]?.isDown
          ) {
            hasMovementKeyPressed = true;
          }
        });
        if (!hasMovementKeyPressed) {
          state.velocityX = 0;
          if (
            !state.isJumping &&
            sprite.anims.currentAnim?.key !== `${sprite.texture.key}_idle`
          ) {
            sprite.anims.play(`${sprite.texture.key}_idle`, true);
          }
        }
      }
    }
  }

  /**
   * Xử lý các hành động tấn công dựa trên input bàn phím
   * Quản lý animation tấn công và thời gian hồi
   */
  private handleAttacks(spriteStates: {
    [refName: string]: {
      velocityX: number;
      wasKeyDown: boolean;
      isJumping: boolean;
      wasAttackKeyDown: boolean;
    };
  }): void {
    if (
      !this.sandbox.attackControls ||
      this.sandbox.attackControls.length === 0
    )
      return;

    this.sandbox.attackControls.forEach((control: AttackConfig) => {
      const { key, sprite, refName, animation } = control;

      // Khởi tạo input bàn phím nếu chưa có
      if (!this.keys[key]) {
        this.keys[key] = this.input.keyboard!.addKey(key);
      }
      const isKeyDown = this.keys[key].isDown;

      // Kiểm tra sprite
      if (!sprite || !sprite.body) {
        console.warn(
          `Sprite '${refName}' không tồn tại hoặc không có physics body trong attackControls`
        );
        return;
      }

      // Khởi tạo trạng thái sprite nếu chưa có
      if (!spriteStates[refName]) {
        spriteStates[refName] = {
          velocityX: 0,
          wasKeyDown: false,
          isJumping: false,
          wasAttackKeyDown: false,
        };
      }

      // Xử lý input tấn công
      if (isKeyDown && !spriteStates[refName].wasAttackKeyDown) {
        const currentTime = this.time.now;
        const lastAttack = this.lastAttackTime[refName] || 0;

        // Kiểm tra thời gian hồi tấn công
        if (currentTime - lastAttack >= this.attackCooldown) {
          if (animation) {
            sprite.anims.play(animation, true);
          }
          this.attack(sprite, refName);
          this.lastAttackTime[refName] = currentTime;

          // Xử lý khi animation hoàn thành
          sprite.on(
            "animationcomplete",
            (anim: Phaser.Animations.Animation) => {
              if (anim.key === animation) {
                if (spriteStates[refName].isJumping) {
                  sprite.anims.play(`${sprite.texture.key}_jump`, true);
                } else {
                  const hasMovementKeyPressed = this.sandbox.controls.some(
                    (ctrl: ControlConfig) =>
                      ctrl.refName === refName &&
                      !ctrl.isJumpKey &&
                      this.keys[ctrl.key]?.isDown
                  );
                  if (hasMovementKeyPressed) {
                    sprite.anims.play(`${sprite.texture.key}_run`, true);
                  } else {
                    sprite.anims.play(`${sprite.texture.key}_idle`, true);
                  }
                }
              }
            }
          );
        }
      }

      spriteStates[refName].wasAttackKeyDown = isKeyDown;
    });
  }

  /**
   * Áp dụng vận tốc đã tính toán cho các sprite
   * Cập nhật vị trí sprite dựa trên trạng thái di chuyển
   */
  private applyVelocities(spriteStates: {
    [refName: string]: {
      velocityX: number;
      wasKeyDown: boolean;
      isJumping: boolean;
      wasAttackKeyDown: boolean;
    };
  }): void {
    for (const refName in spriteStates) {
      const sprite = this.sandbox[refName];
      if (sprite && sprite.body) {
        sprite.setVelocityX(spriteStates[refName].velocityX);
      }
    }
  }

  /**
   * Tạo và quản lý đạn tấn công
   * Xử lý tạo kiếm, di chuyển và phát hiện va chạm
   */
  private attack(sprite: Phaser.GameObjects.Sprite, refName: string): void {
    if (!sprite || !sprite.body) {
      console.warn(
        `Sprite '${refName}' không tồn tại hoặc không có physics body trong attack`
      );
      return;
    }

    // Tạo đạn kiếm
    const speed = 300 * this.scaleFactor;
    const swordRefName = `sword_${refName}_${this.swordCounter++}`;
    const sword = this.physics.add.sprite(
      sprite.x + (sprite.flipX ? -10 : 10),
      sprite.y,
      "sword"
    );

    // Cấu hình thuộc tính kiếm
    sword.setScale(this.scaleFactor * 0.25);
    sword.body.allowGravity = false;
    sword.setVelocityX((sprite.flipX ? -3 : 3) * speed);
    this.sandbox[swordRefName] = sword;

    // Xóa kiếm sau 1 giây
    this.time.delayedCall(1000, () => {
      if (sword && sword.active) {
        delete this.sandbox[swordRefName];
        sword.destroy();
      }
    });

    // Thiết lập phát hiện va chạm cho tất cả mục tiêu tiềm năng
    for (const targetRef in this.sandbox) {
      if (
        targetRef !== refName &&
        targetRef !== swordRefName &&
        targetRef !== "platforms" &&
        this.sandbox[targetRef] instanceof Phaser.GameObjects.Sprite
      ) {
        const target = this.sandbox[targetRef];
        if (!target || !target.body) {
          console.warn(
            `Mục tiêu '${targetRef}' không tồn tại hoặc không có physics body trong attack`
          );
          continue;
        }
        this.physics.add.overlap(sword, target, () => {
          console.log(
            `Kiếm ${swordRefName} từ ${refName} đã trúng ${targetRef}`
          );
          this.events.emit("lose-health", { refName: targetRef, value: 10 });
          delete this.sandbox[swordRefName];
          sword.destroy();
        });
      }
    }
  }

  // ===== Các Phương Thức Thực Thi Code =====

  /**
   * Thực thi code người dùng trong môi trường sandbox
   * @param code - Chuỗi code cần thực thi
   */
  runUserCode(code: string): void {
    try {
      const wrapped = `
        with (sandbox) {
          ${code}
        }
      `;
      new Function("sandbox", wrapped)(this.sandbox);
      this.scaleObjects();
      this.setupColliders();
      console.log(
        "Đã thực thi code người dùng, các đối tượng sandbox:",
        Object.keys(this.sandbox)
      );
    } catch (err) {
      console.error("Lỗi khi chạy code người dùng:", err);
    }
  }

  /**
   * Thiết lập phát hiện va chạm giữa sprite và platform
   */
  private setupColliders(): void {
    const platforms = this.sandbox.platforms?.getChildren() || [];
    console.log("Platforms sau khi chạy code người dùng:", platforms);
    for (const spriteKey in this.sandbox) {
      const sprite = this.sandbox[spriteKey];
      if (sprite && sprite.body && platforms.length > 0) {
        this.physics.add.collider(sprite, this.sandbox.platforms, () => {
          console.log(`Phát hiện va chạm giữa ${spriteKey} và platforms`);
        });
      }
    }
  }

  /**
   * Scale các đối tượng game dựa trên hệ số tỷ lệ hiện tại
   * Duy trì vị trí và kích thước phù hợp của các phần tử game
   */
  private scaleObjects(): void {
    for (const obj of this.sandbox.objects || []) {
      if (obj.obj && obj.obj.setScale) {
        obj.obj.setScale(this.scaleFactor);
        obj.obj.x =
          obj.obj.originalX !== undefined
            ? obj.obj.originalX * this.scaleFactor
            : obj.obj.x;
        obj.obj.y =
          obj.obj.originalY !== undefined
            ? obj.obj.originalY * this.scaleFactor
            : obj.obj.y;
        if (!obj.obj.originalX) {
          obj.obj.originalX = obj.obj.x / this.scaleFactor;
          obj.obj.originalY = obj.obj.y / this.scaleFactor;
        }
      }
    }
  }

  /**
   * Chạy code preview cho nhiệm vụ hiện tại
   * @param previewFn - Hàm chứa code preview cần thực thi
   */
  runPreviewCode(previewFn: (scene: Phaser.Scene, sandbox: any) => void): void {
    try {
      this.sandbox = createStudentAPI(this, this.scaleFactor);
      previewFn(this, this.sandbox);
      this.scaleObjects();
    } catch (err) {
      console.error("Lỗi khi chạy code preview:", err);
    }
  }

  /**
   * Chạy code preview nếu có cho nhiệm vụ hiện tại
   */
  private runPreviewCodeIfAvailable(): void {
    const previewCode = getBaseCodeForQuest(this.quest.id);
    console.log("ID nhiệm vụ:", this.quest.id);
    if (previewCode) {
      try {
        this.runPreviewCode(previewCode);
      } catch (error) {
        console.error("Lỗi khi chạy code preview:", error);
      }
    } else {
      console.warn("Không tìm thấy code preview:", this.quest.id);
    }
  }

  /**
   * Thiết lập event listener cho việc chạy code người dùng
   */
  private setupRunUserCodeListener(): void {
    window.addEventListener("run-user-code", (e: any) => {
      try {
        this.runUserCode(e.detail.code);
      } catch (err) {
        console.error("Lỗi khi chạy code người dùng:", err);
      }
    });
  }
}
