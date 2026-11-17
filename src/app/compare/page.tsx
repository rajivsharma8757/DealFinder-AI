// src/app/compare/page.tsx - Multi-Product Side-by-Side Comparison Matrix
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Layers, 
  X, 
  Plus, 
  ExternalLink, 
  Star, 
  Trash2, 
  Check, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getProductById, getAllProducts } from '@/lib/data/catalog';
import { getBestEligiblePrice } from '@/lib/engine/calculator';

export default function ComparePage() {
  const { comparisonIds, removeFromComparison, clearComparison, addToComparison } = useApp();
  const allProducts = getAllProducts();
  const [selectorOpen, setSelectorOpen] = useState(false);

  // Hydrate products from catalog
  const comparedProducts = comparisonIds
    .map(id => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  // Available specs union
  const allSpecKeys = Array.from(
    new Set(comparedProducts.flatMap(p => Object.keys(p.specifications || p.specs || {})))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#191F1C] border border-[#2A352F]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Head-to-Head Comparison</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Product Comparison Matrix
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Compare prices across 20+ retailers, specifications, and bank discounts side-by-side (up to 4 products).
          </p>
        </div>

        <div className="flex items-center gap-3">
          {comparedProducts.length > 0 && (
            <button
              onClick={clearComparison}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-red-400 hover:bg-[#222B26] border border-[#2A352F] transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}

          {comparedProducts.length < 4 && (
            <button
              onClick={() => setSelectorOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Comparison Table */}
      {comparedProducts.length > 0 ? (
        <div className="overflow-x-auto rounded-3xl border border-[#2A352F] bg-[#191F1C]">
          <table className="w-full text-left border-collapse">
            
            {/* Table Header: Product Cards */}
            <thead>
              <tr className="border-b border-[#2A352F] bg-[#141816]">
                <th className="p-4 sm:p-6 w-48 text-xs font-bold text-gray-400 uppercase tracking-wider align-top">
                  Product
                </th>
                {comparedProducts.map((p) => {
                  const best = getBestEligiblePrice(p);
                  return (
                    <th key={p.id} className="p-4 sm:p-6 min-w-[240px] max-w-[280px] align-top">
                      <div className="relative space-y-3">
                        <button
                          onClick={() => removeFromComparison(p.id)}
                          className="absolute -top-2 -right-2 p-1.5 rounded-full bg-[#222B26] hover:bg-red-500/20 text-gray-400 hover:text-red-400 border border-[#2A352F] transition-colors"
                          title="Remove"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>

                        <div className="h-32 bg-[#101312] p-3 rounded-2xl border border-[#2A352F] flex items-center justify-center">
                          <img
                            src={p.image_url || p.image || ''}
                            alt={p.title}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                            {p.brand}
                          </span>
                          <Link href={`/products/${p.id}`} className="block hover:text-emerald-300">
                            <h4 className="font-bold text-white text-xs line-clamp-2 leading-snug mt-0.5">
                              {p.title}
                            </h4>
                          </Link>
                        </div>

                        <div className="pt-2 border-t border-[#2A352F]">
                          <div className="text-[10px] text-gray-400">Lowest Eligible Price</div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-black text-emerald-400">
                              ₹{best.eligible_final_price.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[11px] text-gray-500 line-through">
                              ₹{best.original_price.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className="text-[10px] text-gray-400 mt-1">
                            Best on <strong className="text-white">{best.retailer}</strong>
                          </div>
                        </div>

                        <a
                          href={best.product_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md"
                        >
                          <span>Buy on {best.retailer}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* Spec Rows */}
            <tbody className="divide-y divide-[#2A352F] text-xs">
              
              {/* Rating */}
              <tr className="hover:bg-[#222B26]/30">
                <td className="p-4 sm:p-5 font-semibold text-gray-400">Customer Rating</td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 sm:p-5 text-white">
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="font-bold">{p.overall_rating || p.rating || 4.5}</span>
                      <span className="text-gray-500 text-[10px]">({(p.total_reviews || p.review_count || 100).toLocaleString()})</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Stores Compared */}
              <tr className="hover:bg-[#222B26]/30">
                <td className="p-4 sm:p-5 font-semibold text-gray-400">Stores Available</td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 sm:p-5 text-gray-300">
                    <div className="space-y-1">
                      {(p.store_listings || p.rows || []).map((l) => (
                        <div key={l.id} className="flex items-center justify-between text-[11px]">
                          <span>{l.retailer}</span>
                          <strong className="text-white">₹{l.eligible_final_price.toLocaleString('en-IN')}</strong>
                        </div>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Dynamic Specifications */}
              {allSpecKeys.map((key) => (
                <tr key={key} className="hover:bg-[#222B26]/30">
                  <td className="p-4 sm:p-5 font-semibold text-gray-400">{key}</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-4 sm:p-5 text-gray-200">
                      {(p.specifications || p.specs || {})[key] || '—'}
                    </td>
                  ))}
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-20 bg-[#191F1C] rounded-3xl border border-[#2A352F] space-y-4">
          <Layers className="w-12 h-12 text-gray-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No products selected for comparison</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Select products from search results or pick from our suggested catalogue below.
          </p>
          <button
            onClick={() => setSelectorOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-xs shadow-lg shadow-emerald-500/20"
          >
            Choose Products to Compare
          </button>
        </div>
      )}

      {/* Quick Add Product Modal */}
      {selectorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#191F1C] border border-[#2A352F] p-6 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-[#2A352F]">
              <h3 className="font-bold text-white text-base">Select a Product to Compare</h3>
              <button
                onClick={() => setSelectorOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto divide-y divide-[#2A352F] my-4 pr-1">
              {allProducts.map((prod) => {
                const isSelected = comparisonIds.includes(prod.id);
                const best = getBestEligiblePrice(prod);
                return (
                  <div key={prod.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#101312] p-1 border border-[#2A352F] flex items-center justify-center">
                        <img src={prod.image_url} alt={prod.title} className="max-h-full max-w-full object-contain" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-white line-clamp-1">{prod.title}</h4>
                        <div className="text-[11px] text-emerald-400">
                          ₹{best.eligible_final_price.toLocaleString('en-IN')} on {best.retailer}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (isSelected) {
                          removeFromComparison(prod.id);
                        } else {
                          addToComparison(prod.id);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-[#222B26] hover:bg-[#2A352F] text-white border border-[#2A352F]'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Add'}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[#2A352F] flex justify-end">
              <button
                onClick={() => setSelectorOpen(false)}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
