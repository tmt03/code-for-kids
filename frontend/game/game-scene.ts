import * as Phaser from "phaser";

export class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private boss!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private chapterId: number;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private canJump: boolean = true;
  private wasOnGround: boolean = true;
  private bg!: Phaser.GameObjects.Image;
  private castle!: Phaser.GameObjects.Image;
  private tree!: Phaser.GameObjects.Image;
  private rock!: Phaser.GameObjects.Image;
  private shrub!: Phaser.GameObjects.Image;
  private floor!: Phaser.Physics.Arcade.Sprite;

  //hp bar
  private bossMaxHP: number = 100;
  private bossCurrentHP: number = 100;
  private bossHpBarBg!: Phaser.GameObjects.Graphics;
  private bossHpBar!: Phaser.GameObjects.Graphics;

  constructor(chapterId: number) {
    super("GameScene");
    this.chapterId = chapterId;
  }

  create() {
    // Set background
    if (this.chapterId !== 3) {
      this.bg = this.add.image(0, 0, "background").setOrigin(0).setScale(0.44);
    }

    // Setup platforms
    this.platforms = this.physics.add.staticGroup();

    if (this.chapterId === 1) {
      // Add floor
      this.floor = this.platforms.create(
        410,
        365,
        "floor"
      ) as Phaser.Physics.Arcade.Sprite;
      this.floor.setScale(0.27).refreshBody();

      // Add scenery
      this.rock = this.add
        .image(383, 340, "rock")
        .setOrigin(0, 1)
        .setScale(0.08);
      this.castle = this.add
        .image(600, 370, "castle")
        .setOrigin(0.5, 1)
        .setScale(0.35);
      this.tree = this.add
        .image(-50, 338, "tree")
        .setOrigin(0, 1)
        .setScale(0.2);
      this.shrub = this.add
        .image(700, 340, "shrub")
        .setOrigin(0, 1)
        .setScale(0.07);
    } else if (this.chapterId === 2) {
      // Add scenery
      this.castle = this.add
        .image(455, 383, "castle")
        .setOrigin(0.5, 1)
        .setScale(0.466);
      this.rock = this.add
        .image(-60, 413, "rock")
        .setOrigin(0, 1)
        .setScale(0.2);
      this.tree = this.add
        .image(20, 390, "tree")
        .setOrigin(0, 1)
        .setScale(0.23);
      this.shrub = this.add
        .image(-10, 378, "shrub")
        .setOrigin(0, 1)
        .setScale(0.07);

      // Add floor
      this.floor = this.platforms.create(
        410,
        395,
        "floor"
      ) as Phaser.Physics.Arcade.Sprite;
      this.floor.setScale(0.27).refreshBody();

      // Setup player
      this.player = this.physics.add.sprite(100, 480 - 300, "player_idle");
      this.player.setScale(1);
      this.player.setCollideWorldBounds(true);
      this.physics.add.collider(this.player, this.platforms);
    } else if (this.chapterId === 3) {
      // Setup chapter 3
      this.bg = this.add.image(0, 0, "background").setOrigin(0).setScale(0.45);

      // Add invisible platforms
      const redPlatform1 = this.add.rectangle(620, 340, 296, 60, 0xff0000);
      redPlatform1.setAlpha(0);
      this.physics.add.existing(redPlatform1, true);
      this.platforms.add(redPlatform1);

      const redPlatform2 = this.add.rectangle(100, 298, 214, 60, 0xff0000);
      redPlatform2.setAlpha(0);
      this.physics.add.existing(redPlatform2, true);
      this.platforms.add(redPlatform2);

      const redPlatform3 = this.add.rectangle(345, 370, 214, 60, 0xff0000);
      redPlatform3.setAlpha(0);
      this.physics.add.existing(redPlatform3, true);
      this.platforms.add(redPlatform3);

      // Setup player
      if (this.textures.exists("player_idle")) {
        this.player = this.physics.add.sprite(100, 200, "player_idle");
        this.player.setScale(1);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.platforms);
        this.player.anims.play("idle", true);
      } else {
        console.error("Player texture not found!");
      }
    } else if (this.chapterId === 6) {
      //Setup background
      this.bg = this.add
        .image(0, 0, "bg_mountain_1")
        .setOrigin(0)
        .setScale(0.55);

      //Setup floor
      this.floor = this.platforms.create(
        410,
        435,
        "floor_ground_1"
      ) as Phaser.Physics.Arcade.Sprite;
      this.floor.setScale(0.8).refreshBody();

      // Tạo thanh máu
      this.createBossHealthBar();

      //Setup Boss
      if (this.textures.exists("monitaur_idle")) {
        this.boss = this.physics.add.sprite(400, 100, "monitaur_idle");
        this.boss.setScale(2);
        this.boss.setCollideWorldBounds(true);
        this.physics.add.collider(this.boss, this.platforms);
        this.boss.anims.play("idle", true);
      } else {
        console.error("Monitaur texture not found!");
      }
    }

    // Setup controls
    if (this.input && this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }
  }

  update() {
    if (!this.player || !this.player.anims) return;

    // Left/Right movement
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      if (this.player.body && this.player.body.touching.down) {
        this.player.anims.play("run", true);
      }
      this.player.flipX = true;
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      if (this.player.body && this.player.body.touching.down) {
        this.player.anims.play("run", true);
      }
      this.player.flipX = false;
    } else {
      this.player.setVelocityX(0);
      if (this.player.body && this.player.body.touching.down) {
        this.player.anims.play("idle", true);
      }
    }

    // Ground check
    const onGround = this.player.body && this.player.body.touching.down;

    // Jump animation
    if (!onGround && this.wasOnGround) {
      this.player.anims.play("jump", true);
    }

    // Land animation
    if (onGround && !this.wasOnGround) {
      if (this.player.body && this.player.body.velocity.x !== 0) {
        this.player.anims.play("run", true);
      } else {
        this.player.anims.play("idle", true);
      }
    }

    this.wasOnGround = !!onGround;

    // Jump control
    if ((this.cursors.up.isDown || this.cursors.space.isDown) && this.canJump) {
      this.player.setVelocityY(-300);
      this.canJump = false;
    }

    // Reset jump
    if (onGround) {
      this.canJump = true;
    }
  }

  private createBossHealthBar() {
    const barWidth = 200;
    const barHeight = 20;
    const padding = 30;

    const x = this.cameras.main.width - barWidth - padding;
    const y = padding;

    // Nền đen
    this.bossHpBarBg = this.add.graphics();
    this.bossHpBarBg.fillStyle(0x000000);
    this.bossHpBarBg.fillRect(x - 2, y - 2, barWidth + 4, barHeight + 4);

    // Thanh máu
    this.bossHpBar = this.add.graphics();
    this.bossHpBar.setPosition(x, y);
    this.updateBossHealthBar();
  }

  private updateBossHealthBar() {
    const barWidth = 200;
    const barHeight = 20;
    this.bossHpBar.clear();
    this.bossHpBar.fillStyle(0xff0000);
    const hpWidth = (this.bossCurrentHP / this.bossMaxHP) * barWidth;
    this.bossHpBar.fillRect(0, 0, hpWidth, barHeight);
  }

  private damageBoss(amount: number) {
    this.bossCurrentHP = Math.max(this.bossCurrentHP - amount, 0);
    this.updateBossHealthBar();
    console.log("Boss HP:", this.bossCurrentHP);
  }
}
