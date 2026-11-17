// src/app/wishlist/page.tsx - Saved Wishlist Items
'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Trash2, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getProductById } from '@/lib/data/catalog';
import ProductCard from '@/components/ProductCard';

export default function WishlistPage() {
  const { wishlist } = useApp();

  const products = wishlist
    .map(id => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="p-8 rounded-3xl bg-[#191F1C] border border-[#2A352F] space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 text-pink-400 text-xs font-semibold">
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>Saved For Later</span>
        </div>
        <h1 className="text-3xl font-black text-white">My Wishlist ({products.length})</h1>
        <p className="text-xs sm:text-sm text-gray-400 max-w-xl">
          Track real-time price fluctuations and retailer discounts for your saved products.
        </p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#191F1C] rounded-3xl border border-[#2A352F] space-y-4">
          <Heart className="w-12 h-12 text-gray-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">Your wishlist is empty</h3>
          <p className="text-xs text-gray-400">Save items while browsing to monitor their lowest eligible prices.</p>
          <Link
            href="/deals"
            className="inline-block px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-xs shadow-lg shadow-emerald-500/20"
          >
            Explore Today's Deals &rarr;
          </Link>
        </div>
      )}

    </div>
  );
}
