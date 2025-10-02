'use client';

import { useQuery } from '@tanstack/react-query';
import { OrderAPI } from '@/src/lib/endpoints';
import withAuth from '@/src/lib/with-auth';
import { useAuth } from '@/src/lib/auth-store';
import Link from 'next/link';

const OrdersPage = () => {
  const { userId } = useAuth();
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['orders', { buyerId: userId }],
    queryFn: () => OrderAPI.getOrdersByBuyer(userId!),
    enabled: !!userId,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading orders</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      <div className="space-y-4">
        {orders?.map((order) => (
          <div key={order.id} className="border p-4 rounded-lg shadow-sm">
            <div className="flex justify-between">
              <div>
                <h2 className="text-xl font-semibold">Order #{order.id}</h2>
                <p className="text-gray-600">Status: {order.status}</p>
                <p className="text-gray-800 font-bold">Total: ${order.totalPrice}</p>
              </div>
              <Link href={`/orders/${order.id}`} className="self-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default withAuth(OrdersPage, ['buyer']);
