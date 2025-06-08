"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// Import types only
import type * as Phaser from "phaser";

interface GameCanvasProps {
  quest: {
    id: string;
    mode: "creative" | "learning";
    code?: string;
  };
}

const GameCanvas: React.FC<GameCanvasProps> = ({ quest }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const gameRef = useRef<Phaser.Game | null>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !canvasRef.current || isInitializedRef.current) return;

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
            debug: true,
          },
        },
        scene: new Game_Scene(quest),
      };

      const game = new Phaser.Game(config);
      gameRef.current = game;
      isInitializedRef.current = true;

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
          isInitializedRef.current = false;
        }
      };
    };

    const initPhaserPromise = initPhaser();
    return () => {
      initPhaserPromise.then((cleanupFn) => cleanupFn?.());
    };
  }, [isClient, quest.id, quest.mode]); // Chỉ khởi tạo lại khi id hoặc mode thay đổi

  // Lắng nghe sự kiện reset-canvas
  useEffect(() => {
    const handleReset = () => {
      if (gameRef.current) {
        gameRef.current.scene.scenes.forEach((scene) => {
          scene.scene.restart();
        });
      }
    };

    window.addEventListener("reset-canvas", handleReset);
    return () => {
      window.removeEventListener("reset-canvas", handleReset);
    };
  }, []);

  // Lắng nghe sự kiện run-user-code
  useEffect(() => {
    const handleRunCode = (event: CustomEvent) => {
      console.log("GameCanvas received run-user-code event:", event.detail);
      if (gameRef.current) {
        console.log("Emitting run-user-code to scene");
        gameRef.current.scene.scenes.forEach((scene) => {
          scene.sys.events.emit("run-user-code", event.detail.code);
        });
      } else {
        console.warn("Game not initialized when run-user-code event received");
      }
    };

    window.addEventListener("run-user-code", handleRunCode as EventListener);
    return () => {
      window.removeEventListener("run-user-code", handleRunCode as EventListener);
    };
  }, []);

  // Nếu quest là null, không render canvas
  if (!quest) {
    return <div className="w-full h-full flex items-center justify-center text-gray-500">Chưa tải được nhiệm vụ</div>;
  }

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