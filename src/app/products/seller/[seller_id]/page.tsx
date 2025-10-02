'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Product, ProductAPI } from '@/lib/endpoints';
import Link from 'next/link';

const ProductsBySellerPage = () => {
  const params = useParams();
  const sellerId = Number(params.seller_id);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (sellerId) {
      ProductAPI.getProductsBySeller(sellerId)
        .then(setProducts)
        .catch(console.error);
    }
  }, [sellerId]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products by Seller</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="border rounded-lg p-4 shadow-sm">
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <p className="text-gray-600">Price: ${product.price}</p>
            <p className="text-gray-600">Inventory: {product.inventory}</p>
            <div className="mt-4">
              <Link href={`/products/${product.id}`} className="text-blue-500 hover:underline">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsBySellerPage;
