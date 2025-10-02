'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProductAPI, Product, ProductInput } from '@/lib/endpoints';

const EditProductPage = () => {
  const router = useRouter();
  const params = useParams();
  const productId = Number(params.id);

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [inventory, setInventory] = useState(0);

  useEffect(() => {
    if (productId) {
      ProductAPI.get(productId)
        .then(product => {
          setName(product.name);
          setPrice(product.price);
          setInventory(product.inventory);
        })
        .catch(console.error);
    }
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productInput: Partial<ProductInput> = { name, price, inventory };

    try {
      await ProductAPI.update(productId, productInput);
      router.push('/seller');
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Product</h1>
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
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
