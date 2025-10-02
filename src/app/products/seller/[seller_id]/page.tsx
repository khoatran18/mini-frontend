"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ProductAPI, Product } from '@/src/services/product';

export default function ProductsBySellerPage() {
  const params = useParams();
  const sellerId = Number(params?.seller_id);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sellerId) return;
    const load = async () => {
      setLoading(true); setError(null);
      try {
        const res = await ProductAPI.bySeller(sellerId);
        setProducts(res.products || []);
      } catch (err: any) {
        setError(err?.response?.data?.error || err?.message || 'Failed to load products');
      } finally { setLoading(false); }
    };
    load();
  }, [sellerId]);

  if (!sellerId) return <div>Invalid seller id.</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Products by Seller #{sellerId}</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <ul className="space-y-2">
        {products.map(p => (
          <li key={p.id} className="border rounded p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{p.name}</div>
              <div className="text-sm opacity-80">${p.price} • In stock: {p.inventory}</div>
            </div>
            {p.id !== undefined && <Link className="text-blue-600" href={`/products/${p.id}`}>View</Link>}
          </li>
        ))}
      </ul>
    </div>
  );
}
