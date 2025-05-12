'use client';

import { useState } from 'react';
import ProductCard from "@/components/shop/product-card";
import ConsultationForm from "@/components/shop/consultation-form";

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

    const handleQuantityChange = (productId: number, value: number) => {
        const product = products.find(p => p.id === productId);
        
        if (product && value > product.quantity) {
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
            [productId]: value
        }));
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
                                <ProductCard
                                    key={product.id}
                                    image={product.image}
                                    name={product.name}
                                    quantity={product.quantity}
                                    price={product.price}
                                    description={product.description}
                                    currentQuantity={quantities[product.id] || 0}
                                    onQuantityChange={(value) => handleQuantityChange(product.id, value)}
                                    error={errors[product.id]}
                                />
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