'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchCheckLogin } from '@/app/apis'; // Đường dẫn đúng đến file api

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const result = await fetchCheckLogin(username, password);

      const { token, user } = result;

      if (!result) {
        setErrorMsg('Đăng nhập thất bại: không nhận được thông tin người dùng');
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      router.push('/home');

    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      setErrorMsg('Đăng nhập thất bại: thông tin không hợp lệ');
    }
  };

  return (
    <div className="max-w-sm mx-auto p-4 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">Đăng nhập</h2>
      {errorMsg && <p className="text-red-600 mb-2">{errorMsg}</p>}
      <input
        type="text"
        placeholder="Tên đăng nhập"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Mật khẩu"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />
      <button
        onClick={handleLogin}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Đăng nhập
      </button>
    </div>
  );
}