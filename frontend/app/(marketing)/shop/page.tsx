'use client';

import ConsultationForm from "@/components/shop/consultation-form";
import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

// Sample product data
const products = [
    {
        id: 1,
        image: "/assets/products/product1.jpg",
        name: "SÁCH CODE_FOR_KIDS",
        quantity: 50,
        price: 200000,
        description: "Để phục vụ cho việc học lập trình dễ dàng hơn, Scriptbies phát triển một nền tảng web hỗ trợ học lập trình thông qua việc thiết kế game. Ứng dụng phát triển dựa trên việc cá nhân hóa thông qua việc cho trẻ học theo các hướng dẫn để làm quen với các cơ chế tạo ra trò chơi, từ đó cho phép trẻ tùy chỉnh thông qua việc thay đổi mã nguồn để tạo ra trò chơi với màu sắc riêng của mình."
    },
    {
        id: 2,
        image: "/assets/products/product2.jpg",
        name: "Khóa học Web Development",
        quantity: 30,
        price: 1490000,
        description: "Xây dựng website chuyên nghiệp với HTML, CSS, JavaScript và React."
    },
    {
        id: 3,
        image: "/assets/products/product3.jpg",
        name: "Khóa học Data Science",
        quantity: 25,
        price: 1990000,
        description: "Phân tích dữ liệu và machine learning với Python."
    }
];

export default function ShopPage() {
    const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
    const [errors, setErrors] = useState<{ [key: number]: string }>({});

    const handleQuantityChange = (productId: number, value: string) => {
        const numValue = parseInt(value) || 0;
        const product = products.find(p => p.id === productId);
        
        if (product && numValue > product.quantity) {
            setErrors(prev => ({
                ...prev,
                [productId]: `Chỉ còn ${product.quantity} sản phẩm trong kho`
            }));
            return;
        }

        setErrors(prev => ({
            ...prev,
            [productId]: ''
        }));

        setQuantities(prev => ({
            ...prev,
            [productId]: numValue
        }));
    };

    const handleIncrement = (productId: number) => {
        const currentQuantity = quantities[productId] || 0;
        const product = products.find(p => p.id === productId);
        
        if (product && currentQuantity < product.quantity) {
            handleQuantityChange(productId, (currentQuantity + 1).toString());
        }
    };

    const handleDecrement = (productId: number) => {
        const currentQuantity = quantities[productId] || 0;
        if (currentQuantity > 1) {
            handleQuantityChange(productId, (currentQuantity - 1).toString());
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-center mb-8">Cửa hàng khóa học</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Product display section */}
                    <div>
                        <div className="space-y-6">
                            {products.map((product) => (
                                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-black">
                                    <div className="flex flex-col md:flex-row">
                                        <div className="md:w-1/3">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-48 md:h-full object-cover"
                                            />
                                        </div>
                                        <div className="p-4 md:w-2/3">
                                            <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                                            <div className="flex items-center gap-2 mb-2">
                                                <label htmlFor={`quantity-${product.id}`} className="text-gray-600">
                                                    Số lượng:
                                                </label>
                                                <div className="flex items-center border border-gray-300 rounded-md">
                                                    <button
                                                        onClick={() => handleDecrement(product.id)}
                                                        className="px-2 py-1 hover:bg-gray-100 disabled:opacity-50"
                                                        disabled={!quantities[product.id] || quantities[product.id] <= 1}
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <input
                                                        type="number"
                                                        id={`quantity-${product.id}`}
                                                        min="1"
                                                        max={product.quantity}
                                                        value={quantities[product.id] || ''}
                                                        onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                                                        className="w-16 px-2 py-1 border-x border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                    <button
                                                        onClick={() => handleIncrement(product.id)}
                                                        className="px-2 py-1 hover:bg-gray-100 disabled:opacity-50"
                                                        disabled={quantities[product.id] >= product.quantity}
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <span className="text-gray-500 text-sm">
                                                    (Còn {product.quantity} sản phẩm)
                                                </span>
                                            </div>
                                            {errors[product.id] && (
                                                <p className="text-red-500 text-sm mb-2">{errors[product.id]}</p>
                                            )}
                                            <p className="text-lg font-semibold text-blue-600 mb-2">
                                                {product.price.toLocaleString('vi-VN')} VNĐ
                                                {quantities[product.id] > 0 && (
                                                    <span className="text-sm text-gray-500 ml-2">
                                                        (Tổng: {(product.price * quantities[product.id]).toLocaleString('vi-VN')} VNĐ)
                                                    </span>
                                                )}
                                            </p>
                                            <p className="text-gray-700 mb-4">{product.description}</p>
                                            <button 
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
                                                disabled={!quantities[product.id] || quantities[product.id] < 1 || !!errors[product.id]}
                                            >
                                                MUA
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Consultation form section */}
                    <div>
                        <ConsultationForm />
                    </div>
                </div>
            </div>
        </div>
    );
}