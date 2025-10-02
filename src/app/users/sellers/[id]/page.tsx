'use client';

import { useQuery } from '@tanstack/react-query';
import { SellerAPI } from '@/lib/endpoints';
import withAuth from '@/lib/with-auth';

interface SellerProfilePageProps {
  params: { id: string };
}

const SellerProfilePage = ({ params }: SellerProfilePageProps) => {
  const sellerId = Number(params.id);

  const { data: seller, isLoading, error } = useQuery({
    queryKey: ['seller', sellerId],
    queryFn: () => SellerAPI.get(sellerId),
    enabled: !!sellerId,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading profile</div>;
  if (!seller || !seller.seller) return <div>No profile found.</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold">Seller Profile</h1>
      <p>ID: {seller.seller.id}</p>
      <p>Name: {seller.seller.name}</p>
      <p>Phone: {seller.seller.phone}</p>
      <p>Address: {seller.seller.address}</p>
      <p>Description: {seller.seller.description}</p>
      <p>Bank Account: {seller.seller.bank_account}</p>
      <p>Tax Code: {seller.seller.tax_code}</p>
    </div>
  );
};

export default withAuth(SellerProfilePage, ['seller_admin', 'seller_employee']);
