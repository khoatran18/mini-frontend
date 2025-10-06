'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-store';
import BuyerDashboard from '@/components/BuyerDashboard';
import { SellerDashboard } from '@/components/SellerDashboard';

export default function HomePage() {
  const { role, userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (role === 'buyer') {
      router.push('/buyer/dashboard'); // Replace with your buyer dashboard route
    } else if (role && ['seller_admin', 'seller_employee'].includes(role)) {
      router.push('/seller/dashboard'); // Replace with your seller dashboard route
    }
  }, [role, router]);

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold">Welcome to the Mini Marketplace</h1>
      <p className="mt-4">Please log in to see your dashboard.</p>
    </div>
  );
}
