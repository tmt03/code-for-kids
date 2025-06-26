'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/lib/utils/axiosInstance";
import { Product } from "@/types/product";
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function ProductManagementPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [form, setForm] = useState<Partial<Product>>({ category: 'course', isFeatured: false });
    const [showIncludedProducts, setShowIncludedProducts] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const isAddMode = useRef(false);

    // Fetch products
    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const res = await axiosInstance.get("/v1/products/all");
            setProducts(res.data.data.filter((p: Product) => p.isActive));
        } catch {
            toast.error("Không thể tải danh sách sản phẩm");
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => { fetchProducts(); }, []);

    // Draft save/restore for add form
    useEffect(() => {
        if (isAddOpen) {
            isAddMode.current = true;
            // Restore draft if exists
            const draft = localStorage.getItem('productFormDraft');
            if (draft) {
                try {
                    const parsed = JSON.parse(draft);
                    setForm(parsed.form || { category: 'course', isFeatured: false });
                    setShowIncludedProducts(!!parsed.showIncludedProducts);
                } catch { }
            }
        } else if (isAddMode.current) {
            // Clear draft when closing add form
            localStorage.removeItem('productFormDraft');
            isAddMode.current = false;
        }
    }, [isAddOpen]);

    useEffect(() => {
        if (isAddOpen) {
            localStorage.setItem('productFormDraft', JSON.stringify({ form, showIncludedProducts }));
        }
    }, [form, showIncludedProducts, isAddOpen]);

    // Basic validate
    const validate = () => {
        const errs: Record<string, string> = {};
        if (!form.pid) errs.pid = "PID là bắt buộc";
        if (!form.pname) errs.pname = "Tên sản phẩm là bắt buộc";
        if (!form.pprice || isNaN(+form.pprice) || +form.pprice <= 0) errs.pprice = "Giá phải > 0";
        if (form.pquantity === undefined || isNaN(+form.pquantity) || +form.pquantity < 0) errs.pquantity = "Số lượng phải >= 0";
        if (!form.pimg) errs.pimg = "Ảnh là bắt buộc";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    // Add product
    const handleAddProduct = async () => {
        if (!validate()) return;
        try {
            await axiosInstance.post("/v1/products", {
                ...form,
                isActive: true,
                features: form.features || [],
                images: form.images || [],
            });
            toast.success("Đã thêm sản phẩm!");
            setIsAddOpen(false);
            localStorage.removeItem('productFormDraft');
            fetchProducts();
        } catch {
            toast.error("Thêm sản phẩm thất bại!");
        }
    };

    // Edit product
    const handleEditProduct = async () => {
        if (!validate() || !form.pid) return;
        try {
            // Remove _id before sending update (type-safe)
            const updateData = { ...form };
            delete (updateData as any)._id;
            await axiosInstance.put(`/v1/products/${form.pid}`, updateData);
            toast.success("Đã cập nhật sản phẩm!");
            setIsEditOpen(false);
            fetchProducts();
        } catch {
            toast.error("Cập nhật sản phẩm thất bại!");
        }
    };

    // Soft delete
    const handleDeleteProduct = async (pid: string) => {
        if (!window.confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) return;
        try {
            await axiosInstance.delete(`/v1/products/${pid}`);
            toast.success("Đã xóa sản phẩm!");
            fetchProducts();
        } catch {
            toast.error("Xóa sản phẩm thất bại!");
        }
    };

    // Helpers
    function getImageUrl(path: string) {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        if (typeof window !== 'undefined') {
            return window.location.origin + path;
        }
        return path;
    }

    // Dialog form
    const renderFormModal = (isEdit: boolean) => (
        <Dialog.Root open={isEdit ? isEditOpen : isAddOpen} onOpenChange={open => { isEdit ? setIsEditOpen(open) : setIsAddOpen(open); }}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
                <Dialog.Content className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
                    <Dialog.Title className="text-2xl font-bold mb-4">{isEdit ? "Sửa sản phẩm" : "Thêm sản phẩm"}</Dialog.Title>
                    <div className="space-y-4">
                        <div>
                            <label className="block font-medium mb-1">PID (mã sản phẩm)</label>
                            <Input name="pid" value={form.pid || ""} onChange={e => setForm(f => ({ ...f, pid: e.target.value }))} readOnly={isEdit} />
                            {errors.pid && <div className="text-red-500 text-xs mt-1">{errors.pid}</div>}
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Tên sản phẩm</label>
                            <Input name="pname" value={form.pname || ""} onChange={e => setForm(f => ({ ...f, pname: e.target.value }))} />
                            {errors.pname && <div className="text-red-500 text-xs mt-1">{errors.pname}</div>}
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Ảnh sản phẩm</label>
                            <Input name="pimg" value={form.pimg || ""} onChange={e => setForm(f => ({ ...f, pimg: e.target.value }))} />
                            {form.pimg && <img src={getImageUrl(form.pimg)} alt="Ảnh sản phẩm" className="w-32 h-32 object-cover rounded mt-2 border" />}
                            {errors.pimg && <div className="text-red-500 text-xs mt-1">{errors.pimg}</div>}
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Giá</label>
                            <Input name="pprice" type="number" value={form.pprice || ""} onChange={e => setForm(f => ({ ...f, pprice: +e.target.value }))} />
                            {errors.pprice && <div className="text-red-500 text-xs mt-1">{errors.pprice}</div>}
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Số lượng</label>
                            <Input name="pquantity" type="number" value={form.pquantity || 0} onChange={e => setForm(f => ({ ...f, pquantity: +e.target.value }))} />
                            {errors.pquantity && <div className="text-red-500 text-xs mt-1">{errors.pquantity}</div>}
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Loại sản phẩm</label>
                            <select className="w-full border rounded px-2 py-1" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as 'course' | 'event' }))}>
                                <option value="course">Khóa học</option>
                                <option value="event">Sự kiện</option>
                            </select>
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Mô tả ngắn</label>
                            <Input name="shortDescription" value={form.shortDescription || ""} onChange={e => setForm(f => ({ ...f, shortDescription: e.target.value }))} />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Mô tả chi tiết</label>
                            <textarea className="w-full border rounded px-2 py-1 min-h-[80px]" name="longDescription" value={form.longDescription || ""} onChange={e => setForm(f => ({ ...f, longDescription: e.target.value }))} />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Tính năng nổi bật (cách nhau bởi dấu phẩy)</label>
                            <Input name="features" value={form.features ? form.features.join(", ") : ""} onChange={e => setForm(f => ({ ...f, features: e.target.value.split(",").map(s => s.trim()).filter(Boolean) }))} />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Gallery ảnh (cách nhau bởi dấu phẩy)</label>
                            <Input name="images" value={form.images ? form.images.join(", ") : ""} onChange={e => setForm(f => ({ ...f, images: e.target.value.split(",").map(s => s.trim()).filter(Boolean) }))} />
                            <div className="flex flex-wrap gap-2 mt-2">
                                {form.images && form.images.map((img, idx) => <img key={idx} src={getImageUrl(img)} alt="gallery" className="w-16 h-16 object-cover rounded border" />)}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" checked={form.isFeatured || false} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} />
                            <span className="font-medium">Sản phẩm nổi bật</span>
                        </div>
                        {form.category === 'course' && (
                            <div className="space-y-2 border rounded p-2 mt-2">
                                <div className="font-semibold text-sm">Thông tin khóa học</div>
                                <Input name="duration" placeholder="Thời lượng (vd: 10 hours)" value={form.courseInfo?.duration || ""} onChange={e => setForm(f => ({
                                    ...f,
                                    courseInfo: {
                                        duration: e.target.value,
                                        lessons: f.courseInfo?.lessons ?? 0,
                                        level: f.courseInfo?.level ?? "beginner",
                                        ageGroup: f.courseInfo?.ageGroup ?? "",
                                        genre: f.courseInfo?.genre ?? "",
                                        certificate: f.courseInfo?.certificate ?? false,
                                    }
                                }))} />
                                <Input name="lessons" placeholder="Số bài học" type="number" value={form.courseInfo?.lessons || 0} onChange={e => setForm(f => ({
                                    ...f,
                                    courseInfo: {
                                        duration: f.courseInfo?.duration ?? "",
                                        lessons: +e.target.value,
                                        level: f.courseInfo?.level ?? "beginner",
                                        ageGroup: f.courseInfo?.ageGroup ?? "",
                                        genre: f.courseInfo?.genre ?? "",
                                        certificate: f.courseInfo?.certificate ?? false,
                                    }
                                }))} />
                                <Input name="level" placeholder="Trình độ (beginner/intermediate/advanced)" value={form.courseInfo?.level || ""} onChange={e => setForm(f => ({
                                    ...f,
                                    courseInfo: {
                                        duration: f.courseInfo?.duration ?? "",
                                        lessons: f.courseInfo?.lessons ?? 0,
                                        level: e.target.value as any,
                                        ageGroup: f.courseInfo?.ageGroup ?? "",
                                        genre: f.courseInfo?.genre ?? "",
                                        certificate: f.courseInfo?.certificate ?? false,
                                    }
                                }))} />
                                <Input name="ageGroup" placeholder="Nhóm tuổi" value={form.courseInfo?.ageGroup || ""} onChange={e => setForm(f => ({
                                    ...f,
                                    courseInfo: {
                                        duration: f.courseInfo?.duration ?? "",
                                        lessons: f.courseInfo?.lessons ?? 0,
                                        level: f.courseInfo?.level ?? "beginner",
                                        ageGroup: e.target.value,
                                        genre: f.courseInfo?.genre ?? "",
                                        certificate: f.courseInfo?.certificate ?? false,
                                    }
                                }))} />
                                <Input name="genre" placeholder="Thể loại" value={form.courseInfo?.genre || ""} onChange={e => setForm(f => ({
                                    ...f,
                                    courseInfo: {
                                        duration: f.courseInfo?.duration ?? "",
                                        lessons: f.courseInfo?.lessons ?? 0,
                                        level: f.courseInfo?.level ?? "beginner",
                                        ageGroup: f.courseInfo?.ageGroup ?? "",
                                        genre: e.target.value,
                                        certificate: f.courseInfo?.certificate ?? false,
                                    }
                                }))} />
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" checked={form.courseInfo?.certificate || false} onChange={e => setForm(f => ({
                                        ...f,
                                        courseInfo: {
                                            duration: f.courseInfo?.duration ?? "",
                                            lessons: f.courseInfo?.lessons ?? 0,
                                            level: f.courseInfo?.level ?? "beginner",
                                            ageGroup: f.courseInfo?.ageGroup ?? "",
                                            genre: f.courseInfo?.genre ?? "",
                                            certificate: e.target.checked,
                                        }
                                    }))} />
                                    <span>Có cấp chứng nhận</span>
                                </div>
                            </div>
                        )}
                        {form.category === 'event' && (
                            <div className="space-y-2 border rounded p-2 mt-2">
                                <div className="font-semibold text-sm">Thông tin sự kiện</div>
                                <Input name="eventDate" placeholder="Ngày tổ chức (YYYY-MM-DD)" value={form.eventInfo?.eventDate ? String(form.eventInfo.eventDate).slice(0, 10) : ""} onChange={e => setForm(f => ({
                                    ...f,
                                    eventInfo: {
                                        eventDate: e.target.value ? new Date(e.target.value) : new Date(),
                                        eventTime: f.eventInfo?.eventTime ?? "",
                                        location: f.eventInfo?.location ?? "",
                                        organizer: f.eventInfo?.organizer ?? "",
                                        maxAttendees: f.eventInfo?.maxAttendees ?? 0,
                                        eventType: f.eventInfo?.eventType ?? "workshop",
                                        agenda: f.eventInfo?.agenda ?? [],
                                    }
                                }))} />
                                <Input name="eventTime" placeholder="Thời gian" value={form.eventInfo?.eventTime || ""} onChange={e => setForm(f => ({
                                    ...f,
                                    eventInfo: {
                                        eventDate: f.eventInfo?.eventDate ?? new Date(),
                                        eventTime: e.target.value,
                                        location: f.eventInfo?.location ?? "",
                                        organizer: f.eventInfo?.organizer ?? "",
                                        maxAttendees: f.eventInfo?.maxAttendees ?? 0,
                                        eventType: f.eventInfo?.eventType ?? "workshop",
                                        agenda: f.eventInfo?.agenda ?? [],
                                    }
                                }))} />
                                <Input name="location" placeholder="Địa điểm" value={form.eventInfo?.location || ""} onChange={e => setForm(f => ({
                                    ...f,
                                    eventInfo: {
                                        eventDate: f.eventInfo?.eventDate ?? new Date(),
                                        eventTime: f.eventInfo?.eventTime ?? "",
                                        location: e.target.value,
                                        organizer: f.eventInfo?.organizer ?? "",
                                        maxAttendees: f.eventInfo?.maxAttendees ?? 0,
                                        eventType: f.eventInfo?.eventType ?? "workshop",
                                        agenda: f.eventInfo?.agenda ?? [],
                                    }
                                }))} />
                                <Input name="organizer" placeholder="Đơn vị tổ chức" value={form.eventInfo?.organizer || ""} onChange={e => setForm(f => ({
                                    ...f,
                                    eventInfo: {
                                        eventDate: f.eventInfo?.eventDate ?? new Date(),
                                        eventTime: f.eventInfo?.eventTime ?? "",
                                        location: f.eventInfo?.location ?? "",
                                        organizer: e.target.value,
                                        maxAttendees: f.eventInfo?.maxAttendees ?? 0,
                                        eventType: f.eventInfo?.eventType ?? "workshop",
                                        agenda: f.eventInfo?.agenda ?? [],
                                    }
                                }))} />
                                <Input name="maxAttendees" placeholder="Số người tối đa" type="number" value={form.eventInfo?.maxAttendees || 0} onChange={e => setForm(f => ({
                                    ...f,
                                    eventInfo: {
                                        eventDate: f.eventInfo?.eventDate ?? new Date(),
                                        eventTime: f.eventInfo?.eventTime ?? "",
                                        location: f.eventInfo?.location ?? "",
                                        organizer: f.eventInfo?.organizer ?? "",
                                        maxAttendees: +e.target.value,
                                        eventType: f.eventInfo?.eventType ?? "workshop",
                                        agenda: f.eventInfo?.agenda ?? [],
                                    }
                                }))} />
                                <Input name="eventType" placeholder="Loại sự kiện (workshop, seminar, hackathon, conference)" value={form.eventInfo?.eventType || ""} onChange={e => setForm(f => ({
                                    ...f,
                                    eventInfo: {
                                        eventDate: f.eventInfo?.eventDate ?? new Date(),
                                        eventTime: f.eventInfo?.eventTime ?? "",
                                        location: f.eventInfo?.location ?? "",
                                        organizer: f.eventInfo?.organizer ?? "",
                                        maxAttendees: f.eventInfo?.maxAttendees ?? 0,
                                        eventType: e.target.value as any,
                                        agenda: f.eventInfo?.agenda ?? [],
                                    }
                                }))} />
                                <Input name="agenda" placeholder="Chương trình (cách nhau bởi dấu phẩy)" value={form.eventInfo?.agenda ? form.eventInfo.agenda.join(", ") : ""} onChange={e => setForm(f => ({
                                    ...f,
                                    eventInfo: {
                                        eventDate: f.eventInfo?.eventDate ?? new Date(),
                                        eventTime: f.eventInfo?.eventTime ?? "",
                                        location: f.eventInfo?.location ?? "",
                                        organizer: f.eventInfo?.organizer ?? "",
                                        maxAttendees: f.eventInfo?.maxAttendees ?? 0,
                                        eventType: f.eventInfo?.eventType ?? "workshop",
                                        agenda: e.target.value.split(",").map(s => s.trim()).filter(Boolean),
                                    }
                                }))} />
                            </div>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                            <input type="checkbox" checked={showIncludedProducts} onChange={e => setShowIncludedProducts(e.target.checked)} />
                            <span className="font-medium">Có sản phẩm đi kèm</span>
                        </div>
                        {showIncludedProducts && (
                            <div className="space-y-2 border rounded p-2 mt-2">
                                <div className="font-semibold text-sm mb-2">Danh sách sản phẩm đi kèm</div>
                                {(form.includedProducts || []).map((prod, idx) => (
                                    <div key={idx} className="flex flex-col gap-2 border-b pb-2 mb-2">
                                        <Input placeholder="Tên sản phẩm" value={prod.name} onChange={e => setForm(f => ({ ...f, includedProducts: (f.includedProducts || []).map((p, i) => i === idx ? { ...p, name: e.target.value } : p) }))} />
                                        <Input placeholder="Ảnh (URL hoặc local)" value={prod.image} onChange={e => setForm(f => ({ ...f, includedProducts: (f.includedProducts || []).map((p, i) => i === idx ? { ...p, image: e.target.value } : p) }))} />
                                        <Input placeholder="Mô tả" value={prod.description} onChange={e => setForm(f => ({ ...f, includedProducts: (f.includedProducts || []).map((p, i) => i === idx ? { ...p, description: e.target.value } : p) }))} />
                                        <div className="flex justify-end">
                                            <Button variant="pixelDanger" size="sm" onClick={() => setForm(f => ({ ...f, includedProducts: (f.includedProducts || []).filter((_, i) => i !== idx) }))}>Xóa</Button>
                                        </div>
                                    </div>
                                ))}
                                <Button size="sm" onClick={() => setForm(f => ({ ...f, includedProducts: [...(f.includedProducts || []), { name: '', image: '', description: '' }] }))}>+ Thêm sản phẩm đi kèm</Button>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <Button variant="default" onClick={() => { isEdit ? setIsEditOpen(false) : setIsAddOpen(false); }}>Hủy</Button>
                        <Button onClick={isEdit ? handleEditProduct : handleAddProduct}>{isEdit ? "Lưu" : "Thêm"}</Button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );

    // Detail modal
    const renderDetailModal = () => (
        <Dialog.Root open={isDetailOpen} onOpenChange={setIsDetailOpen}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
                <Dialog.Content className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl w-full max-w-lg p-6">
                    {selectedProduct && (
                        <>
                            <Dialog.Title className="text-xl font-bold mb-4">Chi tiết sản phẩm</Dialog.Title>
                            <img src={getImageUrl(selectedProduct.pimg)} alt={selectedProduct.pname} className="w-full h-48 object-cover rounded mb-4" />
                            <div className="font-bold text-lg mb-2">{selectedProduct.pname}</div>
                            <div className="text-green-600 font-semibold mb-2">{selectedProduct.pprice.toLocaleString()} đ</div>
                            <div className="mb-2">Số lượng: {selectedProduct.pquantity}</div>
                            <div className="mb-2">Loại: {selectedProduct.category}</div>
                            <div className="mb-2">Mô tả: {selectedProduct.pdescription}</div>
                            <div className="mb-2 text-xs text-gray-500">PID: {selectedProduct.pid}</div>
                            <div className="flex justify-end mt-4">
                                <Button variant="default" onClick={() => setIsDetailOpen(false)}>Đóng</Button>
                            </div>
                        </>
                    )}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );

    // Table
    const renderTable = () => (
        <div className="hidden md:block bg-white rounded-lg shadow-lg p-4">
            <table className="w-full min-w-[900px]">
                <thead className="bg-green-600 text-white">
                    <tr>
                        <th className="px-4 py-2 text-left">Tên sản phẩm</th>
                        <th className="px-4 py-2 text-left">Giá</th>
                        <th className="px-4 py-2 text-left">Số lượng</th>
                        <th className="px-4 py-2 text-left">Loại</th>
                        <th className="px-4 py-2 text-left">Trạng thái</th>
                        <th className="px-4 py-2 text-center">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((p) => (
                        <tr key={p.pid} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-2 font-semibold flex items-center gap-2">
                                <img src={getImageUrl(p.pimg)} alt={p.pname} className="w-10 h-10 rounded object-cover" />
                                {p.pname}
                            </td>
                            <td className="px-4 py-2">{p.pprice.toLocaleString()} đ</td>
                            <td className="px-4 py-2">{p.pquantity}</td>
                            <td className="px-4 py-2 capitalize">{p.category}</td>
                            <td className="px-4 py-2">
                                {p.isActive ? <span className="text-green-600 font-bold">Đang bán</span> : <span className="text-gray-400">Ẩn</span>}
                            </td>
                            <td className="px-4 py-2 text-center">
                                <button className="text-blue-600 hover:underline mr-2" onClick={() => { setSelectedProduct(p); setIsDetailOpen(true); }}>Xem</button>
                                <button className="text-yellow-600 hover:underline mr-2" onClick={() => {
                                    setForm(p);
                                    setShowIncludedProducts(!!(p.includedProducts && p.includedProducts.length > 0));
                                    setIsEditOpen(true);
                                }}>Sửa</button>
                                <button className="text-red-600 hover:underline" onClick={() => handleDeleteProduct(p.pid)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    // Cards (mobile)
    const renderCards = () => (
        <div className="md:hidden space-y-4">
            {products.map((p) => (
                <div key={p.pid} className="bg-white rounded-lg shadow-lg p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <img src={getImageUrl(p.pimg)} alt={p.pname} className="w-16 h-16 rounded object-cover" />
                        <div>
                            <div className="font-bold text-lg">{p.pname}</div>
                            <div className="text-green-600 font-semibold">{p.pprice.toLocaleString()} đ</div>
                            <div className="text-xs text-gray-500">{p.category}</div>
                        </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                        <button className="text-blue-600 hover:underline" onClick={() => { setSelectedProduct(p); setIsDetailOpen(true); }}>Xem</button>
                        <button className="text-yellow-600 hover:underline" onClick={() => {
                            setForm(p);
                            setShowIncludedProducts(!!(p.includedProducts && p.includedProducts.length > 0));
                            setIsEditOpen(true);
                        }}>Sửa</button>
                        <button className="text-red-600 hover:underline" onClick={() => handleDeleteProduct(p.pid)}>Xóa</button>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#E8F1F2] to-[#D3E0E1] p-2 sm:p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">
                <div className="bg-[#0A3D62] border border-white rounded-lg p-4 sm:p-6 text-white mb-4 sm:mb-6">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">🛒 Quản lý sản phẩm</h1>
                    <p className="text-sm sm:text-base text-gray-300">Thêm, sửa, xóa và xem chi tiết sản phẩm</p>
                </div>
                <div className="flex justify-end max-w-6xl mx-auto mb-6">
                    <Button onClick={() => { setForm({ category: 'course', isFeatured: false }); setErrors({}); setShowIncludedProducts(false); setIsAddOpen(true); }} className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Thêm sản phẩm
                    </Button>
                </div>
                {isLoading ? (
                    <div className="text-center py-12 text-[#0A3D62] font-semibold">Đang tải dữ liệu...</div>
                ) : (
                    <>
                        {renderTable()}
                        {renderCards()}
                    </>
                )}
                {renderFormModal(false)}
                {renderFormModal(true)}
                {renderDetailModal()}
            </div>
        </div>
    );
}
