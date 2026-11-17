// src/app/price-alerts/page.tsx - Active Price Drop Notifications
'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, Trash2, CheckCircle2, TrendingDown, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function PriceAlertsPage() {
  const { priceAlerts, removePriceAlert } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      <div className="p-8 rounded-3xl bg-[#191F1C] border border-[#2A352F] space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold">
          <Bell className="w-3.5 h-3.5" />
          <span>Real-Time Watchlist</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Active Price Alerts ({priceAlerts.length})</h1>
        <p className="text-xs text-gray-400 max-w-xl">
          We check store feeds every 15 minutes. As soon as a product price drops to your target threshold, we dispatch an email alert.
        </p>
      </div>

      {priceAlerts.length > 0 ? (
        <div className="divide-y divide-[#2A352F] rounded-3xl bg-[#191F1C] border border-[#2A352F] overflow-hidden">
          {priceAlerts.map((alert) => {
            const dropNeeded = alert.current_price - alert.target_price;
            return (
              <div
                key={alert.id}
                className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#222B26]/40 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <h3 className="font-bold text-white text-sm">{alert.product_title}</h3>
                  </div>
                  <div className="text-xs text-gray-400 flex flex-wrap items-center gap-3">
                    <span>Notify: <strong className="text-gray-200">{alert.email}</strong></span>
                    <span>•</span>
                    <span>Created: {alert.created_at}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <div className="text-right">
                    <div className="text-[10px] text-gray-400 uppercase">Target Drop Price</div>
                    <div className="text-lg font-black text-emerald-400">
                      ₹{alert.target_price.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-gray-500">
                      Current: ₹{alert.current_price.toLocaleString('en-IN')} (₹{dropNeeded.toLocaleString('en-IN')} to go)
                    </div>
                  </div>

                  <button
                    onClick={() => removePriceAlert(alert.id)}
                    className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-[#222B26] border border-[#2A352F] transition-colors"
                    title="Delete Alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#191F1C] rounded-3xl border border-[#2A352F] space-y-3">
          <Bell className="w-10 h-10 text-gray-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No active price drop alerts</h3>
          <p className="text-xs text-gray-400">Click "Set Price Alert" on any product detail page to monitor price changes.</p>
        </div>
      )}

    </div>
  );
}
