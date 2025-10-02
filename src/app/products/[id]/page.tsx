'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Product, ProductAPI } from '@/lib/endpoints';
import { useCart } from '@/lib/cart-store';

const ProductDetailPage = () => {
  const params = useParams();
  const productId = Number(params.id);
  const [product, setProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    if (productId) {
      ProductAPI.get(productId)
        .then(setProduct)
        .catch(console.error);
    }
  }, [productId]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-4">Price: ${product.price}</p>
          <p className="text-gray-600 mb-4">Inventory: {product.inventory}</p>
          <button 
            onClick={() => addToCart(product)}
            className="bg-blue-500 text-white px-6 py-2 rounded-md"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
