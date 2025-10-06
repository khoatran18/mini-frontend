
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-store';
import { Product, ProductAPI } from '@/lib/endpoints';
import Link from 'next/link';

const SellerPage = () => {
  const { role } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Redirect if not a seller
    if (role && role !== 'seller') {
      router.push('/');
    }

    const fetchProducts = async () => {
      if (role === 'seller') {
        try {
          const sellerProducts = await ProductAPI.getMyProducts();
          setProducts(sellerProducts);
        } catch (error) {
          console.error("Failed to fetch seller products", error);
        }
      }
    };

    fetchProducts();
  }, [role, router]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Seller Dashboard</h1>
      
      {role !== 'seller' ? (
        <p>You do not have access to this page.</p>
      ) : (
        <div>
          <div className="mb-4">
            <Link href="/products/new" className="bg-blue-500 text-white px-4 py-2 rounded">
              + Add New Product
            </Link>
          </div>
          <h2 className="text-xl font-semibold mb-2">Your Products</h2>
          {products.length === 0 ? (
            <p>You have not added any products yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(product => (
                <div key={product.id} className="border p-4 rounded-lg">
                  <h3 className="font-bold">{product.name}</h3>
                  <p>Price: ${product.price.toFixed(2)}</p>
                  <p>Inventory: {product.inventory}</p>
                  {/* Add edit/delete buttons here if needed */}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SellerPage;
