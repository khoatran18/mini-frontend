'use client';

import { useQuery } from '@tanstack/react-query';
import { UserAPI } from '@/src/lib/endpoints';
import withAuth from '@/src/lib/with-auth';
import { AuthComponentProps } from '@/src/lib/with-auth';

interface BuyerProfilePageProps extends AuthComponentProps {
  params: { id: string };
}

const BuyerProfilePage = ({ params }: BuyerProfilePageProps) => {
  const userId = Number(params.id);

  const { data: buyer, isLoading, error } = useQuery({
    queryKey: ['buyer', userId],
    queryFn: () => UserAPI.getBuyer(userId),
    enabled: !!userId,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading profile</div>;
  if (!buyer) return <div>No profile found.</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold">Buyer Profile</h1>
      <p>ID: {buyer.id}</p>
      <p>Name: {buyer.name}</p>
      <p>Email: {buyer.email}</p>
    </div>
  );
};

export default withAuth(BuyerProfilePage, ['buyer', 'seller_admin']);
