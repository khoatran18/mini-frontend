'use client';

import withAuth from '@/src/lib/with-auth';
import { useQuery } from '@tanstack/react-query';
import { ProductAPI } from '@/src/lib/endpoints';
import Link from 'next/link';
import { useAuth } from '@/src/lib/auth-store';

const SellerProductsPage = () => {
  const { role } = useAuth();
  // A real app would get the seller ID from the user's session/profile
  const sellerId = 1; 

  const { data, error, isLoading } = useQuery({
    queryKey: ['sellerProducts', sellerId],
    queryFn: () => ProductAPI.bySeller(sellerId),
    enabled: !!sellerId,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Products</h1>
        <Link href="/products/new" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add New Product
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.products.map((product) => (
          <div key={product.id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p>Price: ${product.price}</p>
            <p>Stock: {product.inventory}</p>
            <Link href={`/products/${product.id}/edit`} className="text-blue-500 hover:underline mt-2 inline-block">
              Edit
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default withAuth(SellerProductsPage, ['seller_admin', 'seller_employee']);
