'use client';

import withAuth from '@/src/lib/with-auth';
import { useQuery } from '@tanstack/react-query';
import { ProductAPI } from '@/src/lib/endpoints';
import { useCart } from '@/src/lib/cart-store';

const ProductDetailsPage = ({ params }: { params: { id: string } }) => {
  const productId = Number(params.id);
  const { addToCart } = useCart();

  const { data, error, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => ProductAPI.getById(productId),
    enabled: !!productId,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  if (!data?.product) return <div>Product not found.</div>;

  const { product } = data;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <p className="text-xl mb-2">Price: ${product.price}</p>
      <p className="mb-4">In Stock: {product.inventory}</p>
      {/* Placeholder for future attributes */}
      {product.attributes && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Product Details</h2>
          <ul>
            {Object.entries(product.attributes).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {String(value)}
              </li>
            ))}
          </ul>
        </div>
      )}
      <button onClick={() => addToCart(product)} className="bg-blue-500 text-white px-4 py-2 rounded">
        Add to Cart
      </button>
    </div>
  );
};

export default withAuth(ProductDetailsPage, ['buyer']);
