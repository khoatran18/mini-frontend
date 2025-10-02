'use client';

import { useQuery } from '@tanstack/react-query';
import { UserAPI } from '@/src/lib/endpoints';
import withAuth from '@/src/lib/with-auth';
import { AuthComponentProps } from '@/src/lib/with-auth';

interface SellerProfilePageProps extends AuthComponentProps {
  params: { id: string };
}

const SellerProfilePage = ({ params }: SellerProfilePageProps) => {
  const sellerId = Number(params.id);

  const { data: seller, isLoading, error } = useQuery({
    queryKey: ['seller', sellerId],
    queryFn: () => UserAPI.getSeller(sellerId),
    enabled: !!sellerId,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading profile</div>;
  if (!seller) return <div>No profile found.</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold">Seller Profile</h1>
      <p>ID: {seller.id}</p>
      <p>Name: {seller.name}</p>
      <p>Email: {seller.email}</p>
    </div>
  );
};

export default withAuth(SellerProfilePage, ['seller_admin', 'seller_employee']);
