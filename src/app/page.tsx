'use client';

import { useAuth } from '@/src/lib/auth-store';
import BuyerDashboard from '@/src/components/BuyerDashboard';
import SellerDashboard from '@/src/components/SellerDashboard';

const Home = () => {
  const { role } = useAuth();

  return (
    <div>
      {role === 'buyer' ? (
        <BuyerDashboard />
      ) : role?.startsWith('seller') ? (
        <SellerDashboard />
      ) : (
        <div className="text-center">
          <h1 className="text-4xl font-bold">Welcome to the Mini Marketplace</h1>
          <p className="mt-4">Please log in or register to continue.</p>
        </div>
      )}
    </div>
  );
};

export default Home;
