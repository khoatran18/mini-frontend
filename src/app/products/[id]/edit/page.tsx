'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductAPI, ProductInput } from '@/src/lib/endpoints';
import withAuth from '@/src/lib/with-auth';

const EditProductPage = () => {
  const [product, setProduct] = useState<Omit<ProductInput, 'sellerId'> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const id = Number(params.id);

  const { data: existingProduct, isLoading: isProductLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => ProductAPI.get(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (existingProduct) {
      setProduct(existingProduct);
    }
  }, [existingProduct]);

  const mutation = useMutation({
    mutationFn: (updatedProduct: Partial<ProductInput> & { id: number }) => ProductAPI.update(id, updatedProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      router.push(`/products/${id}`);
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (product) {
      setProduct({ ...product, [name]: name === 'price' || name === 'inventory' ? Number(value) : value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (product) {
      mutation.mutate({ ...product, id });
    }
  };

  if (isProductLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      {error && <p className="text-red-500">{error}</p>}
      {product && (
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
            {mutation.isPending ? 'Updating...' : 'Update Product'}
          </button>
        </form>
      )}
    </div>
  );
};

export default withAuth(EditProductPage, ['seller_admin', 'seller_employee']);
