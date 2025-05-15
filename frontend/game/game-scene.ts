import * as Phaser from "phaser";

export class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private chapterId: number;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private canJump: boolean = true;
  private wasOnGround: boolean = true;

  constructor(chapterId: number) {
    super("GameScene");
    this.chapterId = chapterId;
  }

  create() {
    // Background
    const bg = this.add.image(0, 0, "background").setOrigin(0);
    bg.setScale(750 / bg.width, 380 / bg.height);

    // Tạo platforms group
    this.platforms = this.physics.add.staticGroup();

    //Chap_1
    if (this.chapterId === 1) {
      // Floor - tạo platform
      const floor = this.platforms.create(355, 360, "floor") as Phaser.Physics.Arcade.Sprite;
      floor.setScale(0.25).refreshBody();

      // Rock
      this.add.image(383, 335, "rock").setOrigin(0, 1).setScale(0.08);

      // Castle
      this.add.image(600, 365, "castle").setOrigin(0.5, 1).setScale(0.35);

      // Tree
      this.add.image(-50, 335, "tree").setOrigin(0, 1).setScale(0.2);

      // Shrub
      this.add.image(700, 333, "shrub").setOrigin(0, 1).setScale(0.07);

      // Player
      this.player = this.physics.add.sprite(200, 480 - 300, "player_idle");
      this.player.setScale(1);
      this.player.setCollideWorldBounds(true);

      //Chap_2
    } else if (this.chapterId === 2) {
      // Castle - đặt ở giữa phải
      this.add.image(432, 348, "castle").setOrigin(0.5, 1).setScale(0.47);

      // Rock - đặt ở giữa trái
      this.add.image(-60, 380, "rock").setOrigin(0, 1).setScale(0.2);

      // Tree - đặt ở góc phải
      this.add.image(20, 347, "tree").setOrigin(0, 1).setScale(0.2);

      // Shrub - đặt ở góc trái
      this.add.image(-10, 345, "shrub").setOrigin(0, 1).setScale(0.07);

      // Floor - tạo platform
      const floor = this.platforms.create(355, 360, "floor") as Phaser.Physics.Arcade.Sprite;
      floor.setScale(0.25).refreshBody();

      // Player
      this.player = this.physics.add.sprite(100, 480 - 300, "player_idle");
      this.player.setScale(1);
      this.player.setCollideWorldBounds(true);
    }

    // Thêm va chạm giữa player và platforms
    this.physics.add.collider(this.player, this.platforms);

    // Khởi tạo bàn phím
    if (this.input && this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }
  }

  update() {
    if (!this.player) return;

    // Xử lý di chuyển
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

    // Kiểm tra trạng thái chạm đất
    const onGround = this.player.body && this.player.body.touching.down;

    // Nếu vừa nhảy lên (từ chạm đất sang trên không)
    if (!onGround && this.wasOnGround) {
      this.player.anims.play("jump", true);
    }

    // Nếu vừa tiếp đất (từ trên không sang chạm đất)
    if (onGround && !this.wasOnGround) {
      if (this.player.body && this.player.body.velocity.x !== 0) {
        this.player.anims.play("run", true);
      } else {
        this.player.anims.play("idle", true);
      }
    }

    this.wasOnGround = !!onGround;

    // Xử lý nhảy
    if ((this.cursors.up.isDown || this.cursors.space.isDown) && this.canJump) {
      this.player.setVelocityY(-300);
      this.canJump = false;
      // Không cần play jump ở đây nữa!
    }

    // Reset canJump khi player chạm đất
    if (onGround) {
      this.canJump = true;
    }
  }
}