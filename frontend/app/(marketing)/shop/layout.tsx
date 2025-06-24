"use client";

import Footer from "@/components/layouts/footer";
import Header from "@/components/layouts/header";
import SidebarShop from "@/components/shop/sidebar-shop";
import { useAuth } from "@/hooks/useAuth";
import { Toaster } from "sonner";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 sm:gap-6 pt-20 pb-8">
        <div className="sm:block hidden w-full sm:w-60 mb-4 sm:mb-0">
          <SidebarShop />
        </div>
        <main className="flex-1 p-2 sm:p-6 bg-white rounded-3xl shadow-lg min-h-[60vh]">
          {children}
          <Toaster richColors position="top-center" />
        </main>
      </div>
      <Footer />
    </div>
  );
}
