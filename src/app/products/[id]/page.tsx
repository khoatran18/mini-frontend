'use client';

import { useQuery } from '@tanstack/react-query';
import { ProductAPI } from '@/src/lib/endpoints';
import { useCart } from '@/src/lib/cart-store';
import { useAuth } from '@/src/lib/auth-store';

interface ProductPageProps {
  params: { id: string };
}

const ProductPage = ({ params }: ProductPageProps) => {
  const { id } = params;
  const { data: product, error, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => ProductAPI.get(Number(id)),
    enabled: !!id,
  });
  const { addToCart } = useCart();
  const { role } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <p className="text-xl text-gray-800 mb-2">Price: ${product.price}</p>
        <p className="text-lg text-gray-600 mb-4">In Stock: {product.inventory}</p>
        {role === 'buyer' && (
          <button 
            onClick={() => addToCart(product, 1)}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            disabled={product.inventory === 0}
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
