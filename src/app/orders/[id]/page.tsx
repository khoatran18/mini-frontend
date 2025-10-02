"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { OrderAPI, Order } from '@/src/lib/endpoints';

export default function OrderDetailPage() {
  const params = useParams();
  const id = Number(params?.id);
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = async () => {
    if (!id) return;
    setLoading(true); setError(null);
    try {
      const res = await OrderAPI.getById(id);
      setOrder(res.order);
      setStatus(res.order?.status || '');
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const updateStatus = async () => {
    if (!order) return;
    setError(null); setMessage(null); setLoading(true);
    try {
      const res = await OrderAPI.update(id, { order: { ...order, status } });
      setMessage(res.message);
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || 'Update failed');
    } finally { setLoading(false); }
  };

  const cancelOrder = async () => {
    setError(null); setMessage(null); setLoading(true);
    try {
      const res = await OrderAPI.cancel(id);
      setMessage(res.message);
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || 'Cancel failed');
    } finally { setLoading(false); }
  };

  if (!id) return <div>Invalid id.</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Order Detail</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {message && <div className="text-green-700 mb-2">{message}</div>}
      {order && (
        <div className="space-y-3">
          <div className="border rounded p-3">
            <div>ID: {order.id}</div>
            <div>Buyer ID: {order.buyer_id}</div>
            <div>Status: {order.status}</div>
            <div>Total: {order.total_price}</div>
          </div>
          <div className="border rounded p-3">
            <div className="font-medium mb-2">Update status</div>
            <input value={status} onChange={e=>setStatus(e.target.value)} className="border rounded px-2 py-1 mr-2" />
            <button onClick={updateStatus} className="px-3 py-1 rounded bg-blue-600 text-white">Update</button>
            <button onClick={cancelOrder} className="px-3 py-1 rounded bg-red-600 text-white ml-2">Cancel order</button>
          </div>
          <div className="border rounded p-3">
            <div className="font-medium mb-2">Items</div>
            <ul className="list-disc ml-5">
              {order.order_items?.map((it, idx) => (
                <li key={idx}>#{it.product_id} x{it.quantity} {it.name ? `• ${it.name}` : ''} {it.price ? `• $${it.price}` : ''}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
