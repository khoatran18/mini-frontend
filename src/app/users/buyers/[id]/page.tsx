'use client';

import { useQuery } from '@tanstack/react-query';
import { BuyerAPI } from '@/lib/endpoints';
import withAuth from '@/lib/with-auth';

interface BuyerProfilePageProps {
  params: { id: string };
}

const BuyerProfilePage = ({ params }: BuyerProfilePageProps) => {
  const userId = Number(params.id);

  const { data: buyer, isLoading, error } = useQuery({
    queryKey: ['buyer', userId],
    queryFn: () => BuyerAPI.get(userId),
    enabled: !!userId,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading profile</div>;
  if (!buyer || !buyer.buyer) return <div>No profile found.</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold">Buyer Profile</h1>
      <p>ID: {buyer.buyer.user_id}</p>
      <p>Name: {buyer.buyer.name}</p>
      <p>Phone: {buyer.buyer.phone}</p>
      <p>Address: {buyer.buyer.address}</p>
      <p>Date of Birth: {buyer.buyer.date_of_birth}</p>
      <p>Gender: {buyer.buyer.gender}</p>
    </div>
  );
};

export default withAuth(BuyerProfilePage, ['buyer', 'seller_admin']);
