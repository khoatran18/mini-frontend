'use client';

import { SellerDashboard } from '@/components/SellerDashboard';
import { useAuth } from '@/lib/auth-store';
import withAuth from '@/lib/with-auth';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const SellerPage = () => {
  const { role, userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (role && !role.startsWith('seller')) {
      router.push('/unauthorized');
    }
  }, [role, router]);

  if (!userId) return null; 

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Seller Dashboard</h1>
      <SellerDashboard sellerId={userId} />
    </div>
  );
};

export default withAuth(SellerPage, ['seller_admin', 'seller_employee']);
