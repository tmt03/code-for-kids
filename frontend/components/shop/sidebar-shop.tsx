'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHistory, FaShoppingCart } from "react-icons/fa";

export default function SidebarShop() {
    const pathname = usePathname();

    return (
        <aside className="w-full sm:w-60 bg-gradient-to-b from-[#E0F4F7] to-[#C1E7EB] rounded-3xl shadow-xl p-6 flex flex-col gap-6 items-center mt-6 mx-auto sm:mx-0">
            <Link
                href="/shop"
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-lg font-bold transition-all shadow hover:scale-105 ${pathname === "/shop"
                    ? "bg-[#FFD700] text-[#0A3D62]"
                    : "bg-white text-[#007C8D] hover:bg-[#E0F4F7]"
                    }`}
            >
                <FaShoppingCart size={24} className="text-[#FFBF00]" />
                Cửa hàng
            </Link>
            <Link
                href="/shop/order-history"
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-lg font-bold transition-all shadow hover:scale-105 ${pathname === "/shop/order-history"
                    ? "bg-[#FFD700] text-[#0A3D62]"
                    : "bg-white text-[#007C8D] hover:bg-[#E0F4F7]"
                    }`}
            >
                <FaHistory size={24} className="text-[#00A8B5]" />
                Đơn hàng của tôi
            </Link>
        </aside>
    );
}