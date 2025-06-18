// components/under-construction.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function UnderConstruction() {
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#E0F4F7] to-[#C1E7EB] flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md text-center transform hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-[#00A8B5] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <span className="text-3xl text-white">🚧</span>
                </div>
                <h2 className="text-3xl font-bold text-[#007C8D] mb-4">Tính năng đang được cập nhật!</h2>
                <p className="text-lg text-[#0A3D62] mb-6">
                    Chúng tôi đang nỗ lực để mang đến trải nghiệm tốt nhất cho bạn. Vui lòng quay lại sau!
                </p>
                <Button
                    onClick={handleBack}
                    variant="pixel"
                    className="bg-[#00A8B5] hover:bg-[#0096A5] text-white px-6 py-3 rounded-lg font-semibold"
                >
                    Quay lại
                </Button>
            </div>
        </div>
    );
}