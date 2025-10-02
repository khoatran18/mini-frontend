"use client";
import { useState } from 'react';
import Link from 'next/link';
import { OrderAPI, Order } from '@/src/lib/endpoints';

export default function OrdersPage() {
  const [buyerId, setBuyerId] = useState<number>(0);
  const [status, setStatus] = useState<string>('pending');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async () => {
    if (!buyerId || !status) return;
    setLoading(true); setError(null);
    try {
      const res = await OrderAPI.listByBuyerAndStatus(buyerId, status);
      setOrders(res.orders || []);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || 'Failed to get orders');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Orders</h1>
      <div className="flex gap-2 mb-4 items-center">
        <label>Buyer ID</label>
        <input type="number" value={buyerId || ''} onChange={e=>setBuyerId(Number(e.target.value)||0)} className="border rounded px-2 py-1 w-28" />
        <label>Status</label>
        <input value={status} onChange={e=>setStatus(e.target.value)} className="border rounded px-2 py-1 w-40" />
        <button className="px-3 py-1 rounded bg-gray-200" onClick={search}>Search</button>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <ul className="space-y-2">
        {orders.map(o => (
          <li key={o.id} className="border rounded p-3 flex items-center justify-between">
            <div>
              <div>ID: {o.id} • Buyer: {o.buyer_id}</div>
              <div className="text-sm opacity-80">Status: {o.status} • Total: {o.total_price}</div>
            </div>
            {o.id !== undefined && <Link className="text-blue-600" href={`/orders/${o.id}`}>View</Link>}
          </li>
        ))}
      </ul>
    </div>
  );
}
