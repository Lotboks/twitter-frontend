'use client';

import { useState } from 'react';
import { loginUser } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    try {
      const res = await loginUser({ username, password });
      login(res.access_token, res.user);
      router.push('/feed');
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      <input
        placeholder="Username"
        className="border p-2 w-full mb-2"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full mb-4"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleLogin}
        className="bg-green-600 text-white w-full p-2"
      >
        Login
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
