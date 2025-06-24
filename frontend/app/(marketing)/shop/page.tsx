'use client';

import OrderPopup from "@/components/shop/order-popup";
import ProductCard from "@/components/shop/product-card";
import { useAuth } from "@/hooks/useAuth";
import axiosInstance from "@/lib/utils/axiosInstance";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Product } from "../../../types/product";

export default function ShopPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [purchasedProductIds, setPurchasedProductIds] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    axiosInstance
      .get("/v1/products/all")
      .then((res) => {
        console.log("Dữ liệu sản phẩm:", res.data);
        const productsData = res.data.data || res.data;
        setProducts(productsData);
      })
      .catch((err) => {
        console.error("Lỗi lấy sản phẩm:", err);
        toast.error("Không thể tải danh sách sản phẩm");
      });
  }, []);

  const handleSubmitOrder = async (data: any) => {
    const payload = {
      ...data,
      role: user?.role,
      createdBy: user?.username,
      status: "pending",
    };

    const response = await axiosInstance.post("/v1/orders/create", payload);
    return response.data;
  };

  return (
    <div className="min-h-screen p-0 sm:p-6 bg-gradient-to-b from-[#E0F4F7] to-[#C1E7EB] text-[#0A3D62]">
      <h1 className="text-4xl font-extrabold text-center mb-10 mt-8 text-[#007C8D] drop-shadow-2xl">
        🕹️ Cửa hàng huyền thoại
      </h1>

      <div className="grid grid-cols-1 gap-8 max-w-5xl mx-auto">
        {products.map((product) => (
          <ProductCard
            key={product.pid}
            pid={product.pid}
            image={product.pimg}
            name={product.pname}
            quantity={product.pquantity}
            price={product.pprice}
            description={product.pdescription}
            product={product}
            locked={!purchasedProductIds.includes(product.pid?.toString())}
            onBuyClick={(prod) => {
              if (!user) {
                toast.error("Hãy đăng nhập để có thể nhận hỗ trợ và mua sản phẩm của Scriptbies", {
                  action: {
                    label: "Đăng nhập",
                    onClick: () => router.push("/login"),
                  },
                });
                return;
              }
              setSelectedProduct(product);
              setIsPopupOpen(true);
            }}
          />
        ))}
      </div>
      {selectedProduct && (
        <OrderPopup
          open={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          product={selectedProduct}
          onSubmit={handleSubmitOrder}
          user={user || undefined}
        />
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out;
        }
        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out;
        }
      `}</style>
    </div>
  );
}