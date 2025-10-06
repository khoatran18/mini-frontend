
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductAPI, ProductInput } from '@/lib/endpoints';

const NewProductPage = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [inventory, setInventory] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newProduct: ProductInput = { 
      name, 
      price, 
      inventory,
    };

    try {
      await ProductAPI.create(newProduct);
      alert('Product created successfully!');
      router.push('/seller'); // Redirect to seller dashboard or product list
    } catch (error) {
      console.error('Failed to create product', error);
      alert('Failed to create product');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block font-medium">Product Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="price" className="block font-medium">Price</label>
          <input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="inventory" className="block font-medium">Inventory</label>
          <input
            id="inventory"
            type="number"
            value={inventory}
            onChange={(e) => setInventory(Number(e.target.value))}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Create Product
        </button>
      </form>
    </div>
  );
};

export default NewProductPage;
