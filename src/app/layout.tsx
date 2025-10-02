import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/src/lib/query-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mini Marketplace",
  description: "A mini marketplace application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <QueryProvider>
          <Navbar />
          <main className="flex-grow container mx-auto p-4">
            {children}
          </main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
