'use client'
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import GuestOrderPopup from "@/components/shop/GuestOrderPopup";
import UserOrderHistory from "@/components/shop/UserOrderHistory";

export default function OrderHistoryPage() {
  const { user } = useAuth();

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mt-4">Lịch sử đơn hàng</h1>
      {user?.role === "user" && <UserOrderHistory />}
      {!user && (
        <GuestOrderPopup
          open={true}
          onClose={() => {}}
          product={null}
        />
      )}
    </div>
  );
}
