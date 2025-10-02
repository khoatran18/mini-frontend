'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/auth-store';

export default function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  allowedRoles: string[]
) {
  const Wrapper = (props: P) => {
    const { isAuthenticated, role, checkAuth } = useAuth();
    const router = useRouter();

    useEffect(() => {
      checkAuth();
      if (!isAuthenticated) {
        router.push('/auth/login');
      } else if (role && !allowedRoles.includes(role)) {
        router.push('/unauthorized'); // Or a generic dashboard page
      }
    }, [isAuthenticated, role, router, checkAuth]);

    if (!isAuthenticated || (role && !allowedRoles.includes(role))) {
      return null; // Or a loading spinner
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
}
