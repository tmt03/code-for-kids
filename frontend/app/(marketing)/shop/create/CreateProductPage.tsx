'use client';

import { useState } from "react";
import axiosInstance from "@/lib/utils/axiosInstance";
import { toast } from "sonner";

export default function CreateProductPage() {
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
    <div className="max-w-xl mx-auto bg-white shadow p-8 rounded">
      <h1 className="text-2xl font-bold mb-6 text-center">📦 Thêm sản phẩm mới</h1>
      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label className="font-medium">Tên sản phẩm</label>
          <input
            type="text"
            name="pname"
            value={form.pname}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.pname && <p className="text-red-600 text-sm">{errors.pname}</p>}
        </div>

        <div>
          <label className="font-medium">Ảnh sản phẩm (URL)</label>
          <input
            type="text"
            name="pimg"
            value={form.pimg}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.pimg && <p className="text-red-600 text-sm">{errors.pimg}</p>}
        </div>

        <div>
          <label className="font-medium">Giá (VND)</label>
          <input
            type="number"
            name="pprice"
            value={form.pprice}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.pprice && <p className="text-red-600 text-sm">{errors.pprice}</p>}
        </div>

        <div>
          <label className="font-medium">Số lượng</label>
          <input
            type="number"
            name="pquantity"
            value={form.pquantity}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.pquantity && <p className="text-red-600 text-sm">{errors.pquantity}</p>}
        </div>

        <div>
          <label className="font-medium">Mô tả</label>
          <textarea
            name="pdescription"
            value={form.pdescription}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.pdescription && <p className="text-red-600 text-sm">{errors.pdescription}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          ➕ Tạo
        </button>
      </form>
    </div>
  );
}
