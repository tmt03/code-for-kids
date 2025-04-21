"use client";

import ChatBubble from '@/components/companion/chat-bubble';
import CompanionAvatar from '@/components/companion/companion-avatar';
import React from 'react';

interface InteractionBoxProps {
    message: string;
}


const InteractionBox: React.FC<InteractionBoxProps> = ({ message }: InteractionBoxProps) => {

    return (
        <div className="h-full p-4 bg-gray-50 text-gray-800 flex flex-row items-center border-2 border-gray-500 rounded-lg overflow-hidden">
            <CompanionAvatar message={message} />
            <ChatBubble message={message} />
        </div>
    );
};

export default InteractionBox;
