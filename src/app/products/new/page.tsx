'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductAPI, ProductInput } from '@/lib/endpoints';
import { useAuth } from '@/lib/auth-store';

const NewProductPage = () => {
  const router = useRouter();
  const { userId } = useAuth();
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [inventory, setInventory] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      alert('You must be logged in to create a product.');
      return;
    }

    const productInput: ProductInput = { 
      name, 
      price, 
      inventory, 
      seller_id: userId 
    };

    try {
      await ProductAPI.create(productInput);
      router.push('/seller');
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Add New Product</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Product Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block text-gray-700 font-semibold mb-2">Price</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="inventory" className="block text-gray-700 font-semibold mb-2">Inventory</label>
          <input
            type="number"
            id="inventory"
            value={inventory}
            onChange={(e) => setInventory(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-md">
          Create Product
        </button>
      </form>
    </div>
  );
};

export default NewProductPage;
