
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-store';
import Link from 'next/link';

export default function HomePage() {
  const { role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Since we removed userId, we can't redirect to a specific user's page.
    // The user can navigate using the links provided on the page.
    if (role === 'buyer') {
      // Optional: redirect to a generic buyer dashboard if it exists
      // router.push('/buyer/dashboard');
    } else if (role === 'seller') {
      // Optional: redirect to a generic seller dashboard
      // router.push('/seller/dashboard');
    }
  }, [role, router]);

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to the E-commerce Platform</h1>
      <p className="text-lg mb-8">Your one-stop shop for everything.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 border rounded-lg">
          <h2 className="text-2xl font-bold mb-2">Products</h2>
          <p className="mb-4">Browse our wide selection of products.</p>
          <Link href="/products" className="text-blue-500 hover:underline">
            Go to Products
          </Link>
        </div>
        
        {!role && (
            <div className="p-6 border rounded-lg">
                <h2 className="text-2xl font-bold mb-2">Login</h2>
                <p className="mb-4">Access your account.</p>
                <Link href="/auth/login" className="text-blue-500 hover:underline">
                Go to Login
                </Link>
            </div>
        )}

        {role === 'buyer' && (
          <div className="p-6 border rounded-lg">
            <h2 className="text-2xl font-bold mb-2">My Orders</h2>
            <p className="mb-4">Check your order history.</p>
            <Link href="/orders" className="text-blue-500 hover:underline">
              View My Orders
            </Link>
          </div>
        )}

        {role === 'seller' && (
          <div className="p-6 border rounded-lg">
            <h2 className="text-2xl font-bold mb-2">Seller Dashboard</h2>
            <p className="mb-4">Manage your products and sales.</p>
            <Link href="/seller" className="text-blue-500 hover:underline">
              Go to Dashboard
            </Link>
          </div>
        )}

        <div className="p-6 border rounded-lg">
          <h2 className="text-2xl font-bold mb-2">Your Cart</h2>
          <p className="mb-4">View and manage items in your cart.</p>
          <Link href="/cart" className="text-blue-500 hover:underline">
            Go to Cart
          </Link>
        </div>

      </div>
    </div>
  );
}
