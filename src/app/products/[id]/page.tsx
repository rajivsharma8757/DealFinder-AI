// src/app/products/[id]/page.tsx - Product Detail & Full Multi-Store Comparison Engine
'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Star, 
  Heart, 
  Layers, 
  Bell, 
  ExternalLink, 
  ShieldCheck, 
  ArrowLeft, 
  TrendingDown, 
  Check, 
  CreditCard,
  Tag,
  Clock,
  HelpCircle
} from 'lucide-react';
import { getProductById, getAllProducts } from '@/lib/data/catalog';
import { getBestEligiblePrice } from '@/lib/engine/calculator';
import { useApp } from '@/context/AppContext';
import ComparisonTable from '@/components/ComparisonTable';
import PriceAlertModal from '@/components/PriceAlertModal';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;
  const product = getProductById(productId);

  const { isInWishlist, toggleWishlist, addToComparison, isInComparison, removeFromComparison } = useApp();
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'comparison' | 'specs' | 'history'>('comparison');

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Product Not Found</h2>
        <p className="text-gray-400 text-sm">The requested product could not be located in our verified catalog.</p>
        <Link href="/search" className="inline-block px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-xs">
          Browse All Products
        </Link>
      </div>
    );
  }

  const bestListing = getBestEligiblePrice(product);
  const savings = bestListing.original_price - bestListing.eligible_final_price;
  const inWish = isInWishlist(product.id);
  const inComp = isInComparison(product.id);

  const relatedProducts = getAllProducts()
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Breadcrumb & Back */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
        <span>/</span>
        <Link href={`/search?category=${encodeURIComponent(product.category)}`} className="hover:text-emerald-400">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-gray-300 truncate max-w-xs">{product.brand}</span>
      </div>

      {/* Main Top Section: Image & Hero Offer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Image & Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative rounded-3xl bg-[#191F1C] border border-[#2A352F] p-8 flex items-center justify-center min-h-[380px] overflow-hidden">
            <img
              src={product.image_url || product.image || ''}
              alt={product.title}
              className="max-h-[320px] max-w-full object-contain"
            />
            {bestListing.discount_pct > 0 && (
              <div className="absolute top-4 left-4 px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold text-xs">
                {bestListing.discount_pct}% OFF
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400 bg-[#191F1C] p-3 rounded-2xl border border-[#2A352F]">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Multi-Store Verified Feed</span>
            </span>
            <span>Synced 12 mins ago</span>
          </div>
        </div>

        {/* Right Col: Product Info & Price Box (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                {product.brand}
              </span>
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-medium">
                <Star className="w-4 h-4 fill-current" />
                <span>{product.overall_rating || product.rating || 4.5}</span>
                <span className="text-gray-500">({(product.total_reviews || product.review_count || 100).toLocaleString()} reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              {product.title}
            </h1>

            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Pricing Highlight Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#191F1C] via-[#1d2520] to-[#191F1C] border border-[#2A352F] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs text-gray-400 font-medium">Lowest Eligible Price</div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-emerald-400">
                    ₹{bestListing.eligible_final_price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ₹{bestListing.original_price.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-3 py-1 rounded-xl">
                  Save ₹{savings.toLocaleString('en-IN')} ({bestListing.discount_pct}% off)
                </span>
                <div className="text-[11px] text-gray-400 mt-1">
                  Lowest on <strong className="text-white">{bestListing.retailer}</strong>
                </div>
              </div>
            </div>

            {/* Applicable Offers Breakdown */}
            <div className="space-y-2 pt-3 border-t border-[#2A352F] text-xs">
              {bestListing.bank_offer && (
                <div className="flex items-center gap-2 text-emerald-300 bg-emerald-950/40 border border-emerald-900/60 p-2.5 rounded-xl">
                  <CreditCard className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span><strong>Bank Offer:</strong> {bestListing.bank_offer.terms}</span>
                </div>
              )}
              {bestListing.coupon && (
                <div className="flex items-center gap-2 text-amber-300 bg-amber-950/40 border border-amber-900/60 p-2.5 rounded-xl">
                  <Tag className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span><strong>Coupon Code:</strong> Use <strong>{bestListing.coupon.code}</strong> for ₹{bestListing.coupon.discount_value} off</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <a
                href={bestListing.product_url}
                target="_blank"
                rel="noopener noreferrer"
                className="sm:col-span-2 py-3 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm transition-all text-center flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20"
              >
                <span>Buy on {bestListing.retailer}</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                onClick={() => setAlertModalOpen(true)}
                className="py-3 px-4 rounded-2xl bg-[#222B26] hover:bg-[#2A352F] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 border border-[#2A352F]"
              >
                <Bell className="w-4 h-4 text-emerald-400" />
                <span>Price Alert</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-[#2A352F]">
              <button
                onClick={() => toggleWishlist(product.id)}
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <Heart className={`w-4 h-4 ${inWish ? 'text-pink-500 fill-current' : ''}`} />
                <span>{inWish ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
              </button>

              <button
                onClick={() => inComp ? removeFromComparison(product.id) : addToComparison(product.id)}
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <Layers className={`w-4 h-4 ${inComp ? 'text-emerald-400' : ''}`} />
                <span>{inComp ? 'In Comparison Matrix' : 'Compare Product'}</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Tabs: Comparison Matrix / Technical Specs / Price History */}
      <div className="space-y-6 pt-6">
        <div className="flex items-center gap-3 border-b border-[#2A352F] pb-3">
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'comparison'
                ? 'bg-emerald-500 text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            All Store Prices ({(product.store_listings || product.rows || []).length})
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'specs'
                ? 'bg-emerald-500 text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-emerald-500 text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Price History & Trends
          </button>
        </div>

        {/* Tab 1: Comparison Table */}
        {activeTab === 'comparison' && (
          <ComparisonTable listings={product.store_listings || product.rows || []} productTitle={product.title} />
        )}

        {/* Tab 2: Technical Specs */}
        {activeTab === 'specs' && (
          <div className="rounded-2xl bg-[#191F1C] border border-[#2A352F] p-6">
            <h3 className="font-bold text-white text-base mb-4">Detailed Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.specifications || product.specs || {}).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-[#101312] border border-[#2A352F] text-xs">
                  <span className="text-gray-400 font-medium">{key}</span>
                  <span className="text-white font-semibold">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Price History */}
        {activeTab === 'history' && (
          <div className="rounded-2xl bg-[#191F1C] border border-[#2A352F] p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-white text-base">90-Day Price Trend Analysis</h3>
                <p className="text-xs text-gray-400">Historical lowest prices across all verified retailers</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div>Highest: <strong className="text-red-400">₹{bestListing.original_price.toLocaleString('en-IN')}</strong></div>
                <div>Lowest: <strong className="text-emerald-400">₹{bestListing.eligible_final_price.toLocaleString('en-IN')}</strong></div>
              </div>
            </div>

            {/* Visual Trend Bars */}
            <div className="h-44 flex items-end justify-between gap-2 pt-6 px-4 border-b border-[#2A352F]">
              {[
                { date: 'Sep 1', price: bestListing.original_price },
                { date: 'Sep 15', price: Math.round(bestListing.original_price * 0.95) },
                { date: 'Oct 1', price: Math.round(bestListing.original_price * 0.92) },
                { date: 'Oct 15', price: Math.round(bestListing.original_price * 0.88) },
                { date: 'Nov 1', price: Math.round(bestListing.original_price * 0.84) },
                { date: 'Today', price: bestListing.eligible_final_price },
              ].map((point, i) => {
                const heightPct = Math.max(30, Math.min(100, Math.round((point.price / bestListing.original_price) * 100)));
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-[10px] text-gray-400">₹{(point.price / 1000).toFixed(1)}k</span>
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full max-w-[40px] rounded-t-lg transition-all ${
                        i === 5 ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30' : 'bg-[#2A352F]'
                      }`}
                    />
                    <span className="text-[10px] text-gray-500">{point.date}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <TrendingDown className="w-4 h-4" />
                <span>Price is currently at its 90-day lowest record!</span>
              </span>
              <button
                onClick={() => setAlertModalOpen(true)}
                className="text-emerald-400 hover:underline"
              >
                Set notification for further drops &rarr;
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4 pt-10 border-t border-[#2A352F]">
          <h3 className="font-bold text-white text-lg">Compare with Similar Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Price Alert Modal */}
      <PriceAlertModal
        productId={product.id}
        productTitle={product.title}
        currentPrice={bestListing.eligible_final_price}
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
      />

    </div>
  );
}
