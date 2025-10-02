"use client";
import { useState } from 'react';
import { SellerAPI, Seller } from '@/src/services/user';

export default function SellerCreatePage() {
  const [userId, setUserId] = useState<number>(0);
  const [seller, setSeller] = useState<Seller>({ name: '', phone: '', address: '', date_of_birth: '', description: '', bank_account: '', tax_code: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg(null); setError(null); setLoading(true);
    try {
      const res = await SellerAPI.create({ seller, user_id: userId });
      setMsg(res.message);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || 'Create seller failed');
    } finally { setLoading(false); }
  };

  const upd = (k: keyof Seller, v: any) => setSeller(prev => ({ ...prev, [k]: v }));

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold mb-4">Create Seller</h1>
      <form onSubmit={onSubmit} className="grid grid-cols-2 gap-3">
        <input className="border rounded px-3 py-2 col-span-2" type="number" placeholder="User ID" value={userId||''} onChange={e=>setUserId(Number(e.target.value)||0)} />
        <input className="border rounded px-3 py-2 col-span-2" placeholder="Name" value={seller.name||''} onChange={e=>upd('name', e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="Phone" value={seller.phone||''} onChange={e=>upd('phone', e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="Tax Code" value={seller.tax_code||''} onChange={e=>upd('tax_code', e.target.value)} />
        <input className="border rounded px-3 py-2 col-span-2" placeholder="Address" value={seller.address||''} onChange={e=>upd('address', e.target.value)} />
        <input className="border rounded px-3 py-2 col-span-2" placeholder="Date of birth" value={seller.date_of_birth||''} onChange={e=>upd('date_of_birth', e.target.value)} />
        <input className="border rounded px-3 py-2 col-span-2" placeholder="Bank Account" value={seller.bank_account||''} onChange={e=>upd('bank_account', e.target.value)} />
        <textarea className="border rounded px-3 py-2 col-span-2" placeholder="Description" value={seller.description||''} onChange={e=>upd('description', e.target.value)} />
        {msg && <div className="text-green-700 col-span-2">{msg}</div>}
        {error && <div className="text-red-600 col-span-2">{error}</div>}
        <button disabled={loading} className="bg-blue-600 text-white rounded px-4 py-2 col-span-2">{loading?'Submitting...':'Create'}</button>
      </form>
    </div>
  );
}
