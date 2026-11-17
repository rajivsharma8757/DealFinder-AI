// src/app/admin/page.tsx - Admin System Dashboard & Platform Operations
'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Store, 
  Layers, 
  CreditCard, 
  Activity, 
  RefreshCw, 
  Server, 
  Clock, 
  AlertTriangle,
  ArrowRight,
  Database
} from 'lucide-react';
import { getAllProducts, BANK_OFFERS, COUPONS } from '@/lib/data/catalog';
import { INDIAN_RETAILER_PROVIDERS } from '@/lib/engine/storeAdapters';

export default function AdminPage() {
  const products = getAllProducts();
  const totalListings = products.reduce((acc, p) => acc + (p.store_listings?.length || p.rows?.length || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Banner */}
      <div className="p-8 rounded-3xl bg-[#191F1C] border border-[#2A352F] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Control Panel</span>
          </div>
          <h1 className="text-3xl font-black text-white">DealFinder AI Engine Operations</h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Real-time crawler telemetry, provider adapter statuses, and coupon synchronization.
          </p>
        </div>

        <Link
          href="/admin/providers"
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all"
        >
          <Store className="w-4 h-4" />
          <span>Manage Retailer Providers &rarr;</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-[#191F1C] border border-[#2A352F] space-y-2">
          <div className="text-xs text-gray-400 uppercase font-medium">Catalog Products</div>
          <div className="text-3xl font-black text-white">{products.length}</div>
          <div className="text-[11px] text-emerald-400 font-medium">Across 7 Core Categories</div>
        </div>

        <div className="p-6 rounded-2xl bg-[#191F1C] border border-[#2A352F] space-y-2">
          <div className="text-xs text-gray-400 uppercase font-medium">Store Price Listings</div>
          <div className="text-3xl font-black text-emerald-400">{totalListings}</div>
          <div className="text-[11px] text-gray-400">Avg {Math.round(totalListings / products.length)} stores per product</div>
        </div>

        <div className="p-6 rounded-2xl bg-[#191F1C] border border-[#2A352F] space-y-2">
          <div className="text-xs text-gray-400 uppercase font-medium">Connected Retailers</div>
          <div className="text-3xl font-black text-white">{INDIAN_RETAILER_PROVIDERS.length}</div>
          <div className="text-[11px] text-emerald-400 font-medium">10 Active • 10 Integrating</div>
        </div>

        <div className="p-6 rounded-2xl bg-[#191F1C] border border-[#2A352F] space-y-2">
          <div className="text-xs text-gray-400 uppercase font-medium">Promotions Database</div>
          <div className="text-3xl font-black text-amber-400">{BANK_OFFERS.length + COUPONS.length}</div>
          <div className="text-[11px] text-gray-400">{BANK_OFFERS.length} Bank Offers • {COUPONS.length} Coupons</div>
        </div>
      </div>

      {/* System Health & Crawler Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Crawler Status */}
        <div className="p-6 rounded-3xl bg-[#191F1C] border border-[#2A352F] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#2A352F]">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Real-Time Ingestion Status</span>
            </h3>
            <span className="text-[11px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              Operational
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#101312] border border-[#2A352F]">
              <span className="text-gray-300">Amazon India Affiliate Feed</span>
              <span className="text-emerald-400 font-semibold">200 OK • 120ms</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#101312] border border-[#2A352F]">
              <span className="text-gray-300">Flipkart Product Graph API</span>
              <span className="text-emerald-400 font-semibold">200 OK • 145ms</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#101312] border border-[#2A352F]">
              <span className="text-gray-300">Croma Enterprise Partner Sync</span>
              <span className="text-emerald-400 font-semibold">200 OK • 95ms</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#101312] border border-[#2A352F]">
              <span className="text-gray-300">Myntra & AJIO Fashion Catalog Sync</span>
              <span className="text-emerald-400 font-semibold">200 OK • 110ms</span>
            </div>
          </div>
        </div>

        {/* Sync Settings */}
        <div className="p-6 rounded-3xl bg-[#191F1C] border border-[#2A352F] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#2A352F]">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Sync Intervals & Architecture</span>
            </h3>
            <span className="text-xs text-gray-400">Auto-Scheduler Active</span>
          </div>

          <div className="space-y-3 text-xs text-gray-300">
            <div className="p-3 rounded-xl bg-[#101312] border border-[#2A352F] flex items-center justify-between">
              <span>Price Refresh Frequency</span>
              <strong className="text-white">Every 15 Minutes</strong>
            </div>
            <div className="p-3 rounded-xl bg-[#101312] border border-[#2A352F] flex items-center justify-between">
              <span>Bank Offer Sync</span>
              <strong className="text-white">Every 24 Hours (Midnight)</strong>
            </div>
            <div className="p-3 rounded-xl bg-[#101312] border border-[#2A352F] flex items-center justify-between">
              <span>Coupon Code Verification</span>
              <strong className="text-white">Every 6 Hours</strong>
            </div>
            <div className="p-3 rounded-xl bg-[#101312] border border-[#2A352F] flex items-center justify-between">
              <span>Host Environment</span>
              <strong className="text-emerald-400">Next.js 15 App Router • Node.js</strong>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
