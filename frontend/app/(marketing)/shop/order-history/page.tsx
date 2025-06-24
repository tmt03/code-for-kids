//Lịch sử order đơn hàng (người dùng có thể huy đơn và theo dõi trạng thái đơn)

'use client';

import { useAuth } from '@/hooks/useAuth';
import axiosInstance from '@/lib/utils/axiosInstance';
import { OrderData } from '@/types/order';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function OrderHistory() {
    const [orders, setOrders] = useState<OrderData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) {
                setError("Vui lòng đăng nhập để xem lịch sử đơn hàng");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const res = await axiosInstance.get("/v1/orders/user-order-history");
                console.log("📦 Đơn hàng:", res.data);
                setOrders(res.data);
            } catch (err: any) {
                console.error("❌ Lỗi khi lấy đơn hàng:", err);
                const errorMessage = err?.response?.data?.error || "Không thể tải lịch sử đơn hàng";
                setError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'approved':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'done':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending':
                return '⏳ Chờ duyệt';
            case 'approved':
                return '✅ Đã duyệt';
            case 'rejected':
                return '❌ Đã từ chối';
            case 'done':
                return '🎉 Hoàn thành';
            default:
                return '❓ Không xác định';
        }
    };

    const formatDate = (dateString: string | Date) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return 'Không xác định';
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Vui lòng đăng nhập</h2>
                    <p className="text-gray-600 mb-6">Bạn cần đăng nhập để xem lịch sử đơn hàng</p>
                    <button
                        onClick={() => router.push('/login')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                        Đăng nhập ngay
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải lịch sử đơn hàng...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Có lỗi xảy ra</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">📦 Lịch sử đơn hàng</h1>
                    <p className="text-gray-600">Theo dõi trạng thái và lịch sử các đơn hàng của bạn</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-lg p-4 shadow-sm border">
                        <div className="text-2xl font-bold text-yellow-600">{orders.filter(o => o.status === 'pending').length}</div>
                        <div className="text-sm text-gray-600">Chờ duyệt</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm border">
                        <div className="text-2xl font-bold text-blue-600">{orders.filter(o => o.status === 'approved').length}</div>
                        <div className="text-sm text-gray-600">Đã duyệt</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm border">
                        <div className="text-2xl font-bold text-green-600">{orders.filter(o => o.status === 'done').length}</div>
                        <div className="text-sm text-gray-600">Hoàn thành</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm border">
                        <div className="text-2xl font-bold text-gray-600">{orders.length}</div>
                        <div className="text-sm text-gray-600">Tổng cộng</div>
                    </div>
                </div>

                {/* Orders List */}
                {orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                        <div className="text-6xl mb-4">📭</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Chưa có đơn hàng nào</h3>
                        <p className="text-gray-600 mb-6">Bạn chưa đặt đơn hàng nào. Hãy ghé thăm cửa hàng để mua sản phẩm!</p>
                        <button
                            onClick={() => router.push('/shop')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                        >
                            Mua sắm ngay
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order.orderCode}
                                className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
                            >
                                {/* Order Header */}
                                <div className="bg-gray-50 px-6 py-4 border-b">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <span className="font-bold text-lg text-gray-800">
                                                #{order.orderCode}
                                            </span>
                                            <span
                                                className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(order.status)}`}
                                            >
                                                {getStatusText(order.status)}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <span className="font-semibold">Ngày tạo:</span> {formatDate(order.createdAt)}
                                        </div>
                                    </div>
                                </div>

                                {/* Order Content */}
                                <div className="p-6">
                                    {/* Products */}
                                    <div className="mb-6">
                                        <h4 className="font-semibold text-gray-800 mb-3">Sản phẩm đã đặt:</h4>
                                        <div className="space-y-3">
                                            {Array.isArray(order.products) && order.products.length > 0 ? (
                                                order.products.map((prod, idx) => (
                                                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                        <div className="flex-1">
                                                            <div className="font-medium text-gray-800">{prod?.pname || "Không rõ sản phẩm"}</div>
                                                            <div className="text-sm text-gray-600">
                                                                Số lượng: {prod?.quantity || 0} × {typeof prod?.pprice === "number" ? prod.pprice.toLocaleString("vi-VN") + "₫" : "N/A"}
                                                            </div>
                                                        </div>
                                                        <div className="font-semibold text-gray-800">
                                                            {typeof prod?.pprice === "number" && typeof prod?.quantity === "number"
                                                                ? (prod.pprice * prod.quantity).toLocaleString("vi-VN") + "₫"
                                                                : "N/A"}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-gray-500 italic">Không có sản phẩm nào</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Order Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Buyer Info */}
                                        <div>
                                            <h4 className="font-semibold text-gray-800 mb-3">Thông tin người mua:</h4>
                                            <div className="space-y-2 text-sm">
                                                <div><span className="font-medium">Tên:</span> {order.buyer?.name || "N/A"}</div>
                                                <div><span className="font-medium">Email:</span> {order.buyer?.email || "N/A"}</div>
                                                <div><span className="font-medium">SĐT:</span> {order.buyer?.phone || "N/A"}</div>
                                                <div><span className="font-medium">Địa chỉ:</span> {order.buyer?.address || "N/A"}</div>
                                                {order.buyer?.note && (
                                                    <div><span className="font-medium">Ghi chú:</span> {order.buyer.note}</div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Order Summary */}
                                        <div>
                                            <h4 className="font-semibold text-gray-800 mb-3">Tóm tắt đơn hàng:</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span>Tổng tiền hàng:</span>
                                                    <span className="font-semibold">
                                                        {typeof order.total === "number" ? order.total.toLocaleString("vi-VN") + "₫" : "N/A"}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Phí vận chuyển:</span>
                                                    <span>Miễn phí</span>
                                                </div>
                                                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                                                    <span>Tổng thanh toán:</span>
                                                    <span className="text-blue-600">
                                                        {typeof order.total === "number" ? order.total.toLocaleString("vi-VN") + "₫" : "N/A"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
