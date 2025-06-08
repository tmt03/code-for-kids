"use client";

import { useAuth } from "@/hooks/useAuth";
import { ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [unauthorized, setUnauthorized] = useState(false);

    useEffect(() => {
        if (!isLoading && !user) {
            setUnauthorized(true);
        }
    }, [user, isLoading]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen text-lg font-semibold">
                🔒 Đang kiểm tra xác thực...
            </div>
        );
    }

    if (unauthorized) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-100 to-pink-200 text-center px-4">
                <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full border border-red-300">
                    <div className="flex justify-center mb-4 text-red-500">
                        <ShieldAlert className="w-12 h-12" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-red-600">
                        Bạn chưa đăng nhập!
                    </h2>
                    <p className="text-gray-700 mb-6">
                        Vui lòng đăng nhập để tiếp tục truy cập trang này.
                    </p>
                    <Button
                        variant="pixelDanger"
                        size="lg"
                        onClick={() => router.push("/login")}
                        className="w-full"
                    >
                        🔐 Đến trang đăng nhập
                    </Button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
