"use client";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* ✅ Header dùng chung */}
      <Header />

      {/* ✅ Sidebar + Main content */}
      <div className="flex flex-1">
        {/* Sidebar bên trái */}
        <aside className="w-64 bg-gray-100 p-6 border-r border-gray-300">
          <h2 className="text-xl font-bold mb-6">Menu</h2>
          <nav className="flex flex-col space-y-4">
            <Link href="/shop" className="text-blue-700 font-medium hover:underline">
              🛒 Sản phẩm
            </Link>

            {!user && (
              <Link href="/shop/lookup" className="text-blue-700 hover:underline">
                🔍 Tra cứu đơn hàng
              </Link>
            )}

            {/* ✅ Lịch sử đơn hàng chỉ hiển thị nếu user đã đăng nhập */}
            {user?.role === "user" && (
              <Link href="/shop/orders/history" className="text-blue-700 font-medium hover:underline">
                📜 Lịch sử đơn hàng
              </Link>
            )}

            {/* ✅ Tùy chọn cho admin */}
            {user?.role === "admin" && (
              <Link href="shop/orders/manage" className="text-red-600 font-medium hover:underline">
                🛠 Quản lý đơn hàng
              </Link>
            )}
          </nav>
        </aside>

        {/* Nội dung chính */}
        <main className="flex-1 p-8 bg-gray-50">{children}</main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
