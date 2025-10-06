
"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-store";
import { useCart } from "@/lib/cart-store";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { role, logout } = useAuth();
  const { items } = useCart();
  const router = useRouter();

  const handleLogout = () => {
    logout(() => {
      router.push("/");
    });
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="font-bold text-xl">E-commerce</Link>
        <div>
          <Link href="/products" className="mr-4">Products</Link>
          {role === 'seller' && <Link href="/seller" className="mr-4">Seller</Link>}
          {role === 'buyer' && <Link href="/orders" className="mr-4">Orders</Link>}
          <Link href="/cart" className="mr-4">
            Cart ({items.reduce((acc, item) => acc + item.quantity, 0)})
          </Link>
          {role ? (
            <button onClick={handleLogout} className="hover:underline">Logout</button>
          ) : (
            <Link href="/auth/login" className="hover:underline">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
