"use client";

import ChatBubble from '@/components/companion/chat-bubble';
import CompanionAvatar from '@/components/companion/companion-avatar';
import React, { useEffect, useState } from 'react';

interface InteractionBoxProps {
    message: string | { error?: string; smartHints?: string };
    showHint?: boolean;
}

const InteractionBox: React.FC<InteractionBoxProps> = ({
    message,
    showHint = false,
}) => {
    const [displayMessage, setDisplayMessage] = useState<{
        error?: string;
        smartHints?: string;
    }>({});

    useEffect(() => {
        if (typeof message === "string") {
            setDisplayMessage({ smartHints: message });
        } else {
            setDisplayMessage({
                error: message.error,
                smartHints: message.smartHints,
            });
        }
    }, [message]);

    const getClassName = () => {
        // Trạng thái Lỗi
        if (displayMessage.error) {
            return "bg-red-300 border-red-400 text-red-800";
        }
        // Trạng thái Thành công / Gợi ý
        if (displayMessage.smartHints && displayMessage.smartHints !== "Scriptbies luôn đồng hàng cùng bạn nhỏ!") {
            return "bg-emerald-300 border-emerald-400 text-emerald-800";
        }
        // Trạng thái Mặc định / Chào mừng
        return "bg-sky-200 border-sky-400 text-sky-800";
    };


    return (
        <div
            className={`h-full p-4 flex flex-row items-center border-2 rounded-lg overflow-hidden ${getClassName()} transition-all duration-500 ${showHint ? "opacity-100 scale-100" : "opacity-60 scale-95"
                }`}
        >
            <CompanionAvatar
                message={
                    displayMessage.error ||
                    displayMessage.smartHints ||
                    "Chúc mừng bạn đã hoàn thành!"
                }
            />
            <ChatBubble error={displayMessage.error} smartHints={displayMessage.smartHints} />
        </div>
    );
};

export default InteractionBox;
