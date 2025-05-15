import { NextResponse } from 'next/server';

const USERS = {
  user1: {
    password: 'user123',
    role: 'user'
  },
  admin: {
    password: 'admin123',
    role: 'admin'
  }
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Kiểm tra thông tin đăng nhập
    if (username in USERS) {
      const user = USERS[username as keyof typeof USERS];
      if (user.password === password) {
        return NextResponse.json({
          success: true,
          role: user.role,
          message: 'Đăng nhập thành công'
        });
      }
    }

    return NextResponse.json({
      success: false,
      message: 'Tên đăng nhập hoặc mật khẩu không đúng'
    }, { status: 401 });

  } catch {
    return NextResponse.json({
      success: false,
      message: 'Có lỗi xảy ra'
    }, { status: 500 });
  }
} 