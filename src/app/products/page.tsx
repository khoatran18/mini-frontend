"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProductAPI, Product } from '@/src/services/product';

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const res = await ProductAPI.list(page, pageSize);
      setProducts(res.products || []);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page, pageSize]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Products</h1>
      <div className="flex gap-2 mb-4 items-center">
        <label>Page</label>
        <input type="number" min={1} value={page} onChange={e=>setPage(Number(e.target.value)||1)} className="border rounded px-2 py-1 w-20" />
        <label>Page size</label>
        <input type="number" min={1} value={pageSize} onChange={e=>setPageSize(Number(e.target.value)||10)} className="border rounded px-2 py-1 w-24" />
        <button className="px-3 py-1 rounded bg-gray-200" onClick={load}>Reload</button>
        <Link href="/products/new" className="ml-auto text-blue-600">Create Product</Link>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <ul className="space-y-2">
        {products.map(p => (
          <li key={p.id} className="border rounded p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{p.name}</div>
              <div className="text-sm opacity-80">${p.price} • In stock: {p.inventory}</div>
            </div>
            <div className="flex gap-3">
              {p.id !== undefined && <Link className="text-blue-600" href={`/products/${p.id}`}>View</Link>}
              {p.id !== undefined && <Link className="text-blue-600" href={`/products/${p.id}/edit`}>Edit</Link>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
