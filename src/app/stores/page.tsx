// src/app/stores/page.tsx - 20+ Indian Retailer Directory & Integration Status
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Store, ShieldCheck, Clock, ExternalLink, Search, CheckCircle2, AlertCircle } from 'lucide-react';
import { INDIAN_RETAILER_PROVIDERS } from '@/lib/engine/storeAdapters';

export default function StoresPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const filteredStores = INDIAN_RETAILER_PROVIDERS.filter((store) => {
    const cats = (store.categories || store.category_coverage || []) as string[];
    if (selectedCategory !== 'All' && !cats.includes(selectedCategory)) {
      return false;
    }
    if (searchFilter && !store.name.toLowerCase().includes(searchFilter.toLowerCase())) {
      return false;
    }
    return true;
  });

  const categories = ['All', 'Electronics', 'Mobiles', 'Fashion', 'Footwear', 'Home & Kitchen', 'Beauty', 'General'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Banner */}
      <div className="p-8 rounded-3xl bg-[#191F1C] border border-[#2A352F] space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <Store className="w-3.5 h-3.5" />
          <span>Connected Retailer Ecosystem</span>
        </div>
        <h1 className="text-3xl font-black text-white">Supported Indian Online Stores</h1>
        <p className="text-xs sm:text-sm text-gray-400 max-w-xl">
          DealFinder AI interfaces with 20+ verified Indian eCommerce platforms, comparing live prices, active coupons, and bank card discounts.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#191F1C] border border-[#2A352F]">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-black'
                  : 'bg-[#222B26] text-gray-300 hover:text-white border border-[#2A352F]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search stores..."
            className="w-full bg-[#101312] border border-[#2A352F] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStores.map((store) => (
          <div
            key={store.id}
            className="rounded-2xl bg-[#191F1C] border border-[#2A352F] hover:border-emerald-500/40 p-6 transition-all duration-300 flex flex-col justify-between hover:shadow-xl space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#101312] border border-[#2A352F] flex items-center justify-center font-bold text-white text-xs">
                    {store.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{store.name}</h3>
                    <span className="text-[11px] text-gray-500">{store.country}</span>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  store.status === 'active'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                }`}>
                  {store.status === 'active' ? 'Active Feed' : 'Connecting'}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-gray-400">
                  <span>Feed Method:</span>
                  <span className="text-gray-200 capitalize">{(store.integration_type || store.adapter_type || 'affiliate_api').replace('_', ' ')}</span>
                </div>
                <div className="flex items-center justify-between text-gray-400">
                  <span>Average Sync Latency:</span>
                  <span className="text-gray-200">{store.sync_latency || `${store.latency_ms || 100}ms`}</span>
                </div>
                <div className="pt-2">
                  <span className="text-gray-500 text-[11px] block mb-1">Categories Covered:</span>
                  <div className="flex flex-wrap gap-1">
                    {(store.categories || store.category_coverage || []).map((c, i) => (
                      <span key={i} className="text-[10px] bg-[#101312] px-2 py-0.5 rounded-md text-gray-400 border border-[#2A352F]">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#2A352F] flex items-center justify-between">
              <Link
                href={`/search?retailer=${encodeURIComponent(store.name)}`}
                className="text-xs font-bold text-emerald-400 hover:underline"
              >
                Search Products on {store.name} &rarr;
              </Link>
              <a
                href={store.website_url || store.direct_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#222B26]"
                title="Visit website"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
