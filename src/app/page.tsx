'use client';

import { useAuth } from '@/src/lib/auth-store';
import BuyerDashboard from '@/src/components/BuyerDashboard';
import SellerDashboard from '@/src/components/SellerDashboard';

export default function HomePage() {
  const { role } = useAuth();

  if (role === 'buyer') {
    return <BuyerDashboard />;
  }

  if (role && ['seller_admin', 'seller_employee'].includes(role)) {
    return <SellerDashboard />;
  }

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold">Welcome to the Mini Marketplace</h1>
      <p className="mt-4">Please log in to see your dashboard.</p>
    </div>
  );
}
