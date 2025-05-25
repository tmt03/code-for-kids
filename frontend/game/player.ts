import * as Phaser from "phaser";

export class Player {
    private sprite: Phaser.Physics.Arcade.Sprite;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private canJump: boolean = true;
    private wasOnGround: boolean = true;
    private gameWidth: number;
    private gameHeight: number;
    private nameText: Phaser.GameObjects.Text;
    private static readonly DEFAULT_NAME: string = "Duy_BO_DOI";
    private canMove: boolean = true;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.gameWidth = scene.game.config.width as number;
        this.gameHeight = scene.game.config.height as number;

        // Create player sprite
        this.sprite = scene.physics.add.sprite(x, y, "player_idle");
        
        // Set player properties
        const playerScale = (this.gameWidth / 1000) * 1.5;
        this.sprite.setScale(playerScale);
        this.sprite.setCollideWorldBounds(true);

        // Add player name text
        this.nameText = scene.add.text(x, y - 50, Player.DEFAULT_NAME, {
            fontSize: '15px',
            color: '#ffffff',
            align: 'center',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 2,
                stroke: true,
                fill: true
            }
        });
        this.nameText.setOrigin(0.5);
        this.nameText.setDepth(10); // Center the text

        // Setup controls
        if (scene.input && scene.input.keyboard) {
            this.cursors = scene.input.keyboard.createCursorKeys();
        } else {
            // Tạo một đối tượng cursors giả nếu keyboard không khả dụng
            this.cursors = {
                up: { isDown: false },
                down: { isDown: false },
                left: { isDown: false },
                right: { isDown: false },
                space: { isDown: false },
                shift: { isDown: false }
            } as Phaser.Types.Input.Keyboard.CursorKeys;
        }
    }

    // Method to get the sprite for collision detection
    public getSprite(): Phaser.Physics.Arcade.Sprite {
        return this.sprite;
    }

    // Add collision with platforms
    public addCollider(platforms: Phaser.Physics.Arcade.StaticGroup) {
        this.sprite.scene.physics.add.collider(this.sprite, platforms);
    }

    // Method to update player name
    public setPlayerName(name: string) {
        this.nameText.setText(name);
    }

    // Method to enable/disable movement
    public setMovementEnabled(enabled: boolean) {
        this.canMove = enabled;
        if (!enabled) {
            // Stop all movement when disabled
            this.sprite.setVelocity(0, 0);
            this.sprite.anims.play("idle", true);
        }
    }

    // Update method to be called in the scene's update
    public update() {
        if (!this.sprite || !this.sprite.anims) return;

        // Update name text position to follow player
        this.nameText.setPosition(this.sprite.x, this.sprite.y - this.sprite.displayHeight/2 - 10);

        if (!this.canMove) {
            // If movement is disabled, only update the name position
            return;
        }

        const baseSpeed = this.gameWidth * 0.25; // Speed relative to game width

        // Left/Right movement
        if (this.cursors.left.isDown) {
            this.sprite.setVelocityX(-baseSpeed);
            if (this.sprite.body && this.sprite.body.touching.down) {
                this.sprite.anims.play("run", true);
            }
            this.sprite.flipX = true;
        } else if (this.cursors.right.isDown) {
            this.sprite.setVelocityX(baseSpeed);
            if (this.sprite.body && this.sprite.body.touching.down) {
                this.sprite.anims.play("run", true);
            }
            this.sprite.flipX = false;
        } else {
            this.sprite.setVelocityX(0);
            if (this.sprite.body && this.sprite.body.touching.down) {
                this.sprite.anims.play("idle", true);
            }
        }

        // Ground check
        const onGround = this.sprite.body && this.sprite.body.touching.down;

        // Jump animation
        if (!onGround && this.wasOnGround) {
            this.sprite.anims.play("jump", true);
        }

        // Land animation
        if (onGround && !this.wasOnGround) {
            if (this.sprite.body && this.sprite.body.velocity.x !== 0) {
                this.sprite.anims.play("run", true);
            } else {
                this.sprite.anims.play("idle", true);
            }
        }

        this.wasOnGround = !!onGround;

        // Jump control
        if ((this.cursors.up.isDown || this.cursors.space.isDown) && this.canJump && onGround) {
            this.sprite.setVelocityY(-this.gameHeight * 1);
            this.canJump = false;
        }

        // Reset jump
        if (onGround) {
            this.canJump = true;
        }
    }

    // Method to set player position
    public setPosition(x: number, y: number) {
        this.sprite.setPosition(x, y);
        this.nameText.setPosition(x, y - this.sprite.displayHeight/2 - 10);
    }

    // Method to get player position
    public getPosition(): { x: number; y: number } {
        return { x: this.sprite.x, y: this.sprite.y };
    }

    // Method to play a specific animation
    public playAnimation(key: string) {
        this.sprite.anims.play(key, true);
    }

    // Method to destroy player and cleanup
    public destroy() {
        this.nameText.destroy();
        this.sprite.destroy();
    }
} 