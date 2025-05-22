// game/api/student-apis.ts
import * as Phaser from "phaser";

export function createStudentAPI(scene: Phaser.Scene): Record<string, any> {
  const sandbox: Record<string, any> = {};

  // === Core APIs from BOOK 1 ===

  //Set backround
  sandbox.setBackground = (bgKey: string) => {
    scene.add.image(0, 0, bgKey).setOrigin(0).setScale(0.5);
  };

  //Set floor
  sandbox.setFloor = (floorKey: string) => {
    const floor = scene.physics.add.staticSprite(400, 450, floorKey);
    floor.setScale(0.5).refreshBody();
  };

  //Create character assign to a variable with animation or not
  sandbox.spawn = (
    key: string,
    x: number,
    y: number,
    refName: string,
    options?: any
  ) => {
    const sprite = scene.add.sprite(x, y, key);
    sandbox[refName] = sprite;
    if (options?.animation) sprite.anims.play(options.animation, true);
    return sprite;
  };

  // Create random character assign to a variable with animation or not
  sandbox.spawnRandom = (
    key: string,
    minX: number,
    maxX: number,
    y: number
  ) => {
    const x = Phaser.Math.Between(minX, maxX);
    return scene.physics.add.sprite(x, y, key);
  };

  //Set name  for character
  sandbox.setName = (refName: string, name: string) => {
    const sprite = sandbox[refName];
    if (!sprite) return;
    scene.add.text(sprite.x, sprite.y - 50, name, {
      font: "20px Arial",
      color: "#ffffff",
    });
  };

  //Set size
  sandbox.scale = (refName: string, factor: number) => {
    const sprite = sandbox[refName];
    if (!sprite) return;
    sprite.setScale(factor);
  };

  //support when controls onKey
  sandbox.move = (refName: string, dx: number, dy: number) => {
    const sprite = sandbox[refName];
    if (!sprite) return;
    sprite.x += dx;
    sprite.y += dy;
  };

  //Go to new location
  sandbox.goto = (refName: string, x: number, y: number) => {
    const sprite = sandbox[refName];
    if (!sprite) return;
    sprite.x = x;
    sprite.y = y;
  };

  //Set up controls
  sandbox.onKey = (
    key: string,
    action: string,
    refName: string,
    ...params: any[]
  ) => {
    const sprite = sandbox[refName];
    if (!sprite) return;
    scene.input.keyboard?.on("keydown-" + key.toUpperCase(), () => {
      if (action === "move") sandbox.move(refName, ...params);
      if (action === "jump") sprite.setVelocityY(-params[0]);
      if (action === "attack") {
        scene.events.emit("attack", refName);
      }
    });
  };

  sandbox.jump = (refName: string, height: number) => {
    const sprite = sandbox[refName];
    if (!sprite) return;
    sprite.setVelocityY(-height);
  };

  sandbox.moveRandom = (refName: string, minX: number, maxX: number) => {
    const sprite = sandbox[refName];
    if (!sprite) return;
    scene.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        sprite.x = Phaser.Math.Between(minX, maxX);
      },
    });
  };

  sandbox.jumpRandom = (refName: string, height: number) => {
    const sprite = sandbox[refName];
    if (!sprite) return;
    scene.time.addEvent({
      delay: 1500,
      loop: true,
      callback: () => {
        sprite.setVelocityY(-height);
      },
    });
  };

  sandbox.collect = (
    playerName: string,
    itemName: string,
    stat: string,
    value: number
  ) => {
    const player = sandbox[playerName];
    const item = sandbox[itemName];
    if (!player || !item) return;
    scene.physics.add.overlap(player, item, () => {
      item.destroy();
      scene.events.emit("stat-upgrade", { stat, value });
    });
  };

  sandbox.attackRandom = (refName: string, pattern: string, range: number) => {
    const sprite = sandbox[refName];
    if (!sprite) return;
    scene.time.addEvent({
      delay: 2000,
      loop: true,
      callback: () => {
        const beam = scene.physics.add.sprite(sprite.x, sprite.y, "boss_beam");
        beam.setVelocityX(pattern === "circle" ? 100 : -100);
        scene.time.delayedCall(3000, () => beam.destroy());
      },
    });
  };

  sandbox.collide = (
    target: string,
    hazard: string,
    effect: string,
    value: number
  ) => {
    const t = sandbox[target];
    const h = scene.physics.add.group({ key: hazard });
    if (!t) return;
    scene.physics.add.overlap(t, h, () => {
      if (effect === "loseHealth") {
        scene.events.emit("lose-health", value);
      }
    });
  };

  sandbox.when = (
    condition: string,
    value: number,
    effectType: string,
    effectName: string
  ) => {
    scene.events.on("check-condition", () => {
      if ((scene as any)[condition] === value) {
        scene.add.sprite(400, 240, effectName);
      }
    });
  };

  return sandbox;
}
