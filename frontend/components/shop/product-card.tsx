'use client';

import { Button } from "@/components/ui/button";
import { useState } from "react";
import OrderPopup from "./GuestOrderPopup";

interface ProductCardProps {
    id?: number;
    image: string;
    name: string;
    quantity: number; // Số lượng tồn kho
    price: number;
    description: string;
    currentQuantity?: number;
    onQuantityChange?: (value: number) => void;
    error?: string;
}

interface OrderFormData {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    question?: string;
    quantity: number;
}

export default function ProductCard({
    id,
    image,
    name,
    quantity,
    price,
    description,
    currentQuantity = 0,
    onQuantityChange,
    error,
}: ProductCardProps) {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleBuyClick = () => {
        alert(">>> Bấm MUA NGAY rồi nè");
        setIsPopupOpen(true);
    };

    const handlePopupSubmit = (data: OrderFormData) => {
        console.log("Dữ liệu đơn hàng:", data);
        alert("Đơn hàng đã được gửi thành công!");
        setIsPopupOpen(false);
    };


    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-shadow duration-300 flex flex-col md:flex-row">
            {/* Ảnh sản phẩm */}
            <div className="md:w-6/12">
                <img src={image} alt={name} className="w-full h-full object-cover" />
            </div>

            {/* Thông tin sản phẩm */}
            <div className="md:w-6/12 p-6 flex flex-col justify-between">
                <div>
                    <h3 className="text-2xl font-bold mb-2">{name}</h3>
                    <p className="text-gray-600 mb-1">
                        <span className="font-medium">Số lượng có sẵn:</span> {quantity}
                    </p>
                    <p className="text-xl font-semibold text-blue-600 mb-3">
                        {price.toLocaleString("vi-VN")} VNĐ
                    </p>
                    <p className="text-gray-700 mb-4">{description}</p>

                    {onQuantityChange && (
                        <div className="flex items-center gap-2 mb-4">
                            <Button
                                onClick={() =>
                                    onQuantityChange(currentQuantity ? currentQuantity - 1 : 0)
                                }
                                className="bg-gray-300 hover:bg-gray-400 text-black py-1 px-3 rounded-full"
                                disabled={currentQuantity === 0}
                            >
                                -
                            </Button>
                            <span className="text-lg">{currentQuantity || 0}</span>
                            <Button
                                onClick={() =>
                                    onQuantityChange(currentQuantity ? currentQuantity + 1 : 1)
                                }
                                className="bg-gray-300 hover:bg-gray-400 text-black py-1 px-3 rounded-full"
                                disabled={currentQuantity === quantity}
                            >
                                +
                            </Button>
                        </div>
                    )}
                </div>

                {/* Nút MUA NGAY */}
                <Button
                    onClick={handleBuyClick}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg text-lg font-medium shadow"
                >
                    MUA NGAY
                </Button>

                {/* Hiện lỗi nếu có */}
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>

            {/* Pop-up đặt hàng */}
            {isPopupOpen && (
                <OrderPopup
                    product={{ id: id || 0, name, price }}
                    onClose={() => setIsPopupOpen(false)}
                    onSubmit={handlePopupSubmit}
                />
            )}
        </div>
    );
}
