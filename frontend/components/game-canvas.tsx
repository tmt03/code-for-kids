import React from "react";

interface GameCanvasProps {
    chapterId: number; //id cua chapter
    baseCode: string; //base code ban dau khoi tao
    taskCode: string; //code nhiem vu cua tre
    width?: number;
    height?: number;
}

const GameCanvas: React.FC<GameCanvasProps> = ({
    chapterId,
    baseCode,
    taskCode,
    width,
    height,
}) => {

    return (
        <div
            className="w-full h-full max-w-[1200px] mx-auto border-2 border-gray-500 rounded-lg bg-white"
            style={{
                aspectRatio: '5/3', // Tỷ lệ 800:480, có thể đổi thành 16:9 nếu muốn
            }}
        >
            {/* Placeholder cho khung game */}
            <div className="w-full h-full flex items-center justify-center text-gray-500">
                Khung game Chương {chapterId}
            </div>
        </div>
    );
};

export default GameCanvas;