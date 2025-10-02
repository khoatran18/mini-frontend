'use client';

import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/src/lib/query-provider";
import { useAuthStore } from '@/src/lib/auth-store';
import { useEffect } from 'react';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <QueryProvider>
          <Navbar />
          <main className="flex-grow container mx-auto p-4">
            {children}
          </main>
          <Footer />
        </QueryGiver>
      </body>
    </html>
  );
}
