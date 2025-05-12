"use client";

import { useEffect, useRef } from "react";
import * as Phaser from "phaser";
import { GameScene } from "../game/game-scene";
import { Preloader } from "../game/preloader";

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
      scene: [new Preloader(chapterId), new GameScene(chapterId)],
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