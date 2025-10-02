"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { BuyerAPI, Buyer } from '@/src/services/user';

export default function BuyerDetailPage() {
  const params = useParams();
  const id = Number(params?.id);
  const [buyer, setBuyer] = useState<Buyer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const load = async () => {
    if (!id) return;
    setLoading(true); setError(null);
    try {
      const res = await BuyerAPI.getByUserId(id);
      setBuyer(res.buyer || null);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || 'Failed to load buyer');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [id]);

  const upd = (k: keyof Buyer, v: any) => setBuyer(prev => (prev ? { ...prev, [k]: v } : prev));

  const save = async () => {
    if (!buyer) return;
    setLoading(true); setError(null); setMsg(null);
    try {
      const res = await BuyerAPI.updateByUserId(id, { buyer });
      setMsg(res.message);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || 'Update failed');
    } finally { setLoading(false); }
  };

  const del = async () => {
    setLoading(true); setError(null); setMsg(null);
    try {
      const res = await BuyerAPI.deleteByUserId(id);
      setMsg(res.message);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || 'Delete failed');
    } finally { setLoading(false); }
  };

  if (!id) return <div>Invalid id.</div>;

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold mb-4">Buyer Detail</h1>
      {loading && <div>Loading...</div>}
      {msg && <div className="text-green-700">{msg}</div>}
      {error && <div className="text-red-600">{error}</div>}
      {buyer && (
        <div className="grid grid-cols-2 gap-3">
          <input className="border rounded px-3 py-2 col-span-2" placeholder="Name" value={buyer.name||''} onChange={e=>upd('name', e.target.value)} />
          <input className="border rounded px-3 py-2" placeholder="Phone" value={buyer.phone||''} onChange={e=>upd('phone', e.target.value)} />
          <input className="border rounded px-3 py-2" placeholder="Gender" value={buyer.gender||''} onChange={e=>upd('gender', e.target.value)} />
          <input className="border rounded px-3 py-2 col-span-2" placeholder="Address" value={buyer.address||''} onChange={e=>upd('address', e.target.value)} />
          <input className="border rounded px-3 py-2 col-span-2" placeholder="Date of birth" value={buyer.date_of_birth||''} onChange={e=>upd('date_of_birth', e.target.value)} />
          <div className="col-span-2 flex gap-2">
            <button onClick={save} className="bg-blue-600 text-white rounded px-4 py-2">Save</button>
            <button onClick={del} className="bg-red-600 text-white rounded px-4 py-2">Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}
