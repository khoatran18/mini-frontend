"use client";
import { useState } from 'react';
import Link from 'next/link';
import { AuthAPI, Tokens } from '@/src/services/auth';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setLoading(true);
    try {
      const res = await AuthAPI.login({ username, password, role });
      Tokens.save(res.access_token, res.refresh_token, role);
      window.location.href = '/';
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <select className="w-full border rounded px-3 py-2" value={role} onChange={e=>setRole(e.target.value)}>
          <option value="admin">admin</option>
          <option value="buyer">buyer</option>
          <option value="seller">seller</option>
        </select>
        {error && <div className="text-red-600">{error}</div>}
        <button disabled={loading} className="w-full bg-blue-600 text-white rounded px-4 py-2">{loading ? 'Signing in...' : 'Login'}</button>
      </form>
      <div className="mt-4 text-sm flex gap-3">
        <Link href="/auth/register" className="text-blue-600">Register</Link>
        <Link href="/auth/change-password" className="text-blue-600">Change password</Link>
        <Link href="/auth/register-seller-roles" className="text-blue-600">Register seller role</Link>
      </div>
    </div>
  );
}
