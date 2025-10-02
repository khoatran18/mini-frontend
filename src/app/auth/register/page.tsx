'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthAPI, RegisterInput } from '@/src/lib/endpoints';

export default function RegisterPage() {
  const [credentials, setCredentials] = useState<RegisterInput>({ username: '', password: '', role: 'buyer' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await AuthAPI.register(credentials);
      router.push('/auth/login');
    } catch (err) {
      setError('Failed to register. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        {error && <p className="text-red-500">{error}</p>}
        <div className="mb-4">
          <label>Username</label>
          <input
            type="text"
            name="username"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>
        <div className="mb-4">
          <label>Password</label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>
        <div className="mb-4">
          <label>Role</label>
          <select
            name="role"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          >
            <option value="buyer">Buyer</option>
            <option value="seller_admin">Seller Admin</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
}
