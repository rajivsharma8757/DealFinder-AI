// src/app/search/page.tsx - Product Search Results & Multi-Criteria Filtering
'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Filter, 
  Sparkles, 
  Layers, 
  X, 
  Check, 
  SlidersHorizontal, 
  ArrowUpDown,
  Search as SearchIcon
} from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import ProductCard from '@/components/ProductCard';
import { searchProducts, parseNaturalLanguageQuery } from '@/lib/engine/search';
import { SearchQueryFilter } from '@/types';

function SearchContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';
  const brandParam = searchParams.get('brand') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'All');
  const [selectedBrand, setSelectedBrand] = useState<string>(brandParam || 'All');
  const [selectedRetailer, setSelectedRetailer] = useState<string>('All');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'best_price' | 'highest_discount' | 'rating' | 'popular'>('best_price');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Sync state if queryParam / categoryParam changes in URL
  useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
    if (brandParam) setSelectedBrand(brandParam);
  }, [categoryParam, brandParam]);

  // Natural Language query parsing
  const parsedIntent = useMemo(() => {
    return queryParam ? parseNaturalLanguageQuery(queryParam) : null;
  }, [queryParam]);

  // Execute Search
  const searchResults = useMemo(() => {
    const filter: SearchQueryFilter = {
      query: queryParam,
      category: selectedCategory !== 'All' ? selectedCategory : undefined,
      brand: selectedBrand !== 'All' ? selectedBrand : undefined,
      retailer: selectedRetailer !== 'All' ? selectedRetailer : undefined,
      min_price: minPrice ? Number(minPrice) : undefined,
      max_price: maxPrice ? Number(maxPrice) : undefined,
      rating: minRating > 0 ? minRating : undefined,
      in_stock_only: inStockOnly,
      sort_by: sortBy,
    };
    return searchProducts(filter);
  }, [queryParam, selectedCategory, selectedBrand, selectedRetailer, minPrice, maxPrice, minRating, inStockOnly, sortBy]);

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSelectedBrand('All');
    setSelectedRetailer('All');
    setMinPrice('');
    setMaxPrice('');
    setMinRating(0);
    setInStockOnly(false);
    setSortBy('best_price');
  };

  const hasActiveFilters = selectedCategory !== 'All' || selectedBrand !== 'All' || selectedRetailer !== 'All' || minPrice || maxPrice || minRating > 0 || inStockOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Search Bar */}
      <div className="max-w-3xl mx-auto">
        <SearchBar initialQuery={queryParam} />
      </div>

      {/* Natural Language Insights Pill */}
      {parsedIntent && (parsedIntent.maxBudget || parsedIntent.brand || parsedIntent.category) && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/70 text-xs text-emerald-300 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>AI Intent Extracted:</span>
          </div>
          {parsedIntent.category && (
            <span className="bg-[#101312] px-2 py-0.5 rounded-md border border-[#2A352F]">
              Category: <strong>{parsedIntent.category}</strong>
            </span>
          )}
          {parsedIntent.brand && (
            <span className="bg-[#101312] px-2 py-0.5 rounded-md border border-[#2A352F]">
              Brand: <strong>{parsedIntent.brand}</strong>
            </span>
          )}
          {parsedIntent.maxBudget && (
            <span className="bg-[#101312] px-2 py-0.5 rounded-md border border-[#2A352F]">
              Budget Limit: <strong>₹{parsedIntent.maxBudget.toLocaleString('en-IN')}</strong>
            </span>
          )}
        </div>
      )}

      {/* Main Layout: Sidebar Filters + Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* DESKTOP SIDEBAR FILTER */}
        <aside className="hidden lg:block space-y-6 bg-[#191F1C] border border-[#2A352F] p-5 rounded-2xl h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-[#2A352F]">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Filter className="w-4 h-4 text-emerald-400" />
              <span>Filters</span>
            </h3>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-emerald-400 hover:underline"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Category</label>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                  selectedCategory === 'All' ? 'bg-emerald-500/20 text-emerald-400 font-semibold' : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>All Categories</span>
                {selectedCategory === 'All' && <Check className="w-3.5 h-3.5" />}
              </button>
              {searchResults.facets.categories.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedCategory(c.name)}
                  className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                    selectedCategory === c.name ? 'bg-emerald-500/20 text-emerald-400 font-semibold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <span>{c.name}</span>
                  <span className="text-[10px] text-gray-500 font-mono">({c.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="space-y-2 pt-3 border-t border-[#2A352F]">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Brand</label>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedBrand('All')}
                className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                  selectedBrand === 'All' ? 'bg-emerald-500/20 text-emerald-400 font-semibold' : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>All Brands</span>
                {selectedBrand === 'All' && <Check className="w-3.5 h-3.5" />}
              </button>
              {searchResults.facets.brands.map((b) => (
                <button
                  key={b.name}
                  onClick={() => setSelectedBrand(b.name)}
                  className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                    selectedBrand === b.name ? 'bg-emerald-500/20 text-emerald-400 font-semibold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <span>{b.name}</span>
                  <span className="text-[10px] text-gray-500 font-mono">({b.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Retailer Availability Filter */}
          <div className="space-y-2 pt-3 border-t border-[#2A352F]">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Retailer</label>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedRetailer('All')}
                className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                  selectedRetailer === 'All' ? 'bg-emerald-500/20 text-emerald-400 font-semibold' : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>All Retailers</span>
                {selectedRetailer === 'All' && <Check className="w-3.5 h-3.5" />}
              </button>
              {searchResults.facets.retailers.map((r) => (
                <button
                  key={r.name}
                  onClick={() => setSelectedRetailer(r.name)}
                  className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                    selectedRetailer === r.name ? 'bg-emerald-500/20 text-emerald-400 font-semibold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <span>{r.name}</span>
                  <span className="text-[10px] text-gray-500 font-mono">({r.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2 pt-3 border-t border-[#2A352F]">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Price Range (₹)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="bg-[#101312] border border-[#2A352F] text-xs text-white px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-emerald-500"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="bg-[#101312] border border-[#2A352F] text-xs text-white px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Customer Rating Filter */}
          <div className="space-y-2 pt-3 border-t border-[#2A352F]">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Rating</label>
            <div className="space-y-1 text-xs">
              {[4, 3, 2].map((stars) => (
                <button
                  key={stars}
                  onClick={() => setMinRating(minRating === stars ? 0 : stars)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${
                    minRating === stars ? 'bg-emerald-500/20 text-emerald-400 font-semibold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <span>{stars}★ & above</span>
                  {minRating === stars && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* In Stock Only Toggle */}
          <div className="pt-3 border-t border-[#2A352F]">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded bg-[#101312] border-[#2A352F] text-emerald-500 focus:ring-emerald-500"
              />
              <span>In-Stock Only</span>
            </label>
          </div>

        </aside>

        {/* RESULTS COLUMN */}
        <main className="lg:col-span-3 space-y-6">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#191F1C] border border-[#2A352F]">
            <div>
              <h2 className="font-bold text-white text-base">
                {queryParam ? `Results for "${queryParam}"` : 'All Compared Products'}
              </h2>
              <span className="text-xs text-gray-400">
                Found {searchResults.total_results} matching items across connected stores
              </span>
            </div>

            {/* Mobile Filter Toggle & Sort Dropdown */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden px-3 py-1.5 rounded-xl bg-[#222B26] border border-[#2A352F] text-xs text-gray-300 flex items-center gap-1.5"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>

              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-400 hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#222B26] border border-[#2A352F] text-xs text-gray-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500"
                >
                  <option value="best_price">Lowest Eligible Price</option>
                  <option value="highest_discount">Highest Discount %</option>
                  <option value="rating">Customer Rating</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          {searchResults.products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {searchResults.products.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-[#191F1C] rounded-2xl border border-[#2A352F] space-y-4">
              <SearchIcon className="w-12 h-12 text-gray-500 mx-auto" />
              <h3 className="text-lg font-bold text-white">No products found</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                We couldn't find any products matching your specific query and active filters.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs"
              >
                Clear All Filters
              </button>
            </div>
          )}

        </main>

      </div>

    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400">
        Loading search results...
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
