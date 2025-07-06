// 📄 File: app/shop/orders/manage/page.tsx

'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axiosInstance from '@/lib/utils/axiosInstance';
import { OrderData } from '@/types/order';
import { faEye, faFilePdf, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function AdminOrderManagePage() {
    const [orders, setOrders] = useState<OrderData[]>([]);
    const [filter, setFilter] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
    const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'done'>('pending');
    const [isLoading, setIsLoading] = useState(true);
    const [statusCounts, setStatusCounts] = useState({ pending: 0, approved: 0, rejected: 0, done: 0 });

    useEffect(() => {
        fetchOrders()
    }, [activeTab, filter]);

    useEffect(() => {
        // Luôn fetch stats khi component được tải
        const fetchStatusCounts = async () => {
            try {
                const res = await axiosInstance.get('v1/admin/orders/stats');
                setStatusCounts(res.data);
            } catch (err) {
                console.error("Failed to fetch order stats:", err);
            }
        };
        fetchStatusCounts();
    }, []);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const res = await axiosInstance.get('v1/admin/order-list', {
                params: {
                    status: activeTab,
                    search: filter || undefined,
                },
            });
            setOrders(res.data.orders);
        } catch (err) {
            toast.error('Không thể tải danh sách đơn hàng');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (orderCode: string, newStatus: OrderData['status']) => {
        try {
            // Gọi API để cập nhật
            await axiosInstance.patch(`v1/admin/orders/${orderCode}/status`, {
                status: newStatus,
            });

            // Cập nhật lại state của `orders` để UI thay đổi ngay lập tức
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.orderCode === orderCode ? { ...order, status: newStatus } : order
                )
            );

            toast.success(`Đã cập nhật trạng thái đơn hàng #${orderCode}`);

            // Optional: Sau khi cập nhật, có thể bạn muốn lọc lại danh sách
            // Ví dụ: nếu đang ở tab 'pending' mà chuyển thành 'approved', đơn hàng đó sẽ biến mất khỏi tab hiện tại.
            // Ta có thể gọi lại fetchOrders() hoặc lọc thủ công:
            setTimeout(() => {
                setOrders(prev => prev.filter(o => o.orderCode !== orderCode));
            }, 1000);


        } catch (err) {
            toast.error('Cập nhật thất bại. Vui lòng thử lại.');
        }
    };

    const handleExportPDF = async () => {
    };

    // Filtered orders by tab
    const filteredOrders = orders;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'text-yellow-600 bg-yellow-100';
            case 'approved': return 'text-green-600 bg-green-100';
            case 'rejected': return 'text-red-600 bg-red-100';
            case 'done': return 'text-blue-600 bg-blue-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending': return 'Chờ duyệt';
            case 'approved': return 'Đã duyệt';
            case 'rejected': return 'Từ chối';
            case 'done': return 'Hoàn thành';
            default: return status;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#E8F1F2] to-[#D3E0E1] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A3D62] mx-auto"></div>
                    <p className="mt-4 text-[#0A3D62] font-semibold">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#E8F1F2] to-[#D3E0E1] p-2 sm:p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-[#0A3D62] border border-white rounded-lg p-4 sm:p-6 text-white mb-4 sm:mb-6">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">📦 Quản lý đơn hàng</h1>
                    <p className="text-sm sm:text-base text-gray-300">Duyệt, xử lý và quản lý đơn hàng của khách hàng</p>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg">
                    <div className="flex flex-wrap gap-2 bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('pending')}
                            className={`flex-1 min-w-[120px] px-4 py-2 rounded-md font-medium transition-all duration-200 text-center ${activeTab === 'pending'
                                ? 'bg-white text-[#0A3D62] shadow-sm font-bold border border-[#0A3D62]'
                                : 'text-gray-600 hover:text-[#0A3D62] hover:bg-white/80 border border-transparent'
                                }`}
                        >
                            Chờ duyệt
                            <span className="ml-2 inline-block bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-0.5 rounded-full">{statusCounts.pending}</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('approved')}
                            className={`flex-1 min-w-[120px] px-4 py-2 rounded-md font-medium transition-all duration-200 text-center ${activeTab === 'approved'
                                ? 'bg-white text-blue-700 shadow-sm font-bold border border-blue-600'
                                : 'text-gray-600 hover:text-blue-700 hover:bg-white/80 border border-transparent'
                                }`}
                        >
                            Đã xác nhận
                            <span className="ml-2 inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">{statusCounts.approved}</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('rejected')}
                            className={`flex-1 min-w-[120px] px-4 py-2 rounded-md font-medium transition-all duration-200 text-center ${activeTab === 'rejected'
                                ? 'bg-white text-red-700 shadow-sm font-bold border border-red-600'
                                : 'text-gray-600 hover:text-red-700 hover:bg-white/80 border border-transparent'
                                }`}
                        >
                            Đã từ chối
                            <span className="ml-2 inline-block bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full">{statusCounts.rejected}</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('done')}
                            className={`flex-1 min-w-[120px] px-4 py-2 rounded-md font-medium transition-all duration-200 text-center ${activeTab === 'done'
                                ? 'bg-white text-green-700 shadow-sm font-bold border border-green-600'
                                : 'text-gray-600 hover:text-green-700 hover:bg-white/80 border border-transparent'
                                }`}
                        >
                            Hoàn thành
                            <span className="ml-2 inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">{statusCounts.done}</span>
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="bg-white rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg">
                    <div className="relative w-full max-w-sm lg:max-w-md">
                        <FontAwesomeIcon
                            icon={faSearch}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <Input
                            type="text"
                            placeholder="Tìm kiếm theo mã đơn hàng..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="pl-10 border-[#0A3D62] focus:border-[#00A8B5] w-full"
                        />
                    </div>
                </div>

                {/* Orders Table - Desktop View */}
                <div className="hidden lg:block bg-white rounded-lg shadow-lg">
                    <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                        <table className="w-full min-w-[900px]">
                            <thead className="bg-[#0A3D62] text-white sticky top-0 z-10">
                                <tr>
                                    <th className="px-4 sm:px-6 py-3 text-left">Mã đơn</th>
                                    <th className="px-4 sm:px-6 py-3 text-left">Khách hàng</th>
                                    <th className="px-4 sm:px-6 py-3 text-left">SĐT</th>
                                    <th className="px-4 sm:px-6 py-3 text-left">Địa chỉ</th>
                                    <th className="px-4 sm:px-6 py-3 text-left">Trạng thái</th>
                                    <th className="px-4 sm:px-6 py-3 text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredOrders.map((order) => (
                                    <tr key={order.orderCode} className="hover:bg-gray-50">
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                            <span className="text-blue-600 cursor-pointer hover:underline font-medium">
                                                {order.orderCode}
                                            </span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 text-gray-900 whitespace-nowrap text-sm sm:text-base">
                                            {order.buyer.name}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 text-gray-900 whitespace-nowrap text-sm">
                                            {order.buyer.phone}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 text-gray-500 whitespace-nowrap text-sm max-w-xs truncate">
                                            {order.buyer.address}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={order.status}
                                                onChange={(e) =>
                                                    handleStatusChange(order.orderCode, e.target.value as OrderData['status'])
                                                }
                                                className={`border rounded px-3 py-1 text-sm font-medium ${getStatusColor(order.status)}`}
                                            >
                                                {activeTab === 'pending' ? (
                                                    <>
                                                        <option value="pending">Chờ duyệt</option>
                                                        <option value="approved">Duyệt</option>
                                                        <option value="rejected">Từ chối</option>
                                                    </>
                                                ) : (
                                                    <>
                                                        <option value="approved">Đã duyệt</option>
                                                        <option value="rejected">Từ chối</option>
                                                        <option value="done">Hoàn thành</option>
                                                    </>
                                                )}
                                            </select>
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center justify-center space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="pixel"
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="text-blue-600 hover:bg-blue-50"
                                                >
                                                    <FontAwesomeIcon icon={faEye} />
                                                </Button>
                                                {order.status === 'done' && (
                                                    <Button
                                                        size="sm"
                                                        variant="pixelGreen"
                                                        onClick={() => handleExportPDF()}
                                                    >
                                                        <FontAwesomeIcon icon={faFilePdf} />
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Orders Cards - Mobile/Tablet View */}
                <div className="lg:hidden space-y-3">
                    {filteredOrders.map((order) => (
                        <div key={order.orderCode} className="bg-white rounded-lg shadow-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <div className="font-semibold text-gray-900 text-blue-600 cursor-pointer hover:underline">
                                        {order.orderCode}
                                    </div>
                                    <div className="text-sm text-gray-500">{order.buyer.name}</div>
                                </div>
                                <div className="flex space-x-1">
                                    <Button
                                        size="sm"
                                        variant="pixel"
                                        onClick={() => setSelectedOrder(order)}
                                        className="text-blue-600 hover:bg-blue-50"
                                    >
                                        <FontAwesomeIcon icon={faEye} />
                                    </Button>
                                    {order.status === 'done' && (
                                        <Button
                                            size="sm"
                                            variant="pixelGreen"
                                            onClick={() => handleExportPDF()}
                                        >
                                            <FontAwesomeIcon icon={faFilePdf} />
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                                <div>
                                    <span className="text-gray-500">SĐT:</span>
                                    <div className="font-medium">{order.buyer.phone}</div>
                                </div>
                                <div>
                                    <span className="text-gray-500">Trạng thái:</span>
                                    <div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                            {getStatusText(order.status)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-sm">
                                <span className="text-gray-500">Địa chỉ:</span>
                                <div className="font-medium">{order.buyer.address}</div>
                            </div>
                            <div className="mt-3">
                                <select
                                    value={order.status}
                                    onChange={(e) =>
                                        handleStatusChange(order.orderCode, e.target.value as OrderData['status'])
                                    }
                                    className={`w-full border rounded px-3 py-2 text-sm font-medium ${getStatusColor(order.status)}`}
                                >
                                    {activeTab === 'pending' ? (
                                        <>
                                            <option value="pending">Chờ duyệt</option>
                                            <option value="approved">Duyệt</option>
                                            <option value="rejected">Từ chối</option>
                                        </>
                                    ) : (
                                        <>
                                            <option value="approved">Đã duyệt</option>
                                            <option value="rejected">Từ chối</option>
                                            <option value="done">Hoàn thành</option>
                                        </>
                                    )}
                                </select>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredOrders.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Không tìm thấy đơn hàng nào</p>
                    </div>
                )}
            </div>

            {/* Popup hiển thị chi tiết đơn */}
            {selectedOrder && (() => {
                const createdDate = new Date(selectedOrder.createdAt);
                const formattedDate = typeof window !== 'undefined' ? createdDate.toLocaleString('vi-VN') : '';
                return (
                    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg p-6 max-w-2xl w-full shadow-lg relative max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-[#0A3D62]">Chi tiết đơn hàng</h2>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="text-gray-500 hover:text-black text-xl"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-sm text-gray-500">Mã đơn:</p>
                                    <p className="font-semibold text-blue-600">{selectedOrder.orderCode}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Ngày tạo:</p>
                                    <p className="font-semibold">{formattedDate}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Khách hàng:</p>
                                    <p className="font-semibold">{selectedOrder.buyer.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">SĐT:</p>
                                    <p className="font-semibold">{selectedOrder.buyer.phone}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email:</p>
                                    <p className="font-semibold">{selectedOrder.buyer.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Trạng thái:</p>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedOrder.status)}`}>
                                        {getStatusText(selectedOrder.status)}
                                    </span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="text-sm text-gray-500">Địa chỉ:</p>
                                <p className="font-semibold">{selectedOrder.buyer.address}</p>
                            </div>

                            <div className="mb-4">
                                <p className="text-sm text-gray-500">Người tạo:</p>
                                <p className="font-semibold">{selectedOrder.createdBy}</p>
                            </div>

                            <hr className="my-4" />

                            <div>
                                <h3 className="font-semibold mb-3 text-[#0A3D62]">Sản phẩm</h3>
                                <div className="space-y-2">
                                    {selectedOrder.products.map((p: OrderData['products'][number], idx: number) => (
                                        <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                            <span className="font-medium">{p.pname} x {p.quantity}</span>
                                            <span className="text-blue-600 font-semibold">{p.pprice.toLocaleString('vi-VN')}₫</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 p-3 bg-[#0A3D62] text-white rounded-lg">
                                    <p className="text-lg font-bold text-center">
                                        Tổng cộng: {selectedOrder.total.toLocaleString('vi-VN')}₫
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}
