'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductAPI } from '@/src/lib/endpoints';
import withAuth from '@/src/lib/with-auth';
import { AuthComponentProps } from '@/src/lib/with-auth';

interface SellerProductsPageProps extends AuthComponentProps {
  params: { sellerId: string };
}

const SellerProductsPage = ({ params }: SellerProductsPageProps) => {
  const sellerId = Number(params.sellerId);
  const queryClient = useQueryClient();

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products', { sellerId }],
    queryFn: () => ProductAPI.getProductsBySeller(sellerId),
    enabled: !!sellerId,
  });

  const deleteMutation = useMutation({
    mutationFn: (productId: number) => ProductAPI.delete(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products?.map((product) => (
          <div key={product.id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p>Price: ${product.price}</p>
            <p>Inventory: {product.inventory}</p>
            <button
              onClick={() => deleteMutation.mutate(product.id)}
              className="text-red-500 hover:underline mt-2"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default withAuth(SellerProductsPage, ['seller_admin', 'seller_employee']);
