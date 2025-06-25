"use client";

import {
    faBox,
    faCog,
    faShoppingCart,
    faUsers,
    faVideo
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarAdmin() {
    const pathname = usePathname();

    const menuItems = [
        {
            href: "/dashboard/product-management",
            icon: faBox,
            label: "Quản lý Sản phẩm",
            description: "Thêm, sửa, xóa sản phẩm"
        },
        {
            href: "/dashboard/account-management",
            icon: faUsers,
            label: "Quản lý Tài khoản",
            description: "Quản lý người dùng"
        },
        {
            href: "/dashboard/order-management",
            icon: faShoppingCart,
            label: "Quản lý Đơn hàng",
            description: "Xử lý đơn hàng"
        },
        {
            href: "/dashboard/video-tutorial",
            icon: faVideo,
            label: "Quản lý Video",
            description: "Video hướng dẫn"
        }
    ];

    return (
        <aside className="w-64 bg-white shadow-lg border-r border-gray-200 fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="p-6">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin Panel</h2>
                    <p className="text-sm text-gray-600">Quản lý hệ thống</p>
                </div>

                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                                    }`}
                            >
                                <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 ${isActive
                                    ? "bg-white/20 text-white"
                                    : "bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600"
                                    }`}>
                                    <FontAwesomeIcon icon={item.icon} className="text-sm" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className={`font-medium text-sm ${isActive ? "text-white" : "text-gray-900"
                                        }`}>
                                        {item.label}
                                    </div>
                                    <div className={`text-xs ${isActive ? "text-white/80" : "text-gray-500"
                                        }`}>
                                        {item.description}
                                    </div>
                                </div>
                                {isActive && (
                                    <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-3 px-4 py-3 text-gray-500">
                        <FontAwesomeIcon icon={faCog} className="text-sm" />
                        <span className="text-sm font-medium">Cài đặt hệ thống</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}