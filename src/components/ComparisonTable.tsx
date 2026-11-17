// src/components/ComparisonTable.tsx - Multi-Store Price & Offer Comparison Engine UI
'use client';

import React from 'react';
import { 
  StoreListing, 
  BankOffer, 
  Coupon 
} from '@/types';
import { 
  ExternalLink, 
  ShieldCheck, 
  Truck, 
  Clock, 
  CreditCard, 
  Tag, 
  CheckCircle2, 
  AlertCircle,
  Trophy
} from 'lucide-react';
import { rankStoreListings } from '@/lib/engine/calculator';

interface ComparisonTableProps {
  listings: StoreListing[];
  productTitle: string;
}

export default function ComparisonTable({ listings, productTitle }: ComparisonTableProps) {
  // Sort listings by lowest eligible final price first
  const sortedListings = rankStoreListings(listings);
  const bestListingId = sortedListings[0]?.id;

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-[#2A352F] bg-[#191F1C]">
      
      {/* Table Header / Banner */}
      <div className="p-4 sm:p-5 border-b border-[#2A352F] bg-[#141816] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Multi-Store Price Comparison</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {listings.length} Stores Verified
            </span>
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Calculated with store base prices, bank card deductions, active coupon codes, and shipping fees.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800">
          <Trophy className="w-4 h-4 text-emerald-400" />
          <span>Lowest eligible price guaranteed on top row</span>
        </div>
      </div>

      {/* Responsive Table / Listing Cards */}
      <div className="divide-y divide-[#2A352F]">
        {sortedListings.map((listing, idx) => {
          const isWinner = listing.id === bestListingId;
          const savings = listing.original_price - listing.eligible_final_price;

          return (
            <div
              key={listing.id}
              className={`p-4 sm:p-5 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                isWinner ? 'bg-emerald-950/20 border-l-4 border-l-emerald-500' : 'hover:bg-[#222B26]/50'
              }`}
            >
              
              {/* Col 1: Store & Verification */}
              <div className="flex items-center gap-4 min-w-[220px]">
                <div className="w-12 h-12 rounded-xl bg-[#101312] border border-[#2A352F] p-2 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-gray-200 text-center leading-tight">
                    {listing.retailer.split(' ')[0]}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{listing.retailer}</span>
                    {isWinner && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500 text-black">
                        BEST DEAL
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{listing.source === 'verified_partner' ? 'Verified Feed' : 'Catalog Feed'}</span>
                    </span>
                    <span className="text-gray-600">•</span>
                    <span className="text-[11px] text-gray-400">{listing.last_verified}</span>
                  </div>
                </div>
              </div>

              {/* Col 2: Delivery & Stock */}
              <div className="flex items-center gap-6 text-xs text-gray-300">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Truck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Delivery</span>
                  </div>
                  <div className="font-medium text-white">
                    {listing.delivery_fee === 0 ? 'FREE Shipping' : `₹${listing.delivery_fee}`}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>ETA</span>
                  </div>
                  <div className="font-medium text-white">
                    {listing.estimated_delivery}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-gray-400">Stock</div>
                  <div className="flex items-center gap-1 font-medium">
                    {listing.in_stock ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> In Stock
                      </span>
                    ) : (
                      <span className="text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Out of Stock
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Col 3: Applied Offers & Coupons */}
              <div className="space-y-1.5 max-w-sm text-xs">
                {listing.bank_offer && (
                  <div className="flex items-center gap-1.5 text-emerald-300 bg-emerald-950/60 border border-emerald-900/60 px-2 py-1 rounded-md">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span className="truncate">{listing.bank_offer.terms}</span>
                  </div>
                )}
                {listing.coupon && (
                  <div className="flex items-center gap-1.5 text-amber-300 bg-amber-950/60 border border-amber-900/60 px-2 py-1 rounded-md">
                    <Tag className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span>Code <strong>{listing.coupon.code}</strong> (-₹{listing.coupon.discount_value})</span>
                  </div>
                )}
                {!listing.bank_offer && !listing.coupon && (
                  <span className="text-gray-500 italic text-[11px]">Standard retailer pricing</span>
                )}
              </div>

              {/* Col 4: Price & Buy CTA */}
              <div className="flex items-center justify-between lg:justify-end gap-6 min-w-[200px]">
                <div className="text-right">
                  <div className="text-[10px] uppercase text-gray-400 font-medium">Final Purchase Price</div>
                  <div className="flex items-baseline gap-2 justify-end">
                    <span className={`text-xl font-black ${isWinner ? 'text-emerald-400' : 'text-white'}`}>
                      ₹{listing.eligible_final_price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-gray-500 line-through">
                      ₹{listing.original_price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-500 font-medium">
                    Save ₹{savings.toLocaleString('en-IN')} ({listing.discount_pct}% off)
                  </div>
                </div>

                <a
                  href={listing.product_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md ${
                    isWinner 
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20' 
                      : 'bg-[#222B26] hover:bg-[#2A352F] text-white border border-[#2A352F]'
                  }`}
                >
                  <span>Go to Store</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
