'use client';

import OrderPopup from "@/components/shop/order-popup";
import { useAuth } from "@/hooks/useAuth";
import axiosInstance from "@/lib/utils/axiosInstance";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Product } from "../../../../../types/product";

export default function ProductDetailPage() {
    const params = useParams<{ productId: string }>();
    const productId = params.productId;
    const { user } = useAuth();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (productId) {
            axiosInstance
                .get(`/v1/products/${productId}`)
                .then((res) => {
                    setProduct(res.data.data);
                })
                .catch((err) => {
                    toast.error("Không thể tải thông tin sản phẩm");
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [productId]);

    const handleSubmitOrder = async (data: any) => {
        const payload = {
            ...data,
            role: user?.role,
            createdBy: user?.username,
            status: "pending",
        };

        const response = await axiosInstance.post("/v1/orders/create", payload);
        return response.data;
    };

    const handleBuyClick = () => {
        if (!user) {
            toast.error("Hãy đăng nhập để có thể nhận hỗ trợ và mua sản phẩm của Scriptbies", {
                action: {
                    label: "Đăng nhập",
                    onClick: () => router.push("/login"),
                },
            });
            return;
        }
        setIsPopupOpen(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E0F4F7] to-[#C1E7EB]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A8B5] mx-auto"></div>
                    <p className="mt-4 text-[#0A3D62]">Đang tải thông tin sản phẩm...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E0F4F7] to-[#C1E7EB]">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-[#0A3D62] mb-4">Không tìm thấy sản phẩm</h1>
                    <button
                        onClick={() => router.push("/shop")}
                        className="px-6 py-2 bg-[#00A8B5] text-white rounded-lg hover:bg-[#007C8D] transition-colors"
                    >
                        Quay lại cửa hàng
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#E0F4F7] to-[#C1E7EB] p-4 sm:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Breadcrumb */}
                <nav className="mb-8">
                    <ol className="flex items-center space-x-2 text-sm text-[#0A3D62]">
                        <li>
                            <button
                                onClick={() => router.push("/shop")}
                                className="hover:underline"
                            >
                                Cửa hàng
                            </button>
                        </li>
                        <li>/</li>
                        <li className="font-medium">{product.pname}</li>
                    </ol>
                </nav>

                {/* Product Detail */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-[#C1E7EB]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                        {/* Product Image */}
                        <div className="space-y-4">
                            <div className="aspect-auto bg-[#E0F4F7] rounded-xl overflow-hidden">
                                <img
                                    src={product.pimg}
                                    alt={product.pname}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-3xl font-bold text-[#007C8D] mb-2">
                                    {product.pname}
                                </h1>
                                <p className="text-[#0A3D62] text-lg">
                                    Mã sản phẩm: {product.pid}
                                </p>
                            </div>

                            <div className="text-3xl font-bold text-[#00A8B5]">
                                {product.pprice.toLocaleString('vi-VN')} VNĐ
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <span className="text-[#0A3D62]">Tình trạng:</span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${product.pquantity > 0
                                        ? 'bg-[#C1E7EB] text-[#00A8B5]'
                                        : 'bg-red-100 text-red-800'
                                        }`}>
                                        {product.pquantity > 0 ? 'Còn hàng' : 'Hết hàng'}
                                    </span>
                                </div>

                                {product.pquantity > 0 && (
                                    <div className="flex items-center space-x-2">
                                        <span className="text-[#0A3D62]">Số lượng còn lại:</span>
                                        <span className="font-medium text-[#0A3D62]">
                                            {product.pquantity}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-[#0A3D62]">
                                    Mô tả sản phẩm
                                </h3>
                                <p className="text-[#0A3D62] leading-relaxed">
                                    {product.longDescription || product.pdescription}
                                </p>
                            </div>

                            {/* Features */}
                            {product.features && product.features.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-[#0A3D62]">
                                        Tính năng nổi bật
                                    </h3>
                                    <ul className="space-y-2">
                                        {product.features.map((feature, index) => (
                                            <li key={index} className="flex items-center space-x-2">
                                                <span className="text-[#00A8B5]">✓</span>
                                                <span className="text-[#0A3D62]">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Course Information */}
                            {product.category === 'course' && product.courseInfo && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-[#0A3D62]">
                                        Thông tin khóa học
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-[#E0F4F7] p-4 rounded-lg">
                                            <p className="text-sm text-[#0A3D62]">Thời lượng</p>
                                            <p className="font-semibold text-[#0A3D62]">{product.courseInfo.duration}</p>
                                        </div>
                                        <div className="bg-[#E0F4F7] p-4 rounded-lg">
                                            <p className="text-sm text-[#0A3D62]">Số bài học</p>
                                            <p className="font-semibold text-[#0A3D62]">{product.courseInfo.lessons} bài</p>
                                        </div>
                                        <div className="bg-[#E0F4F7] p-4 rounded-lg">
                                            <p className="text-sm text-[#0A3D62]">Cấp độ</p>
                                            <p className="font-semibold text-[#0A3D62] capitalize">{product.courseInfo.level}</p>
                                        </div>
                                        <div className="bg-[#E0F4F7] p-4 rounded-lg">
                                            <p className="text-sm text-[#0A3D62]">Độ tuổi phù hợp</p>
                                            <p className="font-semibold text-[#0A3D62]">{product.courseInfo.ageGroup}</p>
                                        </div>
                                        <div className="bg-[#E0F4F7] p-4 rounded-lg">
                                            <p className="text-sm text-[#0A3D62]">Thể loại</p>
                                            <p className="font-semibold text-[#0A3D62]">{product.courseInfo.genre}</p>
                                        </div>
                                        <div className="bg-[#E0F4F7] p-4 rounded-lg">
                                            <p className="text-sm text-[#0A3D62]">Chứng chỉ</p>
                                            <p className="font-semibold text-[#0A3D62]">
                                                {product.courseInfo.certificate ? 'Có' : 'Không'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Included Products/Bonuses */}
                            {product.includedProducts && product.includedProducts.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-[#0A3D62]">
                                        🎁 Quà tặng đi kèm
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {product.includedProducts.map((item, index) => (
                                            <div key={index} className="bg-gradient-to-r from-[#E0F4F7] to-[#C1E7EB] p-4 rounded-lg border border-[#FFD700]">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-[#0A3D62] text-sm">{item.name}</h4>
                                                        <p className="text-[#0A3D62] text-xs mt-1">{item.description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Event Information */}
                            {product.category === 'event' && product.eventInfo && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-[#0A3D62]">
                                        Thông tin sự kiện
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-[#E0F4F7] p-4 rounded-lg">
                                            <p className="text-sm text-[#0A3D62]">Ngày diễn ra</p>
                                            <p className="font-semibold text-[#0A3D62]">
                                                {new Date(product.eventInfo.eventDate).toLocaleDateString('vi-VN')}
                                            </p>
                                        </div>
                                        <div className="bg-[#E0F4F7] p-4 rounded-lg">
                                            <p className="text-sm text-[#0A3D62]">Thời gian</p>
                                            <p className="font-semibold text-[#0A3D62]">{product.eventInfo.eventTime}</p>
                                        </div>
                                        <div className="bg-[#E0F4F7] p-4 rounded-lg">
                                            <p className="text-sm text-[#0A3D62]">Địa điểm</p>
                                            <p className="font-semibold text-[#0A3D62]">{product.eventInfo.location}</p>
                                        </div>
                                        <div className="bg-[#E0F4F7] p-4 rounded-lg">
                                            <p className="text-sm text-[#0A3D62]">Ban tổ chức</p>
                                            <p className="font-semibold text-[#0A3D62]">{product.eventInfo.organizer}</p>
                                        </div>
                                        <div className="bg-[#E0F4F7] p-4 rounded-lg">
                                            <p className="text-sm text-[#0A3D62]">Loại sự kiện</p>
                                            <p className="font-semibold text-[#0A3D62] capitalize">{product.eventInfo.eventType}</p>
                                        </div>
                                        <div className="bg-[#E0F4F7] p-4 rounded-lg">
                                            <p className="text-sm text-[#0A3D62]">Số lượng tối đa</p>
                                            <p className="font-semibold text-[#0A3D62]">{product.eventInfo.maxAttendees} người</p>
                                        </div>
                                    </div>

                                    {/* Agenda */}
                                    {product.eventInfo.agenda && product.eventInfo.agenda.length > 0 && (
                                        <div className="bg-[#E0F4F7] p-4 rounded-lg">
                                            <h4 className="font-semibold text-[#0A3D62] mb-3">Chương trình sự kiện</h4>
                                            <ul className="space-y-2">
                                                {product.eventInfo.agenda.map((item, index) => (
                                                    <li key={index} className="flex items-start space-x-2">
                                                        <span className="text-[#00A8B5] font-bold">{index + 1}.</span>
                                                        <span className="text-[#0A3D62]">{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Demo/Video Links */}
                            {(product.demoUrl || product.videoUrl) && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-[#0A3D62]">
                                        Liên kết
                                    </h3>
                                    <div className="space-y-2">
                                        {product.demoUrl && (
                                            <a
                                                href={product.demoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center space-x-2 px-4 py-2 bg-[#00A8B5] text-white rounded-lg hover:bg-[#007C8D] transition-colors"
                                            >
                                                <span>🎮</span>
                                                <span>Xem Demo</span>
                                            </a>
                                        )}
                                        {product.videoUrl && (
                                            <a
                                                href={product.videoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center space-x-2 px-4 py-2 bg-[#FFD700] text-[#0A3D62] rounded-lg hover:bg-[#E6C200] transition-colors ml-2"
                                            >
                                                <span>🎥</span>
                                                <span>Xem Video</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="space-y-4 pt-6">
                                <button
                                    onClick={handleBuyClick}
                                    disabled={product.pquantity <= 0}
                                    className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all ${product.pquantity > 0
                                        ? 'bg-[#FFD700] text-[#0A3D62] hover:bg-[#E6C200] shadow-lg hover:shadow-xl'
                                        : 'bg-[#C1E7EB] text-[#0A3D62] cursor-not-allowed'
                                        }`}
                                >
                                    {product.pquantity > 0 ? '🛒 Mua ngay' : 'Hết hàng'}
                                </button>

                                <button
                                    onClick={() => router.push("/shop")}
                                    className="w-full py-3 px-6 border-2 border-[#FFD700] text-[#007C8D] rounded-xl font-semibold hover:bg-[#E0F4F7] transition-colors"
                                >
                                    ← Quay lại cửa hàng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Popup */}
            {product && (
                <OrderPopup
                    open={isPopupOpen}
                    onClose={() => setIsPopupOpen(false)}
                    product={product}
                    onSubmit={handleSubmitOrder}
                    user={user || undefined}
                />
            )}
        </div>
    );
}