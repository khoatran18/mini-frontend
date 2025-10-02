"use client";
import { useState } from 'react';
import { BuyerAPI, Buyer } from '@/src/services/user';

export default function BuyerCreatePage() {
  const [buyer, setBuyer] = useState<Buyer>({ name: '', phone: '', address: '', date_of_birth: '', gender: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg(null); setError(null); setLoading(true);
    try {
      const res = await BuyerAPI.create({ buyer });
      setMsg(res.message);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || 'Create buyer failed');
    } finally { setLoading(false); }
  };

  const upd = (k: keyof Buyer, v: any) => setBuyer(prev => ({ ...prev, [k]: v }));

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold mb-4">Create Buyer</h1>
      <form onSubmit={onSubmit} className="grid grid-cols-2 gap-3">
        <input className="border rounded px-3 py-2 col-span-2" placeholder="Name" value={buyer.name||''} onChange={e=>upd('name', e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="Phone" value={buyer.phone||''} onChange={e=>upd('phone', e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="Gender" value={buyer.gender||''} onChange={e=>upd('gender', e.target.value)} />
        <input className="border rounded px-3 py-2 col-span-2" placeholder="Address" value={buyer.address||''} onChange={e=>upd('address', e.target.value)} />
        <input className="border rounded px-3 py-2 col-span-2" placeholder="Date of birth" value={buyer.date_of_birth||''} onChange={e=>upd('date_of_birth', e.target.value)} />
        {msg && <div className="text-green-700 col-span-2">{msg}</div>}
        {error && <div className="text-red-600 col-span-2">{error}</div>}
        <button disabled={loading} className="bg-blue-600 text-white rounded px-4 py-2 col-span-2">{loading?'Submitting...':'Create'}</button>
      </form>
    </div>
  );
}
