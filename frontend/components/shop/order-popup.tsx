'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface OrderPopupProps {
    product: {
        id: number;
        name: string;
        price: number;
    };
    onClose: () => void;
    onSubmit: (data: { fullName: string; phone: string; email: string; address: string; question?: string }) => void;
}

export default function OrderPopup({ product, onClose, onSubmit }: OrderPopupProps) {
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        question: '',
    });
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError(null); // Xóa lỗi khi người dùng sửa
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.fullName || !formData.phone || !formData.email || !formData.address) {
            setError('Vui lòng điền đầy đủ thông tin bắt buộc (họ tên, số điện thoại, email, địa chỉ).');
            return;
        }
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">ĐẶT HÀNG: {product.name}</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Họ và tên *</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Số điện thoại *</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Địa chỉ *</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Câu hỏi (nếu có)</label>
                        <textarea
                            name="question"
                            value={formData.question}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            rows={3}
                        />
                    </div>
                    <div className="flex justify-end gap-4">
                        <Button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded"
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                        >
                            Hoàn thành
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}