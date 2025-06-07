'use client';
import RequirePermission from "@/components/auth/RequirePermission";
import CreateProductPage from "@/app/(marketing)/shop/create/CreateProductPage";

export default function Page() {
    return (
        <RequirePermission
            permission="manageUsers"
            fallback={<div className="text-red-600 font-bold">🚫 Bạn không có quyền tạo sản phẩm</div>}
        >
            <CreateProductPage />
        </RequirePermission>
    );
}
