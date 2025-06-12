'use client';

import { useState } from "react";
import axiosInstance from "@/lib/utils/axiosInstance";


export interface OrderData {
    orderCode: string;
    role: "guest" | "user";
    products: {
        pid: string;
        pname: string;
        pprice: number;
        quantity: number;
    }[];
    total: number;
    buyer: {
        name: string;
        phone: string;
        email: string;
        address: string;
        note?: string;
    };
    createdAt: string;
    status: "pending" | "approved" | "rejected" | "done";
    createdBy: string;
}


export default function GuestOrderLookup() {
    const [keyword, setKeyword] = useState('');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!keyword.trim()) return;

        setLoading(true);
        try {
            const res = await axiosInstance.get("/api/orders/guest-lookup", {
                params: { name: keyword, phone: keyword },
            });
            setOrders(res.data);
        } catch (err) {
            console.error("❌ Lỗi khi tìm kiếm:", err);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };
    if (loading) {
        return <div className="text-center p-6">Đang tải...</div>;
    }
    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-4 mt-8">🔍 Tra cứu đơn hàng</h1>

            <div className="flex gap-2 mb-6">
                <input
                    type="text"
                    placeholder="Nhập tên hoặc số điện thoại"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="flex-grow border px-4 py-2 rounded"
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                    Tìm kiếm
                </button>
            </div>

            {orders.length > 0 ? (
                <div className="space-y-4">
                    {orders.map((order: OrderData) => (
                        <div key={order.orderCode} className="border p-4 rounded bg-gray-50">
                            <div className="font-semibold">Mã đơn: {order.orderCode}</div>
                            <div>Khách: {order.buyer.name} - {order.buyer.phone}</div>
                            <div>Trạng thái: {order.status}</div>
                            <div>Tổng tiền: {order.total.toLocaleString("vi-VN")}₫</div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">Không có đơn hàng nào.</p>
            )}
        </div>
    );
}
