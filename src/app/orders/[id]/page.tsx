'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { OrderAPI } from '@/src/lib/endpoints';
import withAuth from '@/src/lib/with-auth';
import { useParams, useRouter } from 'next/navigation';

const OrderDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = Number(params.id);

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: () => OrderAPI.get(id),
    enabled: !!id,
  });

  const cancelMutation = useMutation({
    mutationFn: () => OrderAPI.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      router.push('/orders');
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading order</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
            <div>
                <h1 className="text-3xl font-bold">Order #{order.id}</h1>
                <p className="text-xl text-gray-600">Status: {order.status}</p>
            </div>
            <button 
                onClick={() => cancelMutation.mutate()} 
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-gray-400"
                disabled={cancelMutation.isPending || order.status !== 'pending'}
            >
                {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Order'}
            </button>
        </div>

        <div className="mb-6">
            <h2 className="text-2xl font-semibold border-b pb-2">Order Items</h2>
            <div className="space-y-4 mt-4">
                {order.items.map(item => (
                    <div key={item.productId} className="flex justify-between items-center p-2 rounded-lg">
                        <div>
                            <p className="font-semibold text-lg">{item.productName}</p>
                            <p className="text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <p className="text-gray-800 font-semibold">${item.price}</p>
                    </div>
                ))}
            </div>
        </div>

        <div className="text-right">
            <p className="text-2xl font-bold">Total Price: ${order.totalPrice}</p>
        </div>
      </div>
    </div>
  );
};

export default withAuth(OrderDetailPage, ['buyer']);
