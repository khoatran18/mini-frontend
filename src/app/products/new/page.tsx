'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductAPI, ProductInput } from '@/src/lib/endpoints';
import withAuth from '@/src/lib/with-auth';
import { useAuth } from '@/src/lib/auth-store';

const NewProductPage = () => {
  const [product, setProduct] = useState<Omit<ProductInput, 'sellerId'>>({ name: '', price: 0, inventory: 0, attributes: {} });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  const mutation = useMutation({
    mutationFn: (newProduct: ProductInput) => ProductAPI.create(newProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      router.push('/products');
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: name === 'price' || name === 'inventory' ? Number(value) : value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userId === null) {
      setError("User not authenticated");
      return;
    }
    mutation.mutate({ ...product, sellerId: userId });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Add New Product</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block font-medium">Product Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={product.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="price" className="block font-medium">Price</label>
          <input
            id="price"
            name="price"
            type="number"
            value={product.price}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="inventory" className="block font-medium">Inventory</label>
          <input
            id="inventory"
            name="inventory"
            type="number"
            value={product.inventory}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={mutation.isPending}>
          {mutation.isPending ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default withAuth(NewProductPage, ['seller_admin', 'seller_employee']);
