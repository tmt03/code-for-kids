import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();
  
  // Xử lý lưu đơn hàng vào database
  
  return NextResponse.json({ 
    success: true,
    orderId: '12345' // ID đơn hàng
  });
}