// components/shop/UserOrderHistory.tsx
'use client';

import React, { useState, useEffect } from 'react';
import axiosInstance from '@/lib/utils/axiosInstance';
import { OrderData } from '@/types/order';

function getUsernameFromToken(): string | null {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.username || null;
    } catch {
        return null;
    }
}


export default function UserOrderHistory() {
    const [orders, setOrders] = useState<OrderData[]>([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const username = getUsernameFromToken();
            if (!username) {
                console.warn("Chưa đăng nhập, không gọi API lịch sử đơn hàng");
                return;
            }

            try {
                const res = await axiosInstance.get("/api/orders/user-orders/full");
                console.log("📦 Đơn hàng:", res.data);
                setOrders(res.data);
            } catch (err) {
                console.error("❌ Lỗi khi lấy đơn hàng:", err);
            }
        };
        fetchOrders();
    }, []);


    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-700';
            case 'approved':
                return 'bg-blue-100 text-blue-700';
            case 'rejected':
                return 'bg-red-100 text-red-700';
            case 'done':
                return 'bg-green-100 text-green-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {orders.length === 0 ? (
                <p>Không có đơn hàng nào.</p>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div
                            key={order.orderCode}
                            className="bg-white shadow rounded-lg p-4 border"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold">Mã đơn: {order.orderCode}</span>
                                <span
                                    className={`px-2 py-1 text-sm rounded ${getStatusColor(order.status)}`}
                                >
                                    {order.status?.toUpperCase()}
                                </span>
                            </div>

                            <p className="text-sm text-gray-600">
                                Ngày tạo:{" "}
                                {order.createdAt
                                    ? new Date(order.createdAt).toLocaleString("vi-VN")
                                    : "Không xác định"}
                            </p>

                            <p className="text-sm">
                                Tổng tiền:{" "}
                                <strong>
                                    {typeof order.total === "number"
                                        ? order.total.toLocaleString("vi-VN") + "₫"
                                        : "Không xác định"}
                                </strong>
                            </p>

                            <ul className="text-sm mt-2 list-disc list-inside text-gray-700">
                                {Array.isArray(order.products) && order.products.length > 0 ? (
                                    order.products.map((prod, idx) => (
                                        <li key={idx}>
                                            {prod?.pname ?? "Không rõ sản phẩm"} × {prod?.quantity ?? 0} –{" "}
                                            {typeof prod?.pprice === "number"
                                                ? (prod.pprice * (prod.quantity ?? 0)).toLocaleString("vi-VN") + "₫"
                                                : "N/A"}
                                        </li>
                                    ))
                                ) : (
                                    <li>Không có sản phẩm nào</li>
                                )}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
