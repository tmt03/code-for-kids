type Props = {
    message: string;
};

export default function ChatBubble({ message }: Props) {
    return (
        <div className="bg-[#E0F7FA] text-gray-800 px-3 py-2 rounded-lg shadow-[2px_2px_0px_0px_#000000] border-2 border-black max-w-[60%] sm:max-w-[50%] relative">
            <p className="font-pixel text-xs sm:text-sm">{message}</p>
            <div className="absolute left-[-10px] bottom-2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-[#E0F7FA]"></div>
        </div>
    );
}