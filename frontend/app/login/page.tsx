import { useEffect } from 'react';
import Login from '../../components/Login';
import { fetchCheckLogin } from '../apis';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <Login />
    </div>
  );
} 