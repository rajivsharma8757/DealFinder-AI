// src/app/deals/page.tsx - Today's Super Deals & Price Drop Discoveries
'use client';

import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Flame, 
  Filter, 
  Clock, 
  Sparkles, 
  ArrowUpDown,
  Tag
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { getAllProducts, CATEGORIES } from '@/lib/data/catalog';
import { getBestEligiblePrice } from '@/lib/engine/calculator';

export default function DealsPage() {
  const allProducts = getAllProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStore, setSelectedStore] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'discount' | 'price_low' | 'rating'>('discount');

  const filteredDeals = useMemo(() => {
    let list = allProducts.filter(p => {
      // Category filter
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }
      // Store filter
      if (selectedStore !== 'All') {
        const listings = p.store_listings || p.rows || [];
        const hasStore = listings.some(l => l.retailer.toLowerCase().includes(selectedStore.toLowerCase()));
        if (!hasStore) return false;
      }
      return true;
    });

    // Sorting
    list.sort((a, b) => {
      const bestA = getBestEligiblePrice(a);
      const bestB = getBestEligiblePrice(b);
      if (sortBy === 'discount') {
        return bestB.discount_pct - bestA.discount_pct;
      } else if (sortBy === 'price_low') {
        return bestA.eligible_final_price - bestB.eligible_final_price;
      } else {
        return (b.overall_rating || b.rating || 0) - (a.overall_rating || a.rating || 0);
      }
    });

    return list;
  }, [allProducts, selectedCategory, selectedStore, sortBy]);

  const stores = ['All', 'Amazon India', 'Flipkart', 'Croma', 'Reliance Digital', 'Myntra', 'AJIO', 'Tata CLiQ'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Deals Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-red-950/40 via-[#191F1C] to-[#191F1C] border border-red-500/30 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold">
            <Flame className="w-4 h-4 fill-current" />
            <span>Real-Time Price Drops & Super Steals</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Today's Best Verified Deals
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl">
            Sorted by highest discount percentage and net effective price across 20+ leading Indian retailers.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#101312] border border-[#2A352F] px-4 py-3 rounded-2xl">
          <Clock className="w-5 h-5 text-emerald-400" />
          <div className="text-xs">
            <div className="text-gray-400">Price Feed Status</div>
            <div className="text-white font-bold">Synced 5 mins ago</div>
          </div>
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl bg-[#191F1C] border border-[#2A352F]">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'All'
                ? 'bg-emerald-500 text-black'
                : 'bg-[#222B26] text-gray-300 hover:text-white border border-[#2A352F]'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.name
                  ? 'bg-emerald-500 text-black'
                  : 'bg-[#222B26] text-gray-300 hover:text-white border border-[#2A352F]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Store & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Store Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-400">Store:</span>
            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="bg-[#222B26] border border-[#2A352F] text-xs text-gray-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500"
            >
              {stores.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#222B26] border border-[#2A352F] text-xs text-gray-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500"
            >
              <option value="discount">Highest Discount %</option>
              <option value="price_low">Lowest Final Price</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>
        </div>

      </div>

      {/* Deals Grid */}
      {filteredDeals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDeals.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#191F1C] rounded-2xl border border-[#2A352F] space-y-3">
          <Tag className="w-10 h-10 text-gray-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No deals match these filters</h3>
          <p className="text-xs text-gray-400">Try resetting the category or store selection.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedStore('All');
            }}
            className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
}
