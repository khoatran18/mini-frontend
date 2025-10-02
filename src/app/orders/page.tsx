'use client';

import { useEffect, useState } from 'react';
import { Order, OrderAPI } from '@/lib/endpoints';
import { useAuth } from '@/lib/auth-store';
import Link from 'next/link';

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { userId } = useAuth();

  useEffect(() => {
    if (userId) {
      OrderAPI.getOrdersByBuyer(userId)
        .then(setOrders)
        .catch(console.error);
    }
  }, [userId]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      {orders.length === 0 ? (
        <p>You have no orders.</p>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold">Order ID: {order.id}</p>
                  <p className="text-gray-600">Status: {order.status}</p>
                  <p className="text-gray-600">Total: ${order.total_price.toFixed(2)}</p>
                </div>
                <Link href={`/orders/${order.id}`} className="text-blue-500 hover:underline">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
