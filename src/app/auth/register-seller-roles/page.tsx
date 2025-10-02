"use client";
import { useState } from 'react';
import { AuthAPI } from '@/src/services/auth';

export default function RegisterSellerRolesPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('seller');
  const [sellerAdminId, setSellerAdminId] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setMsg(null); setLoading(true);
    try {
      const res = await AuthAPI.registerSellerRoles({ username, password, role, seller_admin_id: sellerAdminId });
      setMsg(res.message);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || 'Register seller role failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Register Seller Role</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <select className="w-full border rounded px-3 py-2" value={role} onChange={e=>setRole(e.target.value)}>
          <option value="admin">admin</option>
          <option value="buyer">buyer</option>
          <option value="seller">seller</option>
        </select>
        <input className="w-full border rounded px-3 py-2" type="number" placeholder="Seller Admin ID" value={sellerAdminId || ''} onChange={e=>setSellerAdminId(Number(e.target.value) || 0)} />
        {msg && <div className="text-green-700">{msg}</div>}
        {error && <div className="text-red-600">{error}</div>}
        <button disabled={loading} className="w-full bg-blue-600 text-white rounded px-4 py-2">{loading ? 'Submitting...' : 'Register'}</button>
      </form>
    </div>
  );
}
