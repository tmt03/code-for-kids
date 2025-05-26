'use client';

import { Button } from "@/components/ui/button";
import { useState } from "react";
import OrderPopup from "./order-popup";

interface ProductCardProps {
    id?: number;
    image: string;
    name: string;
    quantity: number;
    price: number;
    description: string;
    currentQuantity?: number;
    onQuantityChange?: (value: number) => void;
    error?: string;
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
        setIsPopupOpen(true);
    };

    const handlePopupSubmit = (data: { fullName: string; phone: string; email: string; address: string; question?: string }) => {
        console.log(data); // Log the data to the console
        alert("Đơn hàng đã được đặt, xin vui lòng chờ liên lạc từ admin hệ thống.");
        setIsPopupOpen(false);
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row">
            {/* Hình ảnh - bên trái */}
            <div className="md:w-1/2 w-full h-64 md:h-auto">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover object-center"
                />
            </div>

            {/* Thông tin - bên phải */}
            <div className="md:w-1/2 w-full p-6 flex flex-col justify-between">
                <div>
                    <h3 className="text-2xl font-bold mb-3">{name}</h3>
                    <p className="text-gray-600 mb-2">
                        <span className="font-medium">Số lượng có sẵn:</span> {quantity}
                    </p>
                    <p className="text-xl font-semibold text-blue-600 mb-4">
                        {price.toLocaleString('vi-VN')} VNĐ
                    </p>
                    <p className="text-gray-700 mb-4 text-base leading-relaxed">
                        {description}
                    </p>

                    {/* Số lượng chọn mua */}
                    {onQuantityChange && (
                        <div className="flex items-center gap-2 mb-4">
                            <Button
                                onClick={() =>
                                    onQuantityChange(currentQuantity > 0 ? currentQuantity - 1 : 0)
                                }
                                className="bg-gray-300 hover:bg-gray-400 text-black py-1 px-3 rounded-full"
                                disabled={currentQuantity === 0}
                            >
                                -
                            </Button>
                            <span className="text-lg">{currentQuantity || 0}</span>
                            <Button
                                onClick={() =>
                                    onQuantityChange(currentQuantity < quantity ? currentQuantity + 1 : quantity)
                                }
                                className="bg-gray-300 hover:bg-gray-400 text-black py-1 px-3 rounded-full"
                                disabled={currentQuantity === quantity}
                            >
                                +
                            </Button>
                        </div>
                    )}
                </div>

                {/* Nút mua */}
                <div>
                    <Button
                        onClick={handleBuyClick}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg text-xl font-medium shadow-md transition-all duration-200"
                    >
                        MUA NGAY
                    </Button>

                    {isPopupOpen && (
                        <OrderPopup
                            product={{ id: id || 0, name, price }}
                            onClose={() => setIsPopupOpen(false)}
                            onSubmit={handlePopupSubmit}
                        />
                    )}

                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </div>
            </div>
        </div>
    );
}
