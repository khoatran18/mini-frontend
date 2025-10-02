'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-store';
import { useCart } from '@/lib/cart-store';

const Navbar = () => {
  const { role, userId, logout } = useAuth();
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
      <div className="flex items-center">
        <Link href="/products" className="mr-4">
          Products
        </Link>
        {role ? (
          <>
            {role === 'buyer' && (
              <>
                <Link href="/cart" className="mr-4">
                  Cart ({cartItemCount})
                </Link>
                <Link href="/orders" className="mr-4">
                  My Orders
                </Link>
              </>
            )}
            {role.startsWith('seller') && (
              <Link href="/seller" className="mr-4">
                Seller Dashboard
              </Link>
            )}
            <Link href="/profile" className="mr-4">
              Profile
            </Link>
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
