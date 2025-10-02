"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProductAPI, Product, UpdateProductInput } from '@/src/services/product';

export default function ProductEditPage() {
  const params = useParams();
  const id = Number(params?.id);
  const [product, setProduct] = useState<Product | null>(null);
  const [userId, setUserId] = useState<number>(0);
  const [attributes, setAttributes] = useState<string>('{}');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true); setError(null);
      try {
        const res = await ProductAPI.getById(id);
        setProduct(res.product);
        setAttributes(JSON.stringify(res.product?.attributes || {}, null, 2));
      } catch (err: any) {
        setError(err?.response?.data?.error || err?.message || 'Failed to load product');
      } finally { setLoading(false); }
    };
    load();
  }, [id]);

  const upd = (k: keyof Product, v: any) => setProduct(prev => (prev ? { ...prev, [k]: v } : prev));

  const save = async () => {
    if (!product) return;
    setLoading(true); setMsg(null); setError(null);
    try {
      let attrs: Record<string, any> | undefined = undefined;
      if (attributes.trim()) {
        try { attrs = JSON.parse(attributes); } catch { throw new Error('Attributes must be valid JSON'); }
      }
      const payload: UpdateProductInput = { product: { ...product, attributes: attrs }, user_id: userId || undefined };
      const res = await ProductAPI.update(id, payload);
      setMsg(res.message);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || 'Update failed');
    } finally { setLoading(false); }
  };

  if (!id) return <div>Invalid id.</div>;

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold mb-4">Edit Product</h1>
      {loading && <div>Loading...</div>}
      {msg && <div className="text-green-700">{msg}</div>}
      {error && <div className="text-red-600">{error}</div>}
      {product && (
        <div className="grid grid-cols-2 gap-3">
          <input className="border rounded px-3 py-2 col-span-2" placeholder="Name" value={product.name||''} onChange={e=>upd('name', e.target.value)} />
          <input className="border rounded px-3 py-2" type="number" placeholder="Price" value={product.price||0} onChange={e=>upd('price', Number(e.target.value)||0)} />
          <input className="border rounded px-3 py-2" type="number" placeholder="Inventory" value={product.inventory||0} onChange={e=>upd('inventory', Number(e.target.value)||0)} />
          <textarea className="border rounded px-3 py-2 col-span-2" rows={5} placeholder="Attributes (JSON)" value={attributes} onChange={e=>setAttributes(e.target.value)} />
          <input className="border rounded px-3 py-2 col-span-2" type="number" placeholder="User ID (optional)" value={userId||''} onChange={e=>setUserId(Number(e.target.value)||0)} />
          <div className="col-span-2 flex gap-2">
            <button onClick={save} className="bg-blue-600 text-white rounded px-4 py-2">Save</button>
          </div>
        </div>
      )}
    </div>
  );
}
