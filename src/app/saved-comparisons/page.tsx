// src/app/saved-comparisons/page.tsx - Saved Product Comparisons
'use client';

import React from 'react';
import Link from 'next/link';
import { Layers, ArrowRight, Trash2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getProductById } from '@/lib/data/catalog';
import { getBestEligiblePrice } from '@/lib/engine/calculator';

export default function SavedComparisonsPage() {
  const { comparisonIds, clearComparison, removeFromComparison } = useApp();

  const products = comparisonIds
    .map(id => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      <div className="p-8 rounded-3xl bg-[#191F1C] border border-[#2A352F] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>Saved Sets</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Saved Comparisons</h1>
          <p className="text-xs text-gray-400">Head-to-head multi-store product comparison sets.</p>
        </div>

        {products.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={clearComparison}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-red-400 hover:bg-[#222B26] border border-[#2A352F] transition-colors"
            >
              Clear All
            </button>
            <Link
              href="/compare"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20"
            >
              Open Comparison Matrix
            </Link>
          </div>
        )}
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => {
            const best = getBestEligiblePrice(p);
            return (
              <div key={p.id} className="p-5 rounded-2xl bg-[#191F1C] border border-[#2A352F] space-y-4">
                <div className="h-40 bg-[#101312] p-4 rounded-xl border border-[#2A352F] flex items-center justify-center">
                  <img src={p.image_url} alt={p.title} className="max-h-full max-w-full object-contain" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase">{p.brand}</span>
                  <h4 className="font-bold text-white text-xs line-clamp-2 mt-0.5">{p.title}</h4>
                </div>
                <div className="pt-2 border-t border-[#2A352F] flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-gray-400 block">Lowest on {best.retailer}</span>
                    <span className="text-base font-extrabold text-emerald-400">
                      ₹{best.eligible_final_price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <button
                    onClick={() => removeFromComparison(p.id)}
                    className="text-xs text-gray-500 hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#191F1C] rounded-3xl border border-[#2A352F] space-y-3">
          <Layers className="w-10 h-10 text-gray-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No active comparisons</h3>
          <p className="text-xs text-gray-400">Add products using the compare icon on product cards.</p>
        </div>
      )}

    </div>
  );
}
