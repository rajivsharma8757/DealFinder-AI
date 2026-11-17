// src/components/CouponCard.tsx - Verified Promotional Coupons with One-Click Copy
'use client';

import React, { useState } from 'react';
import { Tag, Copy, Check, Calendar, ShieldCheck } from 'lucide-react';
import { Coupon } from '@/types';

interface CouponCardProps {
  coupon: Coupon;
}

export default function CouponCard({ coupon }: CouponCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl bg-[#191F1C] border border-[#2A352F] hover:border-amber-500/40 p-5 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-amber-950/20">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs px-2.5 py-1 rounded-full bg-[#222B26] border border-[#2A352F] text-gray-300 font-medium">
            {coupon.retailer}
          </span>
          {coupon.verified && (
            <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3 h-3" />
              Verified Working
            </span>
          )}
        </div>

        {/* Promo Code Box */}
        <div className="my-3 p-3 rounded-xl bg-[#101312] border border-dashed border-[#3B4B42] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-amber-400" />
            <span className="font-mono font-bold text-white text-base tracking-wider">{coupon.code}</span>
          </div>
          <button
            onClick={handleCopy}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              copied
                ? 'bg-emerald-500 text-black'
                : 'bg-[#222B26] hover:bg-[#2A352F] text-gray-200 border border-[#2A352F]'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* Terms */}
        <p className="text-xs text-gray-300 leading-relaxed mb-3">
          {coupon.terms}
        </p>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-[#2A352F] flex items-center justify-between text-[11px] text-gray-500">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3 text-gray-400" />
          Expires: {coupon.expiry}
        </span>
        <span className="text-gray-400">
          Min cart: ₹{coupon.min_purchase.toLocaleString('en-IN')}
        </span>
      </div>
    </div>
  );
}
