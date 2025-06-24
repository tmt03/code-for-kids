import Link from "next/link";
import { FaHistory, FaShoppingCart } from "react-icons/fa";

export default function SidebarShop() {
    return (
        <aside className="w-full sm:w-60 bg-gradient-to-b from-yellow-200 to-pink-200 rounded-3xl shadow-xl p-6 flex flex-col gap-6 items-center mt-6 mx-auto sm:mx-0">
            <Link href="/shop" className="w-full flex items-center gap-3 p-3 rounded-xl text-lg font-bold text-pink-700 bg-white hover:bg-yellow-100 transition-all shadow hover:scale-105">
                <FaShoppingCart size={24} className="text-yellow-400" />
                Cửa hàng
            </Link>
            <Link href="/shop/order-history" className="w-full flex items-center gap-3 p-3 rounded-xl text-lg font-bold text-pink-700 bg-white hover:bg-yellow-100 transition-all shadow hover:scale-105">
                <FaHistory size={24} className="text-blue-400" />
                Đơn hàng của tôi
            </Link>
        </aside>
    );
}