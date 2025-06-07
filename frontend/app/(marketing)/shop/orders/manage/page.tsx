// 📄 File: app/shop/orders/manage/page.tsx

'use client';

import OrderList from '@/components/admin/OrderList';

export default function AdminOrderManagePage() {
  return (
    <div className="p-6">
      <OrderList />
    </div>
  );
}
