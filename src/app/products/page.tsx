'use client';

import { useEffect, useState } from 'react';
import { Product, ProductAPI } from '@/lib/endpoints';
import Link from 'next/link';

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    ProductAPI.getAll()
      .then(data => setProducts(data.products))
      .catch(console.error);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="border rounded-lg p-4 shadow-sm">
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <p className="text-gray-600">Price: ${product.price}</p>
            <Link href={`/products/${product.id}`} className="text-blue-500 hover:underline mt-4 inline-block">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
