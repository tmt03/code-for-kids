"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function OrderPage() {
    const searchParams = useSearchParams();
    const productId = searchParams.get('productId');
    const router = useRouter();

    // Dữ liệu sản phẩm
    const product = {
        id: 1,
        name: "SÁCH CODE_FOR_KIDS",
        price: 200000,
        image: "/assets/products/product1.jpg",
        quantity: 1,
    };

    // Phương thức vận chuyển
    const shippingMethods = [
        { id: 1, name: "Giao hàng tiết kiệm", price: 20000 },
        { id: 2, name: "Giao hàng nhanh", price: 40000 },
        { id: 3, name: "Giao hàng hỏa tốc", price: 60000 },
    ];

    // Phương thức thanh toán
    const paymentMethods = [
        { id: 1, name: "Thanh toán khi nhận hàng", description: "Thanh toán khi nhận hàng" },
        { id: 2, name: "Thanh toán qua ngân hàng", description: "Thanh toán qua ngân hàng" },
    ];

    // State quản lý form
    const [selectedShipping, setSelectedShipping] = useState(shippingMethods[0]);
    const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0]);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        street: "",
        district: "",
        city: "",
    });

    // Xử lý thay đổi input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Xử lý submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    product,
                    shipping: selectedShipping,
                    payment: selectedPayment,
                    customer: formData
                }),
            });

            if (response.ok) {
                router.push('/shop/order/success');
            } else {
                throw new Error('Đặt hàng thất bại');
            }
        } catch (error) {
            console.error(error);
            alert('Có lỗi xảy ra khi đặt hàng, vui lòng thử lại');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <h1 className="text-2xl font-bold mb-6 text-center">ĐẶT HÀNG</h1>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Form thông tin giao hàng */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                    <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-200">Thông tin giao hàng</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên*</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại*</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ (Số nhà, tên đường)*</label>
                                <input
                                    type="text"
                                    name="street"
                                    value={formData.street}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện*</label>
                                    <input
                                        type="text"
                                        name="district"
                                        value={formData.district}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Thành phố*</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phương thức vận chuyển*</label>
                                <div className="space-y-2 mt-2">
                                    {shippingMethods.map(method => (
                                        <div 
                                            key={method.id} 
                                            className={`p-3 border rounded-md cursor-pointer ${selectedShipping.id === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                                            onClick={() => setSelectedShipping(method)}
                                        >
                                            <div className="flex items-center">
                                                <input
                                                    type="radio"
                                                    id={`shipping-${method.id}`}
                                                    name="shipping"
                                                    checked={selectedShipping.id === method.id}
                                                    onChange={() => {}}
                                                    className="mr-3"
                                                />
                                                <div>
                                                    <label htmlFor={`shipping-${method.id}`} className="font-medium">
                                                        {method.name}
                                                    </label>
                                                    <p className="text-sm text-gray-600">{method.price.toLocaleString('vi-VN')} VNĐ</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Thông tin đơn hàng */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                    <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-200">Đơn hàng của bạn</h2>

                    {/* Hiển thị sản phẩm */}
                    <div className="flex items-start mb-6 pb-6 border-b border-gray-200">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-20 h-20 object-cover rounded-md mr-4"
                        />
                        <div>
                            <h3 className="font-medium text-gray-800">{product.name}</h3>
                            <p className="text-gray-600 mt-1">{product.price.toLocaleString('vi-VN')} VNĐ</p>
                            <p className="text-sm text-gray-500 mt-1">Số lượng: {product.quantity}</p>
                        </div>
                    </div>

                    {/* Tóm tắt đơn hàng */}
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Tổng tiền hàng:</span>
                            <span className="font-medium">{(product.price * product.quantity).toLocaleString('vi-VN')} VNĐ</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Phí vận chuyển:</span>
                            <span className="font-medium">{selectedShipping.price.toLocaleString('vi-VN')} VNĐ</span>
                        </div>
                        <div className="pt-4 border-t border-gray-200">
                            <div className="flex justify-between text-lg font-bold">
                                <span>Tổng cộng:</span>
                                <span className="text-blue-600">{(product.price * product.quantity + selectedShipping.price).toLocaleString('vi-VN')} VNĐ</span>
                            </div>
                        </div>
                    </div>

                    {/* Phương thức thanh toán */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <h3 className="font-medium mb-3">Phương thức thanh toán</h3>
                        <div className="space-y-2">
                            {paymentMethods.map(method => (
                                <div 
                                    key={method.id} 
                                    className={`p-3 border rounded-md cursor-pointer ${selectedPayment.id === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                                    onClick={() => setSelectedPayment(method)}
                                >
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id={`payment-${method.id}`}
                                            name="payment"
                                            checked={selectedPayment.id === method.id}
                                            onChange={() => {}}
                                            className="mr-3"
                                        />
                                        <div>
                                            <label htmlFor={`payment-${method.id}`} className="font-medium">
                                                {method.name}
                                            </label>
                                            <p className="text-sm text-gray-600">{method.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Nút đặt hàng */}
                    <Button
                        type="submit"
                        className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium text-lg"
                        onClick={handleSubmit}
                    >
                        ĐẶT HÀNG NGAY
                    </Button>
                </div>
            </div>
        </div>
    );
}