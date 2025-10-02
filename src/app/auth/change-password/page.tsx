"use client";
import { useState } from 'react';
import { AuthAPI } from '@/lib/endpoints';

export default function ChangePasswordPage() {
  const [username, setUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [role, setRole] = useState('buyer');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setMsg(null); setLoading(true);
    try {
      const res = await AuthAPI.changePassword({ old_password: oldPassword, new_password: newPassword });
      setMsg(res.message);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || 'Change password failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Change Password</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" type="password" placeholder="Old password" value={oldPassword} onChange={e=>setOldPassword(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" type="password" placeholder="New password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} />
        <select className="w-full border rounded px-3 py-2" value={role} onChange={e=>setRole(e.target.value)}>
          <option value="admin">admin</option>
          <option value="buyer">buyer</option>
          <option value="seller">seller</option>
        </select>
        {msg && <div className="text-green-700">{msg}</div>}
        {error && <div className="text-red-600">{error}</div>}
        <button disabled={loading} className="w-full bg-blue-600 text-white rounded px-4 py-2">{loading ? 'Submitting...' : 'Change password'}</button>
      </form>
    </div>
  );
}
