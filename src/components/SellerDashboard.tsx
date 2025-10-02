'use client';

import React, { useEffect, useState } from 'react';
import { Product, ProductAPI } from '@/lib/endpoints';
import Link from 'next/link';

interface SellerDashboardProps {
  sellerId: number;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({ sellerId }) => {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    const sellerProducts = await ProductAPI.getProductsBySeller(sellerId);
    setProducts(sellerProducts);
  };

  useEffect(() => {
    fetchProducts();
  }, [sellerId]);

  const handleDelete = async (productId: number) => {
    try {
      await ProductAPI.delete(productId);
      fetchProducts(); // Refresh products after deletion
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Your Products</h2>
      <Link href="/products/new" className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 inline-block">
        Add New Product
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="border rounded-lg p-4 shadow-sm">
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <p className="text-gray-600">Price: ${product.price}</p>
            <p className="text-gray-600">Inventory: {product.inventory}</p>
            <div className="mt-4">
              <Link href={`/products/${product.id}/edit`} className="text-blue-500 hover:underline mr-4">
                Edit
              </Link>
              <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
