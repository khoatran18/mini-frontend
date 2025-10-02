"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { SellerAPI, Seller } from '@/src/services/user';

export default function SellerDetailPage() {
  const params = useParams();
  const id = Number(params?.id);
  const [seller, setSeller] = useState<Seller | null>(null);
  const [userId, setUserId] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const load = async () => {
    if (!id) return;
    setLoading(true); setError(null);
    try {
      const res = await SellerAPI.getById(id);
      setSeller(res.seller || null);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || 'Failed to load seller');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [id]);

  const upd = (k: keyof Seller, v: any) => setSeller(prev => (prev ? { ...prev, [k]: v } : prev));

  const save = async () => {
    if (!seller) return;
    setLoading(true); setError(null); setMsg(null);
    try {
      const res = await SellerAPI.updateById(id, { seller, user_id: userId });
      setMsg(res.message);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || 'Update failed');
    } finally { setLoading(false); }
  };

  const del = async () => {
    setLoading(true); setError(null); setMsg(null);
    try {
      const res = await SellerAPI.deleteById(id);
      setMsg(res.message);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || 'Delete failed');
    } finally { setLoading(false); }
  };

  if (!id) return <div>Invalid id.</div>;

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold mb-4">Seller Detail</h1>
      {loading && <div>Loading...</div>}
      {msg && <div className="text-green-700">{msg}</div>}
      {error && <div className="text-red-600">{error}</div>}
      {seller && (
        <div className="grid grid-cols-2 gap-3">
          <input className="border rounded px-3 py-2 col-span-2" type="number" placeholder="User ID for update" value={userId||''} onChange={e=>setUserId(Number(e.target.value)||0)} />
          <input className="border rounded px-3 py-2 col-span-2" placeholder="Name" value={seller.name||''} onChange={e=>upd('name', e.target.value)} />
          <input className="border rounded px-3 py-2" placeholder="Phone" value={seller.phone||''} onChange={e=>upd('phone', e.target.value)} />
          <input className="border rounded px-3 py-2" placeholder="Tax Code" value={seller.tax_code||''} onChange={e=>upd('tax_code', e.target.value)} />
          <input className="border rounded px-3 py-2 col-span-2" placeholder="Address" value={seller.address||''} onChange={e=>upd('address', e.target.value)} />
          <input className="border rounded px-3 py-2 col-span-2" placeholder="Date of birth" value={seller.date_of_birth||''} onChange={e=>upd('date_of_birth', e.target.value)} />
          <input className="border rounded px-3 py-2 col-span-2" placeholder="Bank Account" value={seller.bank_account||''} onChange={e=>upd('bank_account', e.target.value)} />
          <textarea className="border rounded px-3 py-2 col-span-2" placeholder="Description" value={seller.description||''} onChange={e=>upd('description', e.target.value)} />
          <div className="col-span-2 flex gap-2">
            <button onClick={save} className="bg-blue-600 text-white rounded px-4 py-2">Save</button>
            <button onClick={del} className="bg-red-600 text-white rounded px-4 py-2">Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}
