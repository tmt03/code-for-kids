type ProgressBarProps = {
    percentage: number;
};

export default function ProgressBar({ percentage }: ProgressBarProps) {
    // Đảm bảo phần trăm nằm trong khoảng 0-100
    const clampedPercentage = Math.min(100, Math.max(0, percentage));

    // Điều chỉnh vị trí của hiệp sĩ để không vượt ra ngoài khi percentage = 100
    const knightPosition = clampedPercentage === 100 ? "calc(100% - 64px)" : `calc(${clampedPercentage}% - 32px)`;

    return (
        <div className="relative w-full h-full max-w-md py-8 flex items-center">
            {/* Thanh Progress */}
            <div className=" w-full h-8 bg-[#D3D3D3] border-2 border-black shadow-[2px_2px_0px_0px_#000000] rounded-lg overflow-hidden">
                {/* Phần trăm hoàn thành */}
                <div
                    className="h-full bg-[#FFE082] border-black transition-all duration-500"
                    style={{ width: `${clampedPercentage}%` }}
                >
                    <span className="absolute inset-0 flex items-center justify-center text-black text-sm">
                        {clampedPercentage}%
                    </span>
                </div>
            </div>
            {/* Hiệp sĩ di chuyển theo tiến độ */}
            <div
                className="absolute top-[-12] transition-all duration-500 animate-bounce z-10"
                style={{ left: knightPosition }} // 32px là nửa chiều rộng của hiệp sĩ
            >
                <img
                    src="/assets/knight-avatar.png"
                    alt="Knight"
                    className="w-16 h-20 object-contain"
                    style={{ imageRendering: "pixelated" }}
                />
            </div>
        </div >
    );
}