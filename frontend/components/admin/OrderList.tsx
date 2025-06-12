// components/admin/OrderList.tsx

'use client';
'use client';

import React, { useEffect, useState } from 'react';
import axiosInstance from '@/lib/utils/axiosInstance';
import { OrderData } from '@/types/order';
import { toast } from 'sonner';

export default function OrderList() {
    const [orders, setOrders] = useState<OrderData[]>([]);
    const [filter, setFilter] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
    const [activeTab, setActiveTab] = useState<'pending' | 'processed'>('pending'); // ✅ Thêm dòng này

    useEffect(() => {
        fetchOrders();
    }, [activeTab]);


    const fetchOrders = async () => {
        try {
            const endpoint = '/api/orders';
            const res = await axiosInstance.get(endpoint);
            const allOrders = res.data;

            const filtered = allOrders.filter((o: OrderData) =>
                activeTab === 'pending' ? o.status === 'pending' : o.status !== 'pending'
            );

            setOrders(filtered);
        } catch (err) {
            toast.error('❌ Lỗi khi tải đơn hàng');
            console.error(err);
        }
    };


    const handleStatusChange = async (orderCode: string, newStatus: OrderData['status']) => {
        try {
            if (activeTab === 'pending') {
                if (newStatus === 'approved') {
                    await axiosInstance.post(`/api/orders/approve/${orderCode}`);
                } else if (newStatus === 'rejected') {
                    await axiosInstance.delete(`/api/orders/reject/${orderCode}`);
                }
            } else {
                // Trong tab "processed", chỉ được chuyển từ approved → done
                if (newStatus === 'done') {
                    await axiosInstance.put(`/api/orders/${orderCode}/status`, { status: 'done' });
                }
            }

            toast.success('✅ Cập nhật trạng thái thành công');
            fetchOrders();
        } catch (err) {
            toast.error('❌ Lỗi cập nhật trạng thái');
            console.error(err);
        }
    };

    const handleExportPDF = async (orderCode: string) => {
        try {
            const res = await axiosInstance.get(`/api/orders/${orderCode}/export`, {
                responseType: 'blob',
            });
            const blob = new Blob([res.data], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `${orderCode}.pdf`;
            link.click();
        } catch (err) {
            toast.error('❌ Lỗi khi xuất PDF');
            console.error(err);
        }
    };

    const filteredOrders = orders
        .filter((o) =>
            o.orderCode.toLowerCase().includes(filter.toLowerCase())
        )
        .filter((o) => {
            if (activeTab === 'pending') return o.status === 'pending';
            return o.status !== 'pending';
        });


    return (
        <div>
            <div className="flex space-x-4 mb-4 mt-4">
                <button
                    onClick={() => setActiveTab('pending')}
                    className={`px-4 py-2 rounded-l ${activeTab === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                    Đơn chờ duyệt
                </button>
                <button
                    onClick={() => setActiveTab('processed')}
                    className={`px-4 py-2 rounded-r ${activeTab === 'processed' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                    Đơn đã duyệt
                </button>
            </div>



            <div className="p-6 max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">📦 Quản lý đơn hàng</h1>
                <input
                    type="text"
                    placeholder="Tìm kiếm theo mã đơn"
                    className="mb-4 border px-3 py-2 rounded w-full"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border rounded shadow">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="p-3">Mã đơn</th>
                                <th className="p-3">Khách hàng</th>
                                <th className="p-3">SĐT</th>
                                <th className="p-3">Địa chỉ</th>
                                <th className="p-3">Trạng thái</th>
                                <th className="p-3">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => (
                                <tr key={order.orderCode} className="border-t hover:bg-gray-50">
                                    <td
                                        className="p-3 text-blue-600 cursor-pointer underline"
                                        onClick={() => setSelectedOrder(order)}
                                    >
                                        {order.orderCode}
                                    </td>
                                    <td className="p-3">{order.buyer.name}</td>
                                    <td className="p-3">{order.buyer.phone}</td>
                                    <td className="p-3">{order.buyer.address}</td>
                                    <td className="p-3">
                                        <select
                                            value={order.status}
                                            onChange={(e) =>
                                                handleStatusChange(order.orderCode, e.target.value as OrderData['status'])
                                            }
                                            className="border rounded px-2 py-1"
                                        >
                                            {activeTab === 'pending' ? (
                                                <>
                                                    <option value="pending">Pending</option>
                                                    <option value="approved">Approve</option>
                                                    <option value="rejected">Reject</option>
                                                </>
                                            ) : (
                                                <>
                                                    <option value="approved">Approved</option>
                                                    <option value="rejected">Rejected</option>
                                                    <option value="done">Done</option>
                                                </>
                                            )}
                                        </select>
                                    </td>

                                    <td className="p-3">
                                        {order.status === 'done' && (
                                            <button
                                                onClick={() => handleExportPDF(order.orderCode)}
                                                className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                                            >
                                                Export PDF
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Popup hiển thị chi tiết đơn */}
            {selectedOrder && (() => {
                const createdDate = new Date(selectedOrder.createdAt);
                const formattedDate = typeof window !== 'undefined' ? createdDate.toLocaleString() : '';
                return (
                    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
                        <div className="bg-white rounded-lg p-6 max-w-xl w-full shadow-lg relative">
                            <h2 className="text-xl font-bold mb-4">Chi tiết đơn hàng</h2>
                            <p><strong>Mã đơn:</strong> {selectedOrder.orderCode}</p>
                            <p><strong>Ngày tạo:</strong> {formattedDate}</p>
                            <p><strong>Khách hàng:</strong> {selectedOrder.buyer.name}</p>
                            <p><strong>SĐT:</strong> {selectedOrder.buyer.phone}</p>
                            <p><strong>Email:</strong> {selectedOrder.buyer.email}</p>
                            <p><strong>Địa chỉ:</strong> {selectedOrder.buyer.address}</p>
                            <p><strong>Người tạo:</strong> {selectedOrder.createdBy}</p>
                            <p><strong>Trạng thái:</strong> {selectedOrder.status}</p>
                            <hr className="my-3" />
                            <h3 className="font-semibold mb-2">Sản phẩm</h3>
                            {selectedOrder.products.map((p: OrderData['products'][number], idx: number) => (
                                <div key={idx} className="mb-1">
                                    - {p.pname} x {p.quantity} ({p.pprice.toLocaleString('vi-VN')}₫)
                                </div>
                            ))}
                            <p className="mt-3 font-bold">Tổng cộng: {selectedOrder.total.toLocaleString('vi-VN')}₫</p>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="absolute top-2 right-2 text-gray-500 hover:text-black"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}