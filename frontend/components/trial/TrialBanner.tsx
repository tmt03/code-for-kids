// frontend/components/trial/TrialBanner.tsx
"use client";

import { useTrial } from "@/hooks/useTrial";
import { AlertTriangle, Clock, Crown } from "lucide-react";
import Link from "next/link";

export function TrialBanner() {
    const { isTrialMode, trialInfo, isExpired, daysLeft } = useTrial();

    if (!isTrialMode) return null;

    if (isExpired) {
        return (
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <AlertTriangle className="w-6 h-6" />
                        <span className="font-bold text-lg">Tài khoản thử nghiệm đã hết hạn!</span>
                    </div>
                    <p className="text-center mb-4 opacity-90">
                        Nâng cấp tài khoản để tiếp tục học lập trình và mở khóa tất cả tính năng
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link
                            href="/shop"
                            className="px-6 py-3 bg-white text-red-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Mua sách để mở khóa học
                        </Link>
                        <Link
                            href="/contact"
                            className="px-6 py-3 border border-white text-white rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors"
                        >
                            Liên hệ hỗ trợ
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 text-white p-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Crown className="w-6 h-6" />
                            <div>
                                <h3 className="font-bold text-lg">Chế độ thử nghiệm</h3>
                                <p className="text-sm opacity-90">
                                    Chỉ có thể học chương hướng dẫn • Còn {daysLeft} ngày
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4" />
                            <span>{daysLeft} ngày còn lại</span>
                        </div>

                        <div className="flex gap-2">
                            <Link
                                href="/shop"
                                className="px-4 py-2 bg-[#FFD700] hover:bg-[#E6C200] text-[#0A3D62] rounded-lg font-bold shadow-lg"
                            >
                                Nâng cấp khóa học
                            </Link>
                            {/* <button
                                onClick={() => window.open('/trial-info', '_blank')}
                                className="px-4 py-2 border border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                            >
                                Tìm hiểu thêm
                            </button> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}