"use client"

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CourseCard() {
    const router = useRouter();

    // Hàm xử lý chuyển hướng khi nhấn nút
    const handleButtonClick = () => {
        router.push(`/learn/chapters`);
    };

    return (
        <div className="relative w-80 h-48 bg-[#1C2526] rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#000000] overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/assets/book1-bg.png')" }}
            >
                {/* Lớp phủ để tăng độ tương phản cho nội dung */}
                <div className="absolute inset-0 bg-black opacity-60"></div>
            </div>

            {/* Nội dung thẻ */}
            <div className="relative z-10 flex flex-col h-full p-4 text-white">
                {/* Hàng chứa "Course 1" và "Độ khó: Dễ" */}
                <div className="flex items-center justify-between gap-2">
                    <Button variant="pixelDanger" size="sm" className="bg-[#FF4040] shadow-[2px_2px_0px_0px_#000000]">
                        Book 1
                    </Button>
                    <Button variant="pixelYellow" size="sm" className=" shadow-[2px_2px_0px_0px_#000000]">
                        Độ khó: Dễ
                    </Button>
                </div>

                {/* Tiêu đề khóa học */}
                <h3 className="mt-2 text-2xl font-bold tracking-wide">Phưu lưu ở thế giới code</h3>

                {/* Mô tả khóa học */}
                <p className="mt-1 text-sm leading-tight">
                    Làm quen với việc học code thông qua trò chơi...
                </p>

                {/* Nút "Start" */}
                <div className="mt-auto flex justify-end">
                    <Button
                        onClick={() => handleButtonClick()} // Thêm sự kiện onClick
                        variant="default"
                        className="bg-[#FF4040] text-white font-bold px-3 py-1 rounded-sm shadow-[2px_2px_0px_0px_#000000] hover:bg-[#FF6666] transition-colors"
                    >
                        Start
                    </Button>
                </div>
            </div>


        </div>
    );
}