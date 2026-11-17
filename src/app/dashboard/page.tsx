// src/app/dashboard/page.tsx - User Shopping Intelligence Dashboard
'use client';

import React from 'react';
import Link from 'next/link';
import { 
  User, 
  Heart, 
  Bell, 
  Layers, 
  CreditCard, 
  TrendingDown, 
  Search, 
  Bot, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getProductById } from '@/lib/data/catalog';
import ProductCard from '@/components/ProductCard';

export default function DashboardPage() {
  const { user, wishlist, priceAlerts, comparisonIds, searchHistory, selectedBank } = useApp();

  const wishlistProducts = wishlist
    .map(id => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-[#191F1C] to-[#191F1C] border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <User className="w-3.5 h-3.5" />
            <span>Shopper Account</span>
          </div>
          <h1 className="text-3xl font-black text-white">
            Welcome back, {user?.name || 'Shopper'}!
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Monitor real-time retailer price drops, manage saved comparisons, and review active card promotions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/assistant"
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Bot className="w-4 h-4" />
            <span>Ask AI Assistant</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Wishlist */}
        <Link
          href="/wishlist"
          className="p-6 rounded-2xl bg-[#191F1C] border border-[#2A352F] hover:border-pink-500/40 transition-all hover:shadow-xl group space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <span className="text-2xl font-black text-white">{wishlist.length}</span>
          </div>
          <div>
            <h3 className="font-bold text-white text-sm group-hover:text-pink-300">Saved Wishlist</h3>
            <p className="text-xs text-gray-400">Products tracked across stores</p>
          </div>
        </Link>

        {/* Price Alerts */}
        <Link
          href="/price-alerts"
          className="p-6 rounded-2xl bg-[#191F1C] border border-[#2A352F] hover:border-amber-500/40 transition-all hover:shadow-xl group space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Bell className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black text-white">{priceAlerts.length}</span>
          </div>
          <div>
            <h3 className="font-bold text-white text-sm group-hover:text-amber-300">Price Alerts</h3>
            <p className="text-xs text-gray-400">Active drop threshold notifications</p>
          </div>
        </Link>

        {/* Comparisons */}
        <Link
          href="/compare"
          className="p-6 rounded-2xl bg-[#191F1C] border border-[#2A352F] hover:border-emerald-500/40 transition-all hover:shadow-xl group space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black text-white">{comparisonIds.length}</span>
          </div>
          <div>
            <h3 className="font-bold text-white text-sm group-hover:text-emerald-300">Active Comparison</h3>
            <p className="text-xs text-gray-400">Products in head-to-head matrix</p>
          </div>
        </Link>

        {/* Active Card */}
        <Link
          href="/profile"
          className="p-6 rounded-2xl bg-[#191F1C] border border-[#2A352F] hover:border-blue-500/40 transition-all hover:shadow-xl group space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              ACTIVE
            </span>
          </div>
          <div>
            <h3 className="font-bold text-white text-sm group-hover:text-blue-300">{selectedBank}</h3>
            <p className="text-xs text-gray-400">Primary discount optimization card</p>
          </div>
        </Link>

      </div>

      {/* Recent Searches */}
      {searchHistory.length > 0 && (
        <div className="p-6 rounded-3xl bg-[#191F1C] border border-[#2A352F] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Search className="w-4 h-4 text-emerald-400" />
              <span>Recent Searches</span>
            </h3>
            <Link href="/history" className="text-xs text-emerald-400 hover:underline">
              View History &rarr;
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchHistory.slice(0, 6).map((q, idx) => (
              <Link
                key={idx}
                href={`/search?q=${encodeURIComponent(q)}`}
                className="px-3 py-1.5 rounded-xl bg-[#101312] border border-[#2A352F] text-xs text-gray-300 hover:text-white hover:border-emerald-500/40 transition-colors"
              >
                {q}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Wishlist Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500 fill-current" />
            <span>Wishlist Products ({wishlistProducts.length})</span>
          </h2>
          <Link href="/wishlist" className="text-xs font-bold text-emerald-400 hover:underline">
            Manage Wishlist &rarr;
          </Link>
        </div>

        {wishlistProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistProducts.slice(0, 3).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-[#191F1C] rounded-2xl border border-[#2A352F] space-y-2">
            <p className="text-xs text-gray-400">Your wishlist is currently empty.</p>
            <Link href="/search" className="text-xs font-bold text-emerald-400 hover:underline">
              Start Exploring Products &rarr;
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}
