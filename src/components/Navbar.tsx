'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/lib/auth-store';
import { useCart } from '@/src/lib/cart-store';
import { ThemeToggle } from '@/src/components/ThemeToggle';

const Navbar = () => {
  const { role, userId, logout } = useAuth();
  const { items } = useCart();
  const router = useRouter();

  const cartItemCount = items.reduce((count, item) => count + item.quantity, 0);

  const handleLogout = () => {
    logout(() => router.push('/'));
  };

  return (
    <nav className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
      <div>
        <Link href="/" className="text-xl font-bold">
          E-Commerce
        </Link>
      </div>
      <div className="flex items-center">
        <ThemeToggle />
        <Link href="/products" className="mr-4 px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
          Products
        </Link>
        {role ? (
          <>
            {role === 'buyer' && (
              <>
                <Link href="/cart" className="mr-4 px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
                  Cart ({cartItemCount})
                </Link>
                <Link href="/orders" className="mr-4 px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
                  My Orders
                </Link>
              </>
            )}
            {role.startsWith('seller') && (
              <Link href="/seller" className="mr-4 px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
                Seller Dashboard
              </Link>
            )}
            <Link href="/profile" className="mr-4 px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
              Profile
            </Link>
            <button onClick={handleLogout} className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/auth/login" className="mr-4 px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
              Login
            </Link>
            <Link href="/auth/register" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
