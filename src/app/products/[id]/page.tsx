"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProductAPI, Product } from '@/src/services/product';

export default function ProductDetailPage() {
  const params = useParams();
  const id = Number(params?.id);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const run = async () => {
      setLoading(true); setError(null);
      try {
        const res = await ProductAPI.getById(id);
        setProduct(res.product);
      } catch (err: any) {
        setError(err?.response?.data?.error || err?.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  if (!id) return <div>Invalid id.</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Product Detail</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {product && (
        <div className="border rounded p-4">
          <div className="text-lg font-medium">{product.name}</div>
          <div className="opacity-80">Price: ${product.price}</div>
          <div className="opacity-80">Inventory: {product.inventory}</div>
          {product.attributes && (
            <pre className="mt-2 text-xs bg-black/5 p-2 rounded">{JSON.stringify(product.attributes, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
}
