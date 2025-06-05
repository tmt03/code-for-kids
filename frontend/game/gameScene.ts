import { getBaseCodeForQuest } from "@/features/quests/questMap";
import { createStudentAPI } from "@/game/api/learning-api";
import { preloadAssets } from "./preloadAssets";

import * as Phaser from "phaser";

interface Quest {
  id: string;
  mode: "guided" | "free";
}

interface ControlConfig {
  key: number;
  sprite: Phaser.GameObjects.Sprite;
  animation?: string;
  velocityX: number;
  velocityY: number;
  isJumpKey: boolean;
  refName: string;
}

interface AttackConfig {
  key: number;
  sprite: Phaser.GameObjects.Sprite;
  animation?: string;
  refName: string;
}

export class Game_Scene extends Phaser.Scene {
  private static readonly LOGICAL_WIDTH = 1440;
  private static readonly LOGICAL_HEIGHT = 720;
  private sandbox!: Record<string, any>;
  private quest: Quest;
  private scaleFactor: number = 1;
  private keys: { [key: number]: Phaser.Input.Keyboard.Key } = {};
  private lastAttackTime: { [refName: string]: number } = {};
  private attackCooldown = 500;
  private swordCounter = 0;

  constructor(quest: Quest) {
    super("Game_Scene");
    this.quest = quest;
  }

  preload(): void {
    preloadAssets(this);
  }

  create(): void {
    this.initializeScaleFactor();
    this.setupAnimations();
    this.initializeSandbox();
    this.setupResizeListener();
    this.runPreviewCodeIfAvailable();
    this.setupRunUserCodeListener();
  }

  private initializeScaleFactor(): void {
    this.scaleFactor = Math.min(
      this.cameras.main.width / Game_Scene.LOGICAL_WIDTH,
      this.cameras.main.height / Game_Scene.LOGICAL_HEIGHT
    );
  }

  private setupAnimations(): void {
    this.anims.create({
      key: "player_run_run",
      frames: this.anims.generateFrameNumbers("player_run", {
        start: 0,
        end: 5,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "player_run_idle",
      frames: this.anims.generateFrameNumbers("player_idle", {
        start: 0,
        end: 4,
      }),
      frameRate: 6,
      repeat: -1,
    });

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

  private initializeSandbox(): void {
    this.sandbox = createStudentAPI(this, this.scaleFactor);
  }

  private setupResizeListener(): void {
    this.scale.on("resize", (gameSize: Phaser.Structs.Size) => {
      this.scaleFactor = Math.min(
        gameSize.width / Game_Scene.LOGICAL_WIDTH,
        gameSize.height / Game_Scene.LOGICAL_HEIGHT
      );
      console.log(
        `Canvas resized: ${gameSize.width}x${gameSize.height}, Scale: ${this.scaleFactor}`
      );
      this.scaleObjects();
    });
  }

  private runPreviewCodeIfAvailable(): void {
    const previewCode = getBaseCodeForQuest(this.quest.id);
    console.log("Quest ID:", this.quest.id);
    if (previewCode) {
      try {
        this.runPreviewCode(previewCode);
      } catch (error) {
        console.error("Lỗi khi chạy preview code:", error);
      }
    } else {
      console.warn("Không tìm thấy preview code:", this.quest.id);
    }
  }

  private setupRunUserCodeListener(): void {
    window.addEventListener("run-user-code", (e: any) => {
      try {
        this.runUserCode(e.detail.code);
      } catch (err) {
        console.error("Lỗi khi chạy user code:", err);
      }
    });
  }

  update(): void {
    if (!this.sandbox.controls && !this.sandbox.attackControls) return;

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

  private handleMovement(spriteStates: {
    [refName: string]: {
      velocityX: number;
      wasKeyDown: boolean;
      isJumping: boolean;
      wasAttackKeyDown: boolean;
    };
  }): void {
    if (!this.sandbox.controls || this.sandbox.controls.length === 0) return;

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
      if (!this.keys[key]) {
        this.keys[key] = this.input.keyboard!.addKey(key);
      }
      const isKeyDown = this.keys[key].isDown;

      if (!sprite || !sprite.body) {
        console.warn(
          `Sprite '${refName}' is null or has no physics body in controls`
        );
        return;
      }

      if (!spriteStates[refName]) {
        spriteStates[refName] = {
          velocityX: 0,
          wasKeyDown: false,
          isJumping: false,
          wasAttackKeyDown: false,
        };
      }

      if (isKeyDown) {
        if (
          isJumpKey &&
          (sprite.body as Phaser.Physics.Arcade.Body).touching.down
        ) {
          (sprite as Phaser.Physics.Arcade.Sprite).setVelocityY(-velocityY);
          spriteStates[refName].isJumping = true;
          if (animation && sprite.anims.currentAnim?.key !== animation) {
            sprite.anims.play(animation, true);
          }
        } else if (!isJumpKey) {
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
      } else if (
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

      spriteStates[refName].wasKeyDown = isKeyDown;

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
      if (!this.keys[key]) {
        this.keys[key] = this.input.keyboard!.addKey(key);
      }
      const isKeyDown = this.keys[key].isDown;

      if (!sprite || !sprite.body) {
        console.warn(
          `Sprite '${refName}' is null or has no physics body in attackControls`
        );
        return;
      }

      if (!spriteStates[refName]) {
        spriteStates[refName] = {
          velocityX: 0,
          wasKeyDown: false,
          isJumping: false,
          wasAttackKeyDown: false,
        };
      }

      if (isKeyDown && !spriteStates[refName].wasAttackKeyDown) {
        const currentTime = this.time.now;
        const lastAttack = this.lastAttackTime[refName] || 0;
        if (currentTime - lastAttack >= this.attackCooldown) {
          if (animation) {
            sprite.anims.play(animation, true);
          }
          this.attack(sprite, refName);
          this.lastAttackTime[refName] = currentTime;

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

  private attack(sprite: Phaser.GameObjects.Sprite, refName: string): void {
    if (!sprite || !sprite.body) {
      console.warn(
        `Sprite '${refName}' is null or has no physics body in attack`
      );
      return;
    }

    const speed = 300 * this.scaleFactor;
    const swordRefName = `sword_${refName}_${this.swordCounter++}`;
    const sword = this.physics.add.sprite(
      sprite.x + (sprite.flipX ? -10 : 10),
      sprite.y,
      "sword"
    );
    sword.setScale(this.scaleFactor * 0.25);
    sword.body.allowGravity = false;
    sword.setVelocityX((sprite.flipX ? -3 : 3) * speed);
    this.sandbox[swordRefName] = sword;

    this.time.delayedCall(1000, () => {
      if (sword && sword.active) {
        delete this.sandbox[swordRefName];
        sword.destroy();
      }
    });
    console.log(`Attack from ${refName} at ${sprite.x}, ${sprite.y}`);

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
            `Target '${targetRef}' is null or has no physics body in attack`
          );
          continue;
        }
        this.physics.add.overlap(sword, target, () => {
          console.log(`Sword ${swordRefName} from ${refName} hit ${targetRef}`);
          this.events.emit("lose-health", { refName: targetRef, value: 10 });
          delete this.sandbox[swordRefName];
          sword.destroy();
        });
      }
    }
  }

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
        "User code executed, sandbox objects:",
        Object.keys(this.sandbox)
      );
    } catch (err) {
      console.error("Lỗi khi chạy user code:", err);
    }
  }

  private setupColliders(): void {
    const platforms = this.sandbox.platforms?.getChildren() || [];
    console.log("Platforms after user code:", platforms);
    for (const spriteKey in this.sandbox) {
      const sprite = this.sandbox[spriteKey];
      if (sprite && sprite.body && platforms.length > 0) {
        this.physics.add.collider(sprite, this.sandbox.platforms, () => {
          console.log(`Collision detected between ${spriteKey} and platforms`);
        });
      }
    }
  }

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

  runPreviewCode(previewFn: (scene: Phaser.Scene, sandbox: any) => void): void {
    try {
      this.sandbox = createStudentAPI(this, this.scaleFactor);
      previewFn(this, this.sandbox);
      this.scaleObjects();
    } catch (err) {
      console.error("Lỗi khi chạy preview code:", err);
    }
  }
}
