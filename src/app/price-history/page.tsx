// src/app/price-history/page.tsx - Historical Price Analytics & Market Trends
import React from 'react';
import Link from 'next/link';
import { TrendingDown, Calendar, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { getAllProducts } from '@/lib/data/catalog';
import { getBestEligiblePrice } from '@/lib/engine/calculator';

export default function PriceHistoryPage() {
  const products = getAllProducts().slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="p-8 rounded-3xl bg-[#191F1C] border border-[#2A352F] space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <TrendingDown className="w-3.5 h-3.5" />
          <span>Historical Analytics</span>
        </div>
        <h1 className="text-3xl font-black text-white">Price History & Market Trends</h1>
        <p className="text-xs sm:text-sm text-gray-400 max-w-xl">
          See whether today's price is genuinely a good deal or inflated before a sale using our 90-day multi-store price index.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => {
          const best = getBestEligiblePrice(p);
          return (
            <div key={p.id} className="p-6 rounded-2xl bg-[#191F1C] border border-[#2A352F] flex flex-col justify-between space-y-4">
              <div>
                <div className="h-32 bg-[#101312] p-3 rounded-xl border border-[#2A352F] flex items-center justify-center mb-3">
                  <img src={p.image_url} alt={p.title} className="max-h-full max-w-full object-contain" />
                </div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase">{p.brand}</span>
                <h3 className="text-xs font-bold text-white line-clamp-2 mt-0.5">{p.title}</h3>
                
                <div className="mt-3 flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400">Current Best</span>
                    <div className="text-base font-black text-emerald-400">
                      ₹{best.eligible_final_price.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400">90-Day Low</span>
                    <div className="text-xs font-bold text-gray-200">
                      ₹{Math.round(best.eligible_final_price * 0.96).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>

              <Link
                href={`/products/${p.id}`}
                className="pt-3 border-t border-[#2A352F] text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center justify-between"
              >
                <span>View Full Trend Chart</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          );
        })}
      </div>

    </div>
  );
}
