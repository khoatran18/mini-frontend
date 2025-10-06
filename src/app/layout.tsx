'use client';

import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import { Inter } from "next/font/google";
import "./globals.css";
import { useEffect } from 'react';

import QueryProvider from "@/src/lib/query-provider";
import { useAuth } from '@/src/lib/auth-store';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {const { checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <QueryProvider>
          <Navbar />
          <main className="flex-grow container mx-auto p-4">
            {children}
          </main>
          <Footer />{" "}
        </QueryProvider>
      </body>
    </html>
  );
}
