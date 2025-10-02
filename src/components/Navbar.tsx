'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/lib/auth-store';
import { useCart } from '@/src/lib/cart-store';

const Navbar = () => {
  const { role, logout } = useAuth();
  const { items } = useCart();
  const router = useRouter();

  const cartItemCount = items.reduce((count, item) => count + item.quantity, 0);

  const handleLogout = () => {
    logout(() => router.push('/'));
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div>
        <Link href="/" className="text-xl font-bold">
          E-Commerce
        </Link>
      </div>
      <div>
        {role ? (
          <>
            {role === 'buyer' && (
              <Link href="/cart" className="mr-4">
                Cart ({cartItemCount})
              </Link>
            )}
            <Link href="/products" className="mr-4">
              Products
            </Link>
            {role.startsWith('seller') && (
              <Link href="/products/seller/1" className="mr-4">
                My Products
              </Link>
            )}
            <button onClick={handleLogout} className="hover:underline">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/auth/login" className="mr-4">
              Login
            </Link>
            <Link href="/auth/register">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
