"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// Import types only
import type * as Phaser from "phaser";

interface GameCanvasProps {
  quest: {
    id: string;
    name: string;
    baseCode: string;
    mode: "guided" | "free";
  };
}

const GameCanvas: React.FC<GameCanvasProps> = ({ quest }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !canvasRef.current) return;

    const initPhaser = async () => {
      const Phaser = (await import("phaser")).default;
      const { Game_Scene } = await import("../game/gameScene");

      const container = canvasRef.current!;
      const LOGICAL_WIDTH = 1440;
      const LOGICAL_HEIGHT = 720;

      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: LOGICAL_WIDTH,
        height: LOGICAL_HEIGHT,
        parent: container as HTMLElement,
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          min: {
            width: 720,
            height: 360,
          },
          max: {
            width: 2880,
            height: 1440,
          },
        },
        physics: {
          default: "arcade",
          arcade: {
            gravity: { y: 600, x: 0 },
            debug: process.env.NODE_ENV === "development",
          },
        },
        scene: new Game_Scene(quest),
      };

      const game = new Phaser.Game(config);
      gameRef.current = game;

      const resizeObserver = new ResizeObserver(() => {
        if (gameRef.current) {
          const newWidth = container.clientWidth;
          const newHeight = container.clientHeight;
          game.scale.resize(newWidth, newHeight);
        }
      });
      resizeObserver.observe(container);

      return () => {
        resizeObserver.disconnect();
        if (gameRef.current) {
          gameRef.current.destroy(true);
          gameRef.current = null;
        }
      };
    };

    const initPhaserPromise = initPhaser();
    return () => {
      initPhaserPromise.then((cleanupFn) => cleanupFn?.());
    };
  }, [isClient, quest]);

  return (
    <div
      ref={canvasRef}
      className="w-full h-full border-2 border-gray-500 bg-white"
      style={{
        borderRadius: "10px",
        overflow: "hidden",
      }}
    />
  );
};

export default dynamic(() => Promise.resolve(GameCanvas), {
  ssr: false,
});