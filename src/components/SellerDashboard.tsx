'use client';

import Link from 'next/link';

const SellerDashboard = () => {
  // A real app would get the seller ID from the user's session/profile
  const sellerId = 1; 

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold">Seller Dashboard</h1>
      <p className="mt-4">Welcome to your dashboard. Here you can manage your products.</p>
      <div className="mt-8">
        <Link href={`/products/seller/${sellerId}`} className="bg-blue-500 text-white px-6 py-3 rounded mr-4">
          View My Products
        </Link>
        <Link href="/products/new" className="bg-green-500 text-white px-6 py-3 rounded">
          Add New Product
        </Link>
      </div>
    </div>
  );
};

export default SellerDashboard;
