"use client";

import { useEffect, useRef } from "react";
import * as Phaser from "phaser";
import { GameScene } from "../game/game-scene";

interface GameCanvasProps {
  chapterId: number;
  baseCode: string;
  taskCode: string;
  width?: number;
  height?: number;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ chapterId }) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    class Preloader extends Phaser.Scene {
      constructor() {
        super("Preloader");
      }

      preload() {
        const basePath = `/chapters_game/Chap_${chapterId}/chapter_${chapterId}/assets`;

        this.load.setPath(`${basePath}/background`);
        if (chapterId === 1) {
          // Chapter 1 assets
          this.load.image("background", "sky/sky_7.png");
          this.load.image("floor", "ground/ground_2.png");
          this.load.image("castle", "castle/castle.png");
          this.load.image("tree", "tree/tree_4.png");
          this.load.image("shrub", "tree/shrub_3.png");
          this.load.image("rock", "rock/rock_4.png");
        } else if (chapterId === 2) {
          // Chapter 2 assets
          this.load.image("background", "sky/sky_4.png");
          this.load.image("floor", "ground/ground_2.png");
          this.load.image("castle", "castle/kingdom_1.png");
          this.load.image("tree", "tree/tree_3.png");
          this.load.image("shrub", "tree/shrub_1.png");
          this.load.image("rock", "rock/rock_1.png");
        }

        this.load.setPath(`${basePath}/player`);
        if (chapterId === 1) {
          // Chapter 1 player assets
          this.load.image("sword", "sword.png");
          this.load.spritesheet("player_run", "player_run.png", {
            frameWidth: 96,
            frameHeight: 64,
          });
          this.load.spritesheet("player_idle", "player_idle.png", {
            frameWidth: 96,
            frameHeight: 64,
          });
          this.load.spritesheet("player_jump", "player_jump.png", {
            frameWidth: 96,
            frameHeight: 64,
          });
        } else if (chapterId === 2) {
          // Chapter 2 player assets
          this.load.image("sword", "sword.png");
          this.load.spritesheet("player_run", "player_run.png", {
            frameWidth: 96,
            frameHeight: 64,
          });
          this.load.spritesheet("player_idle", "player_idle.png", {
            frameWidth: 96,
            frameHeight: 64,
          });
          this.load.spritesheet("player_jump", "player_jump.png", {
            frameWidth: 96,
            frameHeight: 64,
          });
        }
      }

      create() {
        this.anims.create({
          key: "run",
          frames: this.anims.generateFrameNumbers("player_run", { start: 0, end: 5 }),
          frameRate: 10,
          repeat: -1,
        });

        this.anims.create({
          key: "idle",
          frames: this.anims.generateFrameNumbers("player_idle", { start: 0, end: 4 }),
          frameRate: 6,
          repeat: -1,
        });

        this.anims.create({
          key: "jump",
          frames: this.anims.generateFrameNumbers("player_jump", { start: 0, end: 3 }),
          frameRate: 4,
          repeat: 0,
        });

        this.scene.start("GameScene");
      }
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 480,
      parent: canvasRef.current,
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: '100%',
        height: '100%',
      },
      physics: {
        default: "arcade",
        arcade: { 
          gravity: {
            y: 600,
            x: 0
          }, 
          debug: false 
        },
      },
      scene: [Preloader, new GameScene(chapterId)],
    };

    const game = new Phaser.Game(config);
    return () => game.destroy(true);
  }, [chapterId]);

  return (
    <div
      ref={canvasRef}
      className="w-full h-full max-w-[1200px] mx-auto border-2 border-gray-500 bg-white"
      style={{ aspectRatio: "5 / 3", width: "100%", height: "100%", borderRadius: "10px", overflow: "hidden" }}
    />
  );
};

export default GameCanvas;