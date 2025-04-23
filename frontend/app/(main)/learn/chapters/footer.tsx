"use client"

import ProgressBar from "@/components/progressbar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


export default function FooterChapter() {
    const router = useRouter();

    // Hàm xử lý chuyển hướng khi nhấn nút
    const handleButtonClick = (chapterId: number) => {
        router.push(``);
    };

    return (
        <div className="lg:block h-20 w-full border-slate-200 p-2">
            <div className="max-w-screen-lg flex items-center justify-around h-full mx-auto">
                <Button variant="pixel" className="w-20">Trở Về</Button>
                <ProgressBar percentage={50} />
                <Button variant="pixel" className="w-20">Tiếp theo</Button>
            </div>
        </div >
    )
}