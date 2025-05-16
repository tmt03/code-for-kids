// src/components/companion/ChapterTaskPopup.tsx
import React from 'react';

// Định nghĩa kiểu dữ liệu cho Task và Chapter (có thể import từ nơi khác nếu đã định nghĩa chung)
interface Task {
    id: number;
    title: string;
    isChallenge?: boolean;
}

interface Chapter {
    id: number;
    title: string;
    description: string; // Mặc dù không dùng trong popup nhưng giữ để nhất quán
    status: string; // Mặc dù không dùng trong popup nhưng giữ để nhất quán
    isSpecial?: boolean; // Mặc dù không dùng trong popup nhưng giữ để nhất quán
    tasks: Task[];
}

// Định nghĩa props cho component Popup
interface ChapterTaskPopupProps {
    chapter: Chapter | null; // Chapter cần hiển thị, hoặc null nếu ẩn
    onClose: () => void; // Hàm để đóng popup
}

export default function ChapterTaskPopup({ chapter, onClose }: ChapterTaskPopupProps) {
    // Nếu không có chapter nào được chọn thì không hiển thị gì cả
    if (!chapter) {
        return null;
    }

    // Hàm xử lý khi click vào lớp phủ nền (overlay) để đóng popup
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Chỉ đóng nếu click trực tiếp vào overlay, không phải vào content bên trong
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={handleOverlayClick} // Click ra ngoài popup để đóng
            role="dialog" // Vai trò cho accessibility
            aria-modal="true" // Đánh dấu là modal
            aria-labelledby="popup-title" // Liên kết với tiêu đề
        >
            <div
                className="bg-[#E6F0FA] border-2 border-black rounded-lg shadow-[6px_6px_0px_0px_#000000] p-6 max-w-md w-full relative animate-popup-appear" // Thêm animation nếu muốn
                onClick={(e) => e.stopPropagation()} // Ngăn click bên trong popup đóng popup
            >
                {/* Nút đóng popup */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-3xl leading-none font-bold text-gray-500 hover:text-black transition-colors p-1"
                    aria-label="Đóng popup"
                >
                    &times; {/* Ký tự X */}
                </button>

                {/* Nội dung popup */}
                <h3
                    id="popup-title" // ID cho aria-labelledby
                    className="text-xl font-bold text-[#104A7A] mb-4 text-center pr-6" // Thêm padding phải để không bị đè bởi nút X
                >
                    Nhiệm Vụ - {chapter.title}
                </h3>
                <ul className="w-full text-sm text-gray-800 space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar"> {/* Thêm scroll nếu quá dài và class scrollbar tùy chỉnh */}
                    {chapter.tasks.map((task) => (
                        <li
                            key={task.id}
                            className={`flex items-center gap-2 p-2 rounded border border-gray-300 ${
                                task.isChallenge ? "bg-[#FFF0F5] text-[#FF1493] font-semibold" : "bg-white"
                            }`}
                        >
                            <span className={`w-4 h-4 rounded-full border-2 ${task.isChallenge ? 'border-[#FF1493]' : 'border-black'} flex-shrink-0`}></span>
                            {task.isChallenge ? <span className="font-bold">CHALLENGE:</span> : ""}
                            <span className="flex-1">{task.title}</span> {/* Cho text tự xuống dòng */}
                        </li>
                    ))}
                </ul>
            </div>
            {/* Thêm CSS cho animation và scrollbar nếu muốn */}
            <style jsx global>{`
                @keyframes popup-appear {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-popup-appear {
                    animation: popup-appear 0.2s ease-out forwards;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #bdbdbd;
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #a5a5a5;
                }
            `}</style>
        </div>
    );
}