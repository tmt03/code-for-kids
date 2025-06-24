//Thẻ sản phẩm hiển thị ở trang /shop

'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaLock } from "react-icons/fa";

interface ProductCardProps {
    pid: string; // Product ID từ database
    image: string;
    name: string;
    quantity: number; // Số lượng tồn kho
    price: number;
    description: string;
    currentQuantity?: number;
    onQuantityChange?: (value: number) => void;
    error?: string;
    locked?: boolean;
    product?: {
        pid: string;
        pname: string;
        pimg: string;
        pdescription: string;
        pprice: number;
        pquantity: number;
        category: "course" | "event";
        shortDescription: string;
        longDescription: string;
        features: string[];
        images: string[];
        videoUrl?: string;
        demoUrl?: string;
        courseInfo?: {
            duration: string;
            lessons: number;
            level: "beginner" | "intermediate" | "advanced";
            ageGroup: string;
            genre: string;
            certificate: boolean;
        };
        eventInfo?: {
            eventDate: Date;
            eventTime: string;
            location: string;
            organizer: string;
            maxAttendees: number;
            eventType: "workshop" | "seminar" | "hackathon" | "conference";
            agenda?: string[];
        };
        includedProducts?: {
            name: string;
            image: string;
            description: string;
        }[];
        isActive: boolean;
        isFeatured: boolean;
        viewCount: number;
        purchaseCount: number;
    };
    onBuyClick?: (product: {
        pid: string;
        pname: string;
        pimg: string;
        pdescription: string;
        pprice: number;
        pquantity: number;
    }) => void;
}

export default function ProductCard({
    pid,
    image,
    name,
    quantity,
    price,
    description,
    currentQuantity = 0,
    onQuantityChange,
    error,
    locked = false,
    product,
    onBuyClick,
}: ProductCardProps) {
    const handleBuyClick = () => {
        if (onBuyClick) {
            onBuyClick({
                pid: pid,
                pname: name,
                pimg: image || '',
                pdescription: description || '',
                pprice: price,
                pquantity: quantity
            });
        }
    };

    return (
        <div
            className={`
                relative bg-white rounded-3xl shadow-xl overflow-hidden
                flex flex-col md:flex-row border-4 border-transparent
                transition-all duration-300
                hover:border-yellow-400 hover:shadow-2xl
                drop-shadow-[0_0_16px_#ffe066] hover:drop-shadow-[0_0_32px_#a3e635]
                group min-h-[180px]
            `}
        >
            {/* Icon khóa nhỏ góc phải trên nếu locked */}
            {locked && (
                <div className="absolute top-3 right-3 z-10">
                    <FaLock size={28} className="text-yellow-400 drop-shadow animate-bounce" />
                </div>
            )}

            {/* Ảnh sản phẩm */}
            <div className="md:w-64 w-full flex items-center justify-center p-4">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-40 object-contain rounded-2xl transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_16px_#ffe066]"
                />
            </div>

            {/* Thông tin sản phẩm */}
            <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-2xl font-extrabold text-purple-700 drop-shadow-[0_0_8px_#ffe066]">{name}</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full capitalize">
                            {product?.category}
                        </span>
                    </div>
                    <p className="text-gray-700 mb-1 font-semibold">
                        <span className="font-medium">Số lượng có sẵn:</span> {quantity}
                    </p>
                    <p className="text-xl font-bold text-pink-500 mb-3">
                        {price.toLocaleString("vi-VN")} VNĐ
                    </p>
                    <p className="text-gray-800 mb-4">
                        {product?.shortDescription || description}
                    </p>

                    {/* Course specific info */}
                    {product?.category === 'course' && product.courseInfo && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">⏱️ {product.courseInfo.duration}</span>
                                <span className="text-gray-600">📚 {product.courseInfo.lessons} bài</span>
                                <span className="text-gray-600 capitalize">🎯 {product.courseInfo.level}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm mt-2">
                                <span className="text-gray-600">👥 {product.courseInfo.ageGroup}</span>
                                <span className="text-gray-600">🎮 {product.courseInfo.genre}</span>
                            </div>
                        </div>
                    )}

                    {/* Event specific info */}
                    {product?.category === 'event' && product.eventInfo && (
                        <div className="mb-4 p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">📅 {new Date(product.eventInfo.eventDate).toLocaleDateString('vi-VN')}</span>
                                <span className="text-gray-600">🕐 {product.eventInfo.eventTime}</span>
                                <span className="text-gray-600 capitalize">🎪 {product.eventInfo.eventType}</span>
                            </div>
                            <div className="mt-2 text-sm text-gray-600">
                                📍 {product.eventInfo.location}
                            </div>
                        </div>
                    )}

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

                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                    <Button
                        onClick={handleBuyClick}
                        className="flex-1 bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-pink-400 hover:to-yellow-400 text-white py-3 px-6 rounded-xl text-lg font-bold shadow-lg transition-transform duration-150 active:scale-95"
                    >
                        MUA NGAY
                    </Button>
                    <Button
                        className="flex-1 bg-white border-2 border-yellow-400 text-yellow-700 font-bold py-3 px-6 rounded-xl text-lg shadow hover:bg-yellow-50 transition-all flex items-center justify-center"
                    >
                        <Link
                            href={`/shop/product/${pid}`}
                        >
                            XEM CHI TIẾT
                        </Link>
                    </Button>
                </div>

                {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
        </div>
    );
}
