// src/app/layout.tsx - Root Layout for DealFinder AI
import './globals.css';
import type { Metadata } from 'next';
import { AppProvider } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchModal from '@/components/SearchModal';

export const metadata: Metadata = {
  title: 'DealFinder AI — Search Once. Compare Everywhere. Save More.',
  description: 'AI-Powered Multi-Platform Shopping Comparison and Deal Discovery System across Amazon India, Flipkart, Myntra, Meesho, Croma, Reliance Digital, AJIO, and 20+ verified stores.',
  keywords: [
    'price comparison',
    'deal finder',
    'AI shopping assistant',
    'Indian ecommerce comparison',
    'best discounts',
    'bank card offers',
    'coupons'
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#101312] text-[#F5F7F5] min-h-screen flex flex-col antialiased selection:bg-emerald-500 selection:text-black">
        <AppProvider>
          <Navbar />
          <SearchModal />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
