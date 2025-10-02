'use server';

import { ProductAPI } from '@/lib/endpoints';

export const getProductsBySeller = async (sellerId: number) => {
  try {
    const products = await ProductAPI.getProductsBySeller(sellerId);
    return products;
  } catch (error) {
    console.error('Error fetching products by seller:', error);
    return [];
  }
};
