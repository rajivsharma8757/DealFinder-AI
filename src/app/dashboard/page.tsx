// src/app/dashboard/page.tsx - Comprehensive User Shopping Dashboard
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Heart, 
  Bell, 
  Layers, 
  CreditCard, 
  Search, 
  Bot, 
  ArrowRight, 
  Trash2, 
  ExternalLink,
  Sparkles,
  TrendingDown
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getProductById } from '@/lib/data/catalog';
import ProductCard from '@/components/ProductCard';
import { SavedComparison } from '@/types';

export default function DashboardOverviewPage() {
  const { user, profile, wishlist, priceAlerts, comparisonIds, searchHistory, selectedBank, removePriceAlert } = useApp();
  const [savedComparisons, setSavedComparisons] = useState<SavedComparison[]>([]);
  const [loadingComparisons, setLoadingComparisons] = useState(false);

  // Fetch saved comparisons from server
  useEffect(() => {
    if (!user) return;
    setLoadingComparisons(true);
    fetch('/api/user/comparisons')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.comparisons)) {
          setSavedComparisons(data.comparisons);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingComparisons(false));
  }, [user]);

  const handleDeleteComparison = async (id: string) => {
    try {
      await fetch(`/api/user/comparisons?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      setSavedComparisons(prev => prev.filter(c => c.id !== id));
    } catch {}
  };

  const wishlistProducts = wishlist
    .map(id => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-[#191F1C] to-[#191F1C] border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Shopping Intelligence Portal</span>
          </div>
          <h1 className="text-3xl font-black text-white">
            Welcome back, {user?.name || profile?.fullName || 'Shopper'}!
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Real-time price drop notifications, saved store matrices, and instant card savings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/assistant"
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all whitespace-nowrap"
          >
            <Bot className="w-4 h-4" />
            <span>Ask AI Assistant</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Wishlist Stat */}
        <Link
          href="/wishlist"
          className="p-5 rounded-2xl bg-[#191F1C] border border-[#2A352F] hover:border-pink-500/40 transition-all group space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <span className="text-2xl font-black text-white">{wishlist.length}</span>
          </div>
          <div>
            <h4 className="font-bold text-white text-xs group-hover:text-pink-300">Saved Wishlist</h4>
            <p className="text-[11px] text-gray-400">Products tracked</p>
          </div>
        </Link>

        {/* Price Alerts Stat */}
        <Link
          href="/price-alerts"
          className="p-5 rounded-2xl bg-[#191F1C] border border-[#2A352F] hover:border-amber-500/40 transition-all group space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Bell className="w-4 h-4" />
            </div>
            <span className="text-2xl font-black text-white">{priceAlerts.length}</span>
          </div>
          <div>
            <h4 className="font-bold text-white text-xs group-hover:text-amber-300">Price Alerts</h4>
            <p className="text-[11px] text-gray-400">Drop notifications</p>
          </div>
        </Link>

        {/* Comparison Stat */}
        <Link
          href="/compare"
          className="p-5 rounded-2xl bg-[#191F1C] border border-[#2A352F] hover:border-emerald-500/40 transition-all group space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Layers className="w-4 h-4" />
            </div>
            <span className="text-2xl font-black text-white">{comparisonIds.length}</span>
          </div>
          <div>
            <h4 className="font-bold text-white text-xs group-hover:text-emerald-300">Matrix Items</h4>
            <p className="text-[11px] text-gray-400">Head-to-head</p>
          </div>
        </Link>

        {/* Active Optimization Card */}
        <Link
          href="/dashboard/profile"
          className="p-5 rounded-2xl bg-[#191F1C] border border-[#2A352F] hover:border-blue-500/40 transition-all group space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <CreditCard className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              ACTIVE
            </span>
          </div>
          <div>
            <h4 className="font-bold text-white text-xs group-hover:text-blue-300 truncate">{selectedBank}</h4>
            <p className="text-[11px] text-gray-400">Best price calculation</p>
          </div>
        </Link>

      </div>

      {/* Active Price Drop Alerts List */}
      <div className="p-6 rounded-3xl bg-[#191F1C] border border-[#2A352F] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-white text-sm">Active Price Drop Watchlist</h3>
          </div>
          <Link href="/price-alerts" className="text-xs text-emerald-400 hover:underline">
            Manage All Alerts ({priceAlerts.length}) &rarr;
          </Link>
        </div>

        {priceAlerts.length > 0 ? (
          <div className="space-y-2">
            {priceAlerts.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                className="p-3.5 rounded-2xl bg-[#101312] border border-[#2A352F] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white">{alert.product_title}</h4>
                  <div className="flex items-center gap-3 text-[11px] text-gray-400">
                    <span>Target: <strong className="text-emerald-400">₹{alert.target_price.toLocaleString('en-IN')}</strong></span>
                    <span>Current: ₹{alert.current_price.toLocaleString('en-IN')}</span>
                    <span className="text-gray-500">Email: {alert.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/search?q=${encodeURIComponent(alert.product_title)}`}
                    className="px-3 py-1.5 rounded-lg bg-[#222B26] hover:bg-[#2A352F] text-xs font-semibold text-gray-300 hover:text-white transition-colors"
                  >
                    View Deals
                  </Link>
                  <button
                    onClick={() => removePriceAlert(alert.id)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                    title="Remove Alert"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-gray-400">
            No active price alerts yet. Click "Notify Price Drop" on any product card to track discounts.
          </div>
        )}
      </div>

      {/* Saved Comparisons Section */}
      {savedComparisons.length > 0 && (
        <div className="p-6 rounded-3xl bg-[#191F1C] border border-[#2A352F] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-white text-sm">Saved Comparisons</h3>
            </div>
            <Link href="/compare" className="text-xs text-emerald-400 hover:underline">
              Open Compare Matrix &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {savedComparisons.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-[#101312] border border-[#2A352F] flex items-center justify-between gap-3"
              >
                <div>
                  <h4 className="text-xs font-bold text-white">{c.title}</h4>
                  <span className="text-[11px] text-gray-400">
                    {c.productIds.length} Products • Saved on {c.createdAt}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href="/compare"
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold hover:bg-emerald-500 hover:text-black transition-colors"
                  >
                    Open
                  </Link>
                  <button
                    onClick={() => handleDeleteComparison(c.id)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                    title="Delete Comparison"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Searches */}
      {searchHistory.length > 0 && (
        <div className="p-6 rounded-3xl bg-[#191F1C] border border-[#2A352F] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Search className="w-4 h-4 text-emerald-400" />
              <span>Your Recent Searches</span>
            </h3>
            <Link href="/history" className="text-xs text-emerald-400 hover:underline">
              Full History &rarr;
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchHistory.slice(0, 8).map((q, idx) => (
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
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500 fill-current" />
            <span>Wishlist Products ({wishlistProducts.length})</span>
          </h2>
          <Link href="/wishlist" className="text-xs font-bold text-emerald-400 hover:underline">
            View All ({wishlistProducts.length}) &rarr;
          </Link>
        </div>

        {wishlistProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistProducts.slice(0, 3).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-[#191F1C] rounded-2xl border border-[#2A352F] space-y-2">
            <p className="text-xs text-gray-400">Your saved wishlist is empty.</p>
            <Link href="/search" className="text-xs font-bold text-emerald-400 hover:underline">
              Discover Products &rarr;
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}
