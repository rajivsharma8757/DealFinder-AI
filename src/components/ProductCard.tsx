// src/components/ProductCard.tsx - Premium Card with Store Comparison Snippet
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Heart, Layers, ArrowUpRight, ShieldCheck, Tag, CreditCard, ExternalLink } from 'lucide-react';
import { Product } from '@/types';
import { useApp } from '@/context/AppContext';
import { getBestEligiblePrice } from '@/lib/engine/calculator';

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

export default function ProductCard({ product, featured }: ProductCardProps) {
  const { isInWishlist, toggleWishlist, addToComparison, isInComparison, removeFromComparison } = useApp();
  const bestListing = getBestEligiblePrice(product);
  const inWish = isInWishlist(product.id);
  const inComp = isInComparison(product.id);

  const totalStores = (product.store_listings || product.rows || []).length;
  const savings = bestListing.original_price - bestListing.eligible_final_price;

  return (
    <div className={`group relative rounded-2xl bg-[#191F1C] border border-[#2A352F] hover:border-emerald-500/50 transition-all duration-300 flex flex-col overflow-hidden hover:shadow-2xl hover:shadow-emerald-950/20 ${
      featured ? 'md:col-span-2 md:flex-row' : ''
    }`}>
      
      {/* Product Image Section */}
      <div className={`relative bg-[#101312] p-4 flex items-center justify-center overflow-hidden ${
        featured ? 'md:w-1/2 h-64 md:h-auto' : 'h-52 w-full'
      }`}>
        <img
          src={product.image_url || product.image || ''}
          alt={product.title}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Discount Badge */}
        {bestListing.discount_pct > 0 && (
          <div className="absolute top-3 left-3 px-2 py-0.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold badge-glow">
            {bestListing.discount_pct}% OFF
          </div>
        )}

        {/* Quick Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product.id);
            }}
            className={`p-2 rounded-xl backdrop-blur-md transition-all ${
              inWish 
                ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30' 
                : 'bg-[#191F1C]/80 border border-[#2A352F] text-gray-300 hover:text-white hover:border-pink-500/40'
            }`}
            title={inWish ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-4 h-4 ${inWish ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              if (inComp) {
                removeFromComparison(product.id);
              } else {
                addToComparison(product.id);
              }
            }}
            className={`p-2 rounded-xl backdrop-blur-md transition-all ${
              inComp 
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30 font-bold' 
                : 'bg-[#191F1C]/80 border border-[#2A352F] text-gray-300 hover:text-white hover:border-emerald-500/40'
            }`}
            title={inComp ? 'Remove from Comparison' : 'Add to Compare'}
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>

        {/* Multi-Store Comparison Indicator Bar */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-gray-400 bg-[#191F1C]/90 backdrop-blur-sm px-2.5 py-1 rounded-md border border-[#2A352F]">
          <span className="text-gray-300">Compare {totalStores} Stores</span>
          <span className="text-emerald-400 font-medium">Best on {bestListing.retailer}</span>
        </div>
      </div>

      {/* Product Content Section */}
      <div className={`p-5 flex flex-col flex-grow justify-between ${
        featured ? 'md:w-1/2' : ''
      }`}>
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
            <span className="font-semibold text-emerald-400 tracking-wider uppercase text-[10px]">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-medium text-xs">{product.overall_rating || product.rating || 4.5}</span>
              <span className="text-gray-500 text-[10px]">({(product.total_reviews || product.review_count || 100).toLocaleString()})</span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/products/${product.id}`} className="block group-hover:text-emerald-300 transition-colors">
            <h3 className="font-semibold text-white text-sm line-clamp-2 leading-snug">
              {product.title}
            </h3>
          </Link>

          {/* Offer Snippet (Bank or Coupon) */}
          {bestListing.bank_offer ? (
            <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-emerald-300/90 bg-emerald-950/40 border border-emerald-900/60 px-2 py-1 rounded-lg">
              <CreditCard className="w-3 h-3 text-emerald-400 flex-shrink-0" />
              <span className="truncate">{bestListing.bank_offer.terms}</span>
            </div>
          ) : bestListing.coupon ? (
            <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-amber-300/90 bg-amber-950/40 border border-amber-900/60 px-2 py-1 rounded-lg">
              <Tag className="w-3 h-3 text-amber-400 flex-shrink-0" />
              <span className="truncate">Use coupon: <strong>{bestListing.coupon.code}</strong></span>
            </div>
          ) : (
            <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-gray-400 px-2 py-1">
              <span>Free delivery available on select stores</span>
            </div>
          )}
        </div>

        {/* Pricing & CTA */}
        <div className="mt-4 pt-4 border-t border-[#2A352F]">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <div className="text-[10px] uppercase text-gray-400 font-medium">Eligible Best Price</div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-extrabold text-emerald-400">
                  ₹{bestListing.eligible_final_price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-gray-500 line-through">
                  ₹{bestListing.original_price.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-emerald-500 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800">
                Save ₹{savings.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/products/${product.id}`}
              className="px-3 py-2 rounded-xl bg-[#222B26] hover:bg-[#2A352F] text-xs font-semibold text-gray-200 hover:text-white transition-all text-center flex items-center justify-center gap-1 border border-[#2A352F]"
            >
              <span>Compare All</span>
              <Layers className="w-3.5 h-3.5 text-gray-400" />
            </Link>

            <a
              href={bestListing.product_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-xs font-bold text-black transition-all text-center flex items-center justify-center gap-1 shadow-lg shadow-emerald-500/20"
            >
              <span>Buy Best</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}
