'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Order, OrderAPI } from '@/lib/endpoints';

const OrderDetailPage = () => {
  const params = useParams();
  const orderId = Number(params.id);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (orderId) {
      OrderAPI.get(orderId)
        .then(setOrder)
        .catch(console.error);
    }
  }, [orderId]);

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order Details</h1>
      <div className="border rounded-lg p-6 shadow-sm mb-8">
        <p className="text-lg font-semibold">Order ID: {order.id}</p>
        <p className="text-gray-600">Status: {order.status}</p>
        <p className="text-gray-600">Total: ${order.total_price.toFixed(2)}</p>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Items</h2>
        {order.items.map(item => (
          <div key={item.id} className="flex justify-between items-center border-b py-4">
            <div>
              <h3 className="text-xl font-semibold">{item.productName}</h3>
              <p className="text-gray-600">Quantity: {item.quantity}</p>
              <p className="text-gray-600">Price: ${item.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderDetailPage;
