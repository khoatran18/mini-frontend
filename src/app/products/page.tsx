'use client';

import { useQuery } from '@tanstack/react-query';
import { ProductAPI } from '@/src/lib/endpoints';
import Link from 'next/link';
import { useCart } from '@/src/lib/cart-store';
import { useAuth } from '@/src/lib/auth-store';

const ProductsPage = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: ProductAPI.getAll,
  });
  const { addToCart } = useCart();
  const { role } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data?.products.map((product) => (
          <div key={product.id} className="border p-4 rounded-lg shadow">
            <Link href={`/products/${product.id}`}>
              <h2 className="text-xl font-semibold text-blue-600 hover:underline">{product.name}</h2>
            </Link>
            <p className="text-gray-700 mt-2">Price: ${product.price}</p>
            <p className="text-gray-600">Stock: {product.inventory}</p>
            {role === 'buyer' && (
              <button 
                onClick={() => addToCart(product, 1)}
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
                disabled={product.inventory === 0}
              >
                Add to Cart
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
