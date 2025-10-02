"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Tokens } from '@/src/services/auth';

export default function NavBar() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAuthed(!!localStorage.getItem('access_token'));
    }
  }, []);

  const logout = () => {
    Tokens.clear();
    setAuthed(false);
    if (typeof window !== 'undefined') window.location.href = '/auth/login';
  };

  return (
    <nav className="w-full flex items-center justify-between py-3 border-b border-black/10 dark:border-white/10">
      <div className="flex gap-4">
        <Link href="/">Home</Link>
        <Link href="/products">Products</Link>
        <Link href="/orders">Orders</Link>
        <Link href="/buyers">Buyer</Link>
        <Link href="/sellers">Seller</Link>
      </div>
      <div className="flex gap-3">
        {authed ? (
          <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={logout}>Logout</button>
        ) : (
          <>
            <Link href="/auth/login">Login</Link>
            <Link href="/auth/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
