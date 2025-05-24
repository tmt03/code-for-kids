"use client";

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from "react";

// Import types only
import type * as Phaser from "phaser";

interface GameCanvasProps {
  quest: {
    id: string;
    name: string;
    baseCode: string;
    mode: "guided" | "free";
  }
}

const GameCanvas: React.FC<GameCanvasProps> = ({ quest }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !canvasRef.current) return;

    const initPhaser = async () => {
      const Phaser = (await import('phaser')).default;
      const { GameScene } = await import('../game/game-scene');
      const { Preloader } = await import('../game/preloader');
      const { Game_Scene } = await import('../game/gameScene')

      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 800,
        height: 480,
        parent: canvasRef.current,
        scale: {
          mode: Phaser.Scale.ENVELOP,
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
        // scene: [new Preloader(chapterId, quest), new GameScene(chapterId, quest)],
        scene: new Game_Scene(quest)
      };

      const game = new Phaser.Game(config);
      return () => game.destroy(true);
    };

    const cleanup = initPhaser();
    return () => {
      cleanup.then(cleanupFn => cleanupFn?.());
    };
  }, [isClient, quest]);

  return (
    <div
      ref={canvasRef}
      className="w-full h-full max-w-[1200px] mx-auto border-2 border-gray-500 bg-white"
      style={{ aspectRatio: "5 / 3", width: "100%", height: "100%", borderRadius: "10px", overflow: "hidden" }}
    />
  );
};

export default dynamic(() => Promise.resolve(GameCanvas), {
  ssr: false
});