'use client';

import { useAuth } from '@/lib/auth-store';
import BuyerDashboard from '@/components/BuyerDashboard';
import { SellerDashboard } from '@/components/SellerDashboard';

export default function HomePage() {
  const { role, userId } = useAuth();

  if (role === 'buyer') {
    return <BuyerDashboard />;
  }

  if (role && ['seller_admin', 'seller_employee'].includes(role)) {
    return <SellerDashboard sellerId={userId!} />;
  }

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold">Welcome to the Mini Marketplace</h1>
      <p className="mt-4">Please log in to see your dashboard.</p>
    </div>
  );
}
