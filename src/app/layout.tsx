'use client';

import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/src/lib/query-provider";
import { useAuth } from '@/src/lib/auth-store';
import { useEffect } from 'react';
import { ThemeProvider } from '@/src/components/ThemeProvider';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} flex flex-col min-h-screen bg-background text-foreground`}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main className="flex-grow container mx-auto p-4">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
