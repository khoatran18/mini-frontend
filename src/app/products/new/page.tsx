"use client";
import { useState } from 'react';
import { ProductAPI, CreateProductInput } from '@/src/services/product';

export default function ProductCreatePage() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [inventory, setInventory] = useState<number>(0);
  const [sellerId, setSellerId] = useState<number>(0);
  const [attributes, setAttributes] = useState<string>('{}');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg(null); setError(null); setLoading(true);
    try {
      let attrs: Record<string, any> | undefined = undefined;
      if (attributes.trim()) {
        try { attrs = JSON.parse(attributes); } catch { throw new Error('Attributes must be valid JSON'); }
      }
      const payload: CreateProductInput = { name, price, inventory, seller_id: sellerId, attributes: attrs };
      const res = await ProductAPI.create(payload);
      setMsg(res.message);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || 'Create product failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold mb-4">Create Product</h1>
      <form onSubmit={submit} className="grid grid-cols-2 gap-3">
        <input className="border rounded px-3 py-2 col-span-2" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="border rounded px-3 py-2" type="number" placeholder="Price" value={price||''} onChange={e=>setPrice(Number(e.target.value)||0)} />
        <input className="border rounded px-3 py-2" type="number" placeholder="Inventory" value={inventory||''} onChange={e=>setInventory(Number(e.target.value)||0)} />
        <input className="border rounded px-3 py-2 col-span-2" type="number" placeholder="Seller ID" value={sellerId||''} onChange={e=>setSellerId(Number(e.target.value)||0)} />
        <textarea className="border rounded px-3 py-2 col-span-2" rows={5} placeholder="Attributes (JSON)" value={attributes} onChange={e=>setAttributes(e.target.value)} />
        {msg && <div className="text-green-700 col-span-2">{msg}</div>}
        {error && <div className="text-red-600 col-span-2">{error}</div>}
        <button disabled={loading} className="bg-blue-600 text-white rounded px-4 py-2 col-span-2">{loading? 'Submitting...' : 'Create'}</button>
      </form>
    </div>
  );
}
