'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductAPI } from '@/src/lib/endpoints';
import withAuth from '@/src/lib/with-auth';
import { AuthComponentProps } from '@/src/lib/with-auth';
import Link from 'next/link';

interface SellerProductsPageProps extends AuthComponentProps {
  params: { seller_id: string };
}

const SellerProductsPage = ({ params }: SellerProductsPageProps) => {
  const sellerId = Number(params.seller_id);
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
       <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Products</h1>
        <Link href="/products/new" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add New Product
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products?.map((product) => (
          <div key={product.id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p>Price: ${product.price}</p>
            <p>Inventory: {product.inventory}</p>
             <Link href={`/products/${product.id}/edit`} className="text-blue-500 hover:underline mt-2 inline-block">
              Edit
            </Link>
            <button
              onClick={() => deleteMutation.mutate(product.id)}
              className="text-red-500 hover:underline mt-2 ml-4"
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
