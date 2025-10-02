'use client';

import withAuth from '@/src/lib/with-auth';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ProductAPI, UpdateProductInput, Product } from '@/src/lib/endpoints';

const EditProductPage = ({ params }: { params: { id: string } }) => {
  const productId = Number(params.id);
  const router = useRouter();
  const [product, setProduct] = useState<Partial<Product>>({});
  const [error, setError] = useState('');
  const sellerId = 1; // From user session

  const { data, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => ProductAPI.getById(productId),
    enabled: !!productId,
    onSuccess: (data) => {
      setProduct(data.product);
    },
  });

  const mutation = useMutation({
    mutationFn: (updatedProduct: UpdateProductInput) => ProductAPI.update(productId, updatedProduct),
    onSuccess: () => {
      router.push(`/products/seller/${sellerId}`);
    },
    onError: (err) => {
      setError('Failed to update product. Please try again.');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: name === 'price' || name === 'inventory' ? Number(value) : value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (product) {
      mutation.mutate({ product: product as Product, user_id: sellerId });
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label>Product Name</label>
          <input
            type="text"
            name="name"
            value={product.name || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>
        <div className="mb-4">
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={product.price || 0}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>
        <div className="mb-4">
          <label>Inventory</label>
          <input
            type="number"
            name="inventory"
            value={product.inventory || 0}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={mutation.isLoading}>
          {mutation.isLoading ? 'Updating...' : 'Update Product'}
        </button>
      </form>
    </div>
  );
};

export default withAuth(EditProductPage, ['seller_admin', 'seller_employee']);
