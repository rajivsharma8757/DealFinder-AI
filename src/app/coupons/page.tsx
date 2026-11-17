// src/app/coupons/page.tsx - Verified Promotional Coupons & Voucher Codes
'use client';

import React, { useState } from 'react';
import { Tag, ShieldCheck, Sparkles, Filter } from 'lucide-react';
import { COUPONS } from '@/lib/data/catalog';
import CouponCard from '@/components/CouponCard';

export default function CouponsPage() {
  const [selectedStore, setSelectedStore] = useState<string>('All');

  const stores = ['All', 'Croma', 'Myntra', 'AJIO', 'Flipkart', 'Reliance Digital'];

  const filteredCoupons = COUPONS.filter((coupon) => {
    if (selectedStore !== 'All' && coupon.retailer !== selectedStore) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-950/40 via-[#191F1C] to-[#191F1C] border border-amber-500/30 space-y-3 shadow-2xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold">
          <Tag className="w-3.5 h-3.5" />
          <span>Promo Code Engine</span>
        </div>
        <h1 className="text-3xl font-black text-white">Verified Coupons & Promo Codes</h1>
        <p className="text-xs sm:text-sm text-gray-400 max-w-xl">
          Tested and verified coupon codes for instant checkout discounts across top Indian fashion, electronics, and lifestyle platforms.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {stores.map((s) => (
          <button
            key={s}
            onClick={() => setSelectedStore(s)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedStore === s
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-[#191F1C] text-gray-300 hover:text-white border border-[#2A352F]'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCoupons.map((coupon) => (
          <CouponCard key={coupon.id} coupon={coupon} />
        ))}
      </div>

    </div>
  );
}
