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
import { setupAnimations } from "./animationConfigs";
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
  mode: "creative" | "learning";
  code?: string;
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
  projectileType: string; // Loại đạn (ví dụ: "sword", "fireball")
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
  private keys: Record<string, Phaser.Input.Keyboard.Key> = {}; // Theo dõi input bàn phím
  private lastAttackTime: { [refName: string]: number } = {}; // Theo dõi thời gian hồi tấn công
  private attackCooldown = 500; // Thời gian hồi tấn công (ms)

  constructor(quest: Quest) {
    super({ key: "Game_Scene" });
    this.quest = quest;
    console.log("Game_Scene initialized with quest:", quest);
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
    console.log("Game_Scene create() called");
    setupAnimations(this);
    this.initializeScaleFactor();
    this.initializeSandbox();
    this.setupResizeListener();
    if (this.quest.id === "shared" && this.quest.code) {
      this.runUserCode(this.quest.code);
    } else {
      this.runPreviewCodeIfAvailable();
    }
    this.setupRunUserCodeListener();
  }

  /**
   * Vòng lặp game chính
   * Được gọi mỗi frame bởi Phaser
   * Xử lý di chuyển, tấn công và cập nhật vật lý
   */
  update(time: number, delta: number): void {
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

    this.handleInput(spriteStates);
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
   * Xử lý tất cả input của người chơi (di chuyển, nhảy, tấn công)
   * Cập nhật vận tốc, animation và trạng thái sprite
   */
  private handleInput(spriteStates: {
    [refName: string]: {
      velocityX: number;
      wasKeyDown: boolean;
      isJumping: boolean;
      wasAttackKeyDown: boolean;
    };
  }): void {
    const refNames = new Set<string>();
    this.sandbox.controls?.forEach((c: any) => refNames.add(c.refName));
    this.sandbox.attackControls?.forEach((c: any) => refNames.add(c.refName));

    refNames.forEach((refName) => {
      const sprite = this.sandbox[refName];
      if (!sprite || !sprite.body) return;

      const body = sprite.body as Phaser.Physics.Arcade.Body;
      const state = (spriteStates[refName] ||= {
        velocityX: 0,
        wasKeyDown: false,
        isJumping: false,
        wasAttackKeyDown: false,
      });

      let isMoving = false;

      // Di chuyển & nhảy
      this.sandbox.controls?.forEach((control: any) => {
        if (control.refName !== refName) return;
        const key = this.getKey(control.key);
        if (!key.isDown) return;

        if (control.isJumpKey && body.touching.down) {
          sprite.setVelocityY(-control.velocityY);
          state.isJumping = true;
          this.playAnim(sprite, control.animation);
        } else if (!control.isJumpKey) {
          state.velocityX = control.velocityX;
          sprite.setFlipX(control.velocityX < 0);
          if (!state.isJumping) this.playAnim(sprite, control.animation);
          isMoving = true;
        }

        state.wasKeyDown = true;
      });

      if (!isMoving) {
        state.velocityX = 0;
        if (!state.isJumping)
          this.playAnim(sprite, `${sprite.texture.key}_idle`);
      }

      // Reset jumping state nếu đã chạm đất
      if (state.isJumping && body.touching.down) {
        state.isJumping = false;
      }

      // Tấn công
      this.sandbox.attackControls?.forEach((control: any) => {
        if (control.refName !== refName) return;
        const key = this.getKey(control.key);
        const now = this.time.now;
        const lastTime = this.lastAttackTime[refName] || 0;

        if (key.isDown && !state.wasAttackKeyDown && body.touching.down) {
          if (now - lastTime >= this.attackCooldown) {
            this.playAnim(sprite, control.animation);
            this.lastAttackTime[refName] = now;

            sprite.once("animationcomplete", (anim: any) => {
              if (anim.key === control.animation) {
                const moveAnim = this.getMoveAnim(refName);
                this.playAnim(sprite, moveAnim || `${sprite.texture.key}_idle`);
              }
            });
          }
        }

        state.wasAttackKeyDown = key.isDown;
      });

      sprite.setVelocityX(state.velocityX);
    });
  }

  private getKey(keyName: string): Phaser.Input.Keyboard.Key {
    return (this.keys[keyName] ||= this.input.keyboard!.addKey(keyName));
  }

  private playAnim(sprite: Phaser.GameObjects.Sprite, anim?: string) {
    if (
      anim &&
      sprite.anims.currentAnim?.key !== anim &&
      sprite.anims.get(anim)
    ) {
      sprite.anims.play(anim, true);
    }
  }

  private getMoveAnim(refName: string): string | undefined {
    const control = this.sandbox.controls?.find(
      (c: any) => c.refName === refName && c.animation && !c.isJumpKey
    );
    return control?.animation;
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

  // ===== Các Phương Thức Thực Thi Code =====

  /**
   * Thực thi code người dùng trong môi trường sandbox
   * @param code - Chuỗi code cần thực thi
   */
  private runUserCode(code: string): void {
    console.log("Running user code in sandbox");
    try {
      const wrapped = `
        with (sandbox) {
          ${code}
        }
      `;
      new Function("sandbox", wrapped)(this.sandbox);
      this.scaleObjects();
      this.setupColliders();
    } catch (err) {
      console.error("Error in user code execution:", err);
    }
  }

  /**
   * Thiết lập phát hiện va chạm giữa sprite đơn/mảng và platform
   */
  private setupColliders(): void {
    const platforms = this.sandbox.platforms?.getChildren() || [];
    console.log("Platforms sau khi chạy code người dùng:", platforms);
    for (const spriteKey in this.sandbox) {
      const spriteOrArray = this.sandbox[spriteKey];
      const sprites = Array.isArray(spriteOrArray)
        ? spriteOrArray
        : [spriteOrArray];
      sprites.forEach((sprite: Phaser.GameObjects.Sprite) => {
        if (sprite && sprite.body && platforms.length > 0) {
          this.physics.add.collider(sprite, this.sandbox.platforms);
        }
      });
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
      this.setupColliders();
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
