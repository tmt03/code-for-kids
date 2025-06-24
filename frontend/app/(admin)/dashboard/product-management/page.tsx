'use client';

import axiosInstance from "@/lib/utils/axiosInstance";
import { useState } from "react";
import { toast } from "sonner";

export default function Page() {
    const [form, setForm] = useState({
        pname: '',
        pimg: '',
        pprice: '',
        pquantity: '',
        pdescription: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const errs: Record<string, string> = {};

        if (!form.pname || form.pname.trim().length < 3)
            errs.pname = "Tên sản phẩm phải có ít nhất 3 ký tự";
        if (!form.pprice || isNaN(+form.pprice) || +form.pprice <= 0)
            errs.pprice = "Giá phải là số dương";
        if (!form.pquantity || isNaN(+form.pquantity) || +form.pquantity < 0)
            errs.pquantity = "Số lượng phải là số nguyên không âm";
        if (!form.pdescription || form.pdescription.trim().length < 10)
            errs.pdescription = "Mô tả phải có ít nhất 10 ký tự";
        if (!form.pimg || !form.pimg.startsWith("http"))
            errs.pimg = "Ảnh sản phẩm phải là URL hợp lệ";

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            await axiosInstance.post("/api/products", {
                ...form,
                pprice: +form.pprice,
                pquantity: +form.pquantity,
            });

            toast.success("🎉 Tạo sản phẩm thành công! Đang chuyển về trang sản phẩm...");
            setTimeout(() => {
                window.location.href = "/shop";
            }, 1500);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string } } };
            console.error(error);
            toast.error(error?.response?.data?.error || "❌ Tạo sản phẩm thất bại!");
        }
    };

    return (
        <div>
            <div className="flex justify-end max-w-6xl mx-auto mb-6">
                <button
                    onClick={() => window.location.href = "/shop/create"}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 4v16m8-8H4" />
                    </svg>
                    Thêm sản phẩm
                </button>
            </div>
        </div>
    );
}
