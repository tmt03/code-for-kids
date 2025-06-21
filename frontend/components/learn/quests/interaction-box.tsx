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
        if (displayMessage.error) return "bg-red-100 border-red-500";
        if (displayMessage.smartHints) return "bg-yellow-100 border-yellow-500";
        return "bg-gray-50 border-gray-500";
    };


    return (
        <div
            className={`h-full p-4 text-gray-800 flex flex-row items-center border-2 rounded-lg overflow-hidden ${getClassName()} transition-opacity duration-300 ${showHint ? "opacity-100" : "opacity-200"
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
