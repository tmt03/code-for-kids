'use client';

import OrderPopup from "@/components/shop/GuestOrderPopup";
import { useAuth } from "@/hooks/useAuth";
import axiosInstance from "@/lib/utils/axiosInstance";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Product } from "../../../types/product";

export default function ShopPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    axiosInstance
      .get("/api/products")
      .then((res) => {
        console.log("Dữ liệu sản phẩm:", res.data);
        setProducts(res.data);
      })
      .catch((err) => {
        console.error("Lỗi lấy sản phẩm:", err);
      });
  }, []);


  const handleBuyClick = (product: Product) => {
    setSelectedProduct(product);
    setIsPopupOpen(true);

  };

  const handleSubmitGuestOrder = async (data: any) => {
    const payload = {
      ...data,
      role: user?.role || "guest", // nếu đang login thì là user
      createdBy: user?.username || "guest",
      status: "pending", // status mặc định
    };

    try {
      await axiosInstance.post("/api/orders/create", payload);
      toast.success("Yêu cầu của bạn đã được gửi, vui lòng chờ xác nhận!");
    } catch (err) {
      console.error("Lỗi gửi order:", err);
      toast.error("Gửi đơn hàng thất bại!");
    } finally {
      setIsPopupOpen(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-center mb-10 mt-8">🛍️ Danh sách sản phẩm</h1>
      {user?.role === "admin" && (
        <div className="flex justify-end max-w-6xl mx-auto mb-6">
          <button
            onClick={() => window.location.href = "/shop/create"}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 4v16m8-8H4" />
            </svg>
            Thêm sản phẩm
          </button>
        </div>
      )}

      <div className="grid gap-8 max-w-6xl mx-auto">
        {products.map((product) => (
          <div
            key={product.pid}
            className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row items-start md:items-center transition hover:shadow-lg"
          >
            {/* Hình ảnh */}
            <div className="md:w-2/5 w-full">
              <img
                src={product.pimg}
                alt={product.pname}
                className="w-full h-60 object-contain bg-gray-100 rounded-md"
              />
            </div>

            {/* Thông tin */}
            <div className="md:w-3/5 w-full md:ml-6 mt-4 md:mt-0 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">{product.pname}</h2>
                <p className="whitespace-pre-line text-gray-700 text-sm mb-2">
                  {product.pdescription}
                </p>
                <p className="text-green-600 font-semibold text-lg mb-1">
                  {typeof product.pprice === "number"
                    ? product.pprice.toLocaleString("vi-VN") + "₫"
                    : "Không xác định"}
                </p>
                <p className="text-sm text-gray-500">Số lượng còn: {product.pquantity}</p>
              </div>

              {user?.role !== "admin" && (
                <button
                  onClick={() => handleBuyClick(product)}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded shadow"
                >
                  MUA NGAY
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <OrderPopup
          open={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          product={selectedProduct}
          onSubmit={handleSubmitGuestOrder}
        />
      )}
    </div>
  );
}