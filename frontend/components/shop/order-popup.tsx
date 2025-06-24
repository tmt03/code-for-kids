'use client';

import { validateOrderProd } from "@/lib/utils/validateOrderProd";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface OrderPopupProps {
    open: boolean;
    onClose: () => void;
    product: {
        pid: string;
        pname: string;
        pimg: string;
        pdescription: string;
        pprice: number;
        pquantity: number;
    };
    onSubmit: (data: any) => Promise<void>;
    user?: {
        username?: string;
        phone?: string;
        email?: string;
        address?: string;
    };
}

export default function OrderPopup({ open, onClose, product, onSubmit, user }: OrderPopupProps) {
    const [quantity, setQuantity] = useState(1);
    const [buyer, setBuyer] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        note: '',
    });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (open) {
            setQuantity(1);
            setBuyer({
                name: user?.username || '',
                phone: user?.phone || '',
                email: user?.email || '',
                address: user?.address || '',
                note: '',
            });
            setSuccess(false);
            setError(null);
            setIsSubmitting(false);
        }
    }, [open, user]);

    // Đóng popup khi bấm ra ngoài
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                onClose();
            }
        }
        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open, onClose]);

    if (!open || !product) return null;

    const productTotal = typeof product.pprice === 'number' ? product.pprice * quantity : 0;
    const grandTotal = productTotal;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setBuyer({ ...buyer, [e.target.name]: e.target.value });
        // Clear error when user starts typing
        if (error) setError(null);
    };

    const handleSubmit = async () => {
        const payload = {
            products: [
                {
                    pid: product.pid,
                    pname: product.pname,
                    pprice: product.pprice,
                    quantity,
                },
            ],
            total: grandTotal,
            buyer,
        };

        const errorMsg = validateOrderProd(payload);
        if (errorMsg) {
            setError(errorMsg);
            toast.error(errorMsg);
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await onSubmit(payload);
            setSuccess(true);
            toast.success("Yêu cầu của bạn đã được gửi, vui lòng chờ xác nhận!");
        } catch (err: any) {
            // Lấy message lỗi từ API response
            const apiError = err?.response?.data?.error || err?.response?.data?.details?.join(', ') || "Gửi đơn hàng thất bại!";
            setError(apiError);
            toast.error(apiError);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div
                ref={popupRef}
                className="relative w-full max-w-md sm:max-w-lg bg-white rounded-3xl shadow-2xl p-0 overflow-hidden animate-scaleIn max-h-[90vh] overflow-y-auto"
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-[#0A3D62] hover:text-red-500 text-3xl z-10 focus:outline-none"
                    aria-label="Đóng"
                >
                    <IoClose />
                </button>
                {/* Header sản phẩm */}
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-[#E0F4F7] to-[#C1E7EB] p-6 border-b-2 border-[#FFD700]">
                    <img
                        src={product.pimg}
                        alt={product.pname}
                        className="w-24 h-24 object-contain rounded-2xl shadow-md bg-white"
                    />
                    <div className="flex-1 text-center sm:text-left">
                        <h2 className="text-2xl font-extrabold text-[#007C8D] mb-1 drop-shadow">{product.pname}</h2>
                        <div className="text-lg text-[#0A3D62] font-semibold mb-1">
                            Giá: <span className="text-[#FFD700] font-bold">{product.pprice.toLocaleString('vi-VN')}₫</span>
                        </div>
                        <div className="text-sm text-[#0A3D62]">Số lượng còn: {product.pquantity}</div>
                    </div>
                </div>
                {success ? (
                    <div className="flex flex-col items-center justify-center p-8 min-h-[350px]">
                        <div className="text-4xl mb-4">🎉</div>
                        <h2 className="text-2xl font-bold text-[#00A8B5] mb-2 text-center">Bạn đã gửi thông tin mua hàng thành công!</h2>
                        <p className="text-center text-[#0A3D62] mb-6">Nhân viên hỗ trợ sẽ liên hệ với bạn sớm để kích hoạt khóa học cho bạn. Hãy chú ý điện thoại nhé!</p>
                        <div className="flex gap-4 w-full mt-2">
                            <Button
                                variant={"default"}
                                className="flex-1 bg-[#00A8B5] hover:bg-[#007C8D] text-white font-bold py-3 rounded-md text-lg transition-all"
                                onClick={() => {
                                    onClose();
                                    router.push("/shop");
                                }}
                            >
                                Trở về
                            </Button>
                        </div>
                    </div>
                ) : (
                    <form
                        className="p-6 flex flex-col gap-4"
                        onSubmit={e => { e.preventDefault(); handleSubmit(); }}
                    >
                        {/* Hiển thị lỗi nếu có */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="text-red-500 text-xl">⚠️</div>
                                    <div className="text-red-700 font-semibold">{error}</div>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-[#0A3D62]">Số lượng <span className="text-red-500">*</span></label>
                            <input
                                type="number"
                                min={1}
                                max={product.pquantity}
                                value={quantity}
                                onChange={e => setQuantity(Number(e.target.value))}
                                className="w-full border-2 border-[#FFD700] focus:border-[#00A8B5] px-4 py-2 rounded-lg text-lg outline-none transition"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-[#0A3D62]">Tên người mua <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="name"
                                value={buyer.name}
                                onChange={handleChange}
                                className="w-full border-2 border-[#FFD700] focus:border-[#00A8B5] px-4 py-2 rounded-lg text-lg outline-none transition"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-[#0A3D62]">Số điện thoại <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="phone"
                                value={buyer.phone}
                                onChange={handleChange}
                                className="w-full border-2 border-[#FFD700] focus:border-[#00A8B5] px-4 py-2 rounded-lg text-lg outline-none transition"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-[#0A3D62]">Email <span className="text-red-500">*</span></label>
                            <input
                                type="email"
                                name="email"
                                value={buyer.email}
                                onChange={handleChange}
                                className="w-full border-2 border-[#FFD700] focus:border-[#00A8B5] px-4 py-2 rounded-lg text-lg outline-none transition"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-[#0A3D62]">Địa chỉ - để gửi sản phẩm đi kèm (nếu có) <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="address"
                                value={buyer.address}
                                onChange={handleChange}
                                className="w-full border-2 border-[#FFD700] focus:border-[#00A8B5] px-4 py-2 rounded-lg text-lg outline-none transition"
                            />
                        </div>
                        <div className="flex fore-col gap-2">
                            <label className="font-semibold text-[#0A3D62]">Ghi chú</label>
                            <textarea
                                name="note"
                                value={buyer.note}
                                onChange={handleChange}
                                className="w-full border-2 border-[#FFD700] focus:border-[#00A8B5] px-4 py-2 rounded-lg text-lg outline-none transition"
                            />
                        </div>
                        {/* Tổng tiền */}
                        <div className="bg-[#E0F4F7] p-4 rounded-xl flex flex-col gap-1 text-base font-semibold text-[#0A3D62] shadow-inner">
                            <div>🧾 Tiền hàng: <span className="text-[#00A8B5]">{productTotal.toLocaleString('vi-VN')}₫</span></div>
                            <div>💰 Tổng thanh toán: <span className="text-[#00A8B5] text-lg">{grandTotal.toLocaleString('vi-VN')}₫</span></div>
                        </div>
                        {/* Nút hành động */}
                        <div className="flex gap-3 mt-2">
                            <Button
                                type="button"
                                onClick={onClose}
                                className="flex-1 bg-[#C1E7EB] hover:bg-[#00A8B5] text-[#0A3D62] font-bold py-3 rounded-md text-lg transition-all"
                                disabled={isSubmitting}
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 bg-[#FFD700] hover:bg-[#E6C200] text-[#0A3D62] font-bold py-3 rounded-md text-lg transition-all"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Đang gửi..." : "Xác nhận"}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
            {/* Hiệu ứng mở popup */}
            <style jsx global>{`
                .animate-fadeIn { animation: fadeIn 0.2s; }
                .animate-scaleIn { animation: scaleIn 0.25s cubic-bezier(0.4,0,0.2,1); }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleIn { from { transform: scale(0.85); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            `}</style>
        </div >
    );
}