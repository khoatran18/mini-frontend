'use client';

import Link from 'next/link';

const BuyerDashboard = () => {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold">Buyer Dashboard</h1>
      <p className="mt-4">Welcome to your dashboard. Here you can view products and manage your cart.</p>
      <div className="mt-8">
        <Link href="/products" className="bg-blue-500 text-white px-6 py-3 rounded mr-4">
          Browse Products
        </Link>
        <Link href="/cart" className="bg-green-500 text-white px-6 py-3 rounded">
          View Cart
        </Link>
      </div>
    </div>
  );
};

export default BuyerDashboard;
