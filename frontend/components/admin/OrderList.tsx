// components/admin/OrderList.tsx

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

    );
}