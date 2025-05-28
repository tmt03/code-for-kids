interface Props {
    error?: string;
    smartHints?: string;
}

export default function ChatBubble({ error, smartHints }: Props) {
    return (
        <div className="bg-[#E0F7FA] text-gray-800 px-3 py-2 rounded-lg shadow-[2px_2px_0px_0px_#000000] border-2 border-black max-w-[60%] sm:max-w-[50%] relative">
            {error && (
                <div className="text-red-600 font-bold mb-1 font-pixel text-xs sm:text-sm">
                    ❌ {error}
                </div>
            )}
            {smartHints && (
                <div className="text-yellow-700 font-pixel text-xs sm:text-sm">
                    💡 {smartHints}
                </div>
            )}
            <div className="absolute left-[-10px] bottom-2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-[#E0F7FA]"></div>
        </div>
    );
}