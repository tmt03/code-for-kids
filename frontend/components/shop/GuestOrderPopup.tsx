//componets/shop/GuestOrderPopup.tsx
'use client';

import { useState } from 'react';
import { Product } from '@/types/product';
import { toast } from 'sonner';
import axiosInstance from '@/lib/utils/axiosInstance';

interface GuestOrderPopupProps {
  open: boolean;
  onClose: () => void;
  product: Product;
  onSubmit?: (data: {
    role: string;
    products: Array<{
      pid: string;
      pname: string;
      pprice: number;
      quantity: number;
    }>;
    total: number;
    buyer: {
      name: string;
      phone: string;
      email: string;
      address: string;
      note: string;
    };
    createdBy: string;
  }) => void;
}

export default function GuestOrderPopup({ open, onClose, product, onSubmit }: GuestOrderPopupProps) {
  const [quantity, setQuantity] = useState(1);
  const [buyer, setBuyer] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    note: '',
  });

  const shippingFee = 20000;
  const productTotal = product.pprice * quantity;
  const grandTotal = productTotal + shippingFee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBuyer({ ...buyer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!buyer.name || !buyer.phone || !buyer.email || !buyer.address) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    const payload = {
      role: 'guest',
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
      createdBy: "guest",
    };

    try {
      await axiosInstance.post('/api/orders/create', payload);
      toast.success('🎉 Yêu cầu đã được gửi!');
      onSubmit?.(payload);
      onClose();
    } catch (err) {
      toast.error('❌ Lỗi gửi đơn hàng');
      console.error(err);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">🛒 Đặt hàng: {product.pname}</h2>

        <div className="mb-3">
          <label className="font-semibold">Số lượng</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full border px-3 py-2 rounded mt-1"
          />
        </div>

        <div className="mb-3">
          <label className="font-semibold">Tên người mua</label>
          <input
            type="text"
            name="name"
            value={buyer.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
          />
        </div>

        <div className="mb-3">
          <label className="font-semibold">Số điện thoại</label>
          <input
            type="text"
            name="phone"
            value={buyer.phone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
          />
        </div>

        <div className="mb-3">
          <label className="font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={buyer.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
          />
        </div>

        <div className="mb-3">
          <label className="font-semibold">Địa chỉ nhận hàng</label>
          <input
            type="text"
            name="address"
            value={buyer.address}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
          />
        </div>

        <div className="mb-3">
          <label className="font-semibold">Ghi chú (tùy chọn)</label>
          <textarea
            name="note"
            value={buyer.note}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
          />
        </div>

        <div className="bg-gray-100 p-3 rounded mb-4">
          <p>🧾 <strong>Tiền hàng:</strong> {productTotal.toLocaleString('vi-VN')}₫</p>
          <p>🚚 <strong>Phí ship:</strong> {shippingFee.toLocaleString('vi-VN')}₫</p>
          <p className="text-xl font-bold mt-2">💵 Tổng thanh toán: {grandTotal.toLocaleString('vi-VN')}₫</p>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
