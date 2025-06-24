import Link from "next/link";

export default function SidebarAdmin() {
    return (

        < aside className="w-64 bg-gray-100 p-6 border-r border-gray-300" >
            <h2 className="text-xl font-bold mb-6">Menu</h2>
            <nav className="flex flex-col space-y-4">
                <Link href="/dashboard/product-management" className="text-blue-700 font-medium hover:underline">
                    🛒 Quản lý Sản phẩm
                </Link>

                <Link href="/dashboard/account-management" className="text-blue-700 font-medium hover:underline">
                    🛒 Quản lý Tài khoản
                </Link>

                <Link href="/dashboard/order-management" className="text-red-600 font-medium hover:underline">
                    🛠 Quản lý đơn hàng
                </Link>

                <Link href="/dashboard/video-tutorial" className="text-red-600 font-medium hover:underline">
                    🛠 Quản lý video hướng dẫn
                </Link>
            </nav>
        </aside >
    )
}