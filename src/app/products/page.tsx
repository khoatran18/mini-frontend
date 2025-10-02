'use client';

import withAuth from '@/src/lib/with-auth';
import { useQuery } from '@tanstack/react-query';
import { ProductAPI } from '@/src/lib/endpoints';
import Link from 'next/link';

const ProductsPage = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => ProductAPI.list(1, 100), // Fetch first 100 products
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.products.map((product) => (
          <div key={product.id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p>Price: ${product.price}</p>
            <Link href={`/products/${product.id}`} className="text-blue-500 hover:underline mt-2 inline-block">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default withAuth(ProductsPage, ['buyer']);
