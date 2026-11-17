// src/app/categories/page.tsx - Category & Subcategory Directory
import React from 'react';
import Link from 'next/link';
import { 
  Smartphone, 
  Laptop, 
  Headphones, 
  Shirt, 
  Footprints, 
  Utensils, 
  Sparkles, 
  ArrowRight,
  Layers
} from 'lucide-react';
import { CATEGORIES, getAllProducts } from '@/lib/data/catalog';

export default function CategoriesPage() {
  const allProducts = getAllProducts();

  const iconMap: Record<string, any> = {
    'Mobiles': Smartphone,
    'Laptops': Laptop,
    'Electronics': Headphones,
    'Fashion': Shirt,
    'Footwear': Footprints,
    'Home & Kitchen': Utensils,
    'Beauty': Sparkles,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Banner */}
      <div className="p-8 rounded-3xl bg-[#191F1C] border border-[#2A352F] space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <Layers className="w-3.5 h-3.5" />
          <span>Product Classification</span>
        </div>
        <h1 className="text-3xl font-black text-white">Browse Categories</h1>
        <p className="text-xs sm:text-sm text-gray-400 max-w-xl">
          Explore products organized by category and subcategory across verified Indian online stores.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((cat) => {
          const Icon = iconMap[cat.name] || Layers;
          const count = allProducts.filter(p => p.category === cat.name).length;

          return (
            <div
              key={cat.id}
              className="rounded-2xl bg-[#191F1C] border border-[#2A352F] hover:border-emerald-500/40 p-6 transition-all duration-300 flex flex-col justify-between hover:shadow-xl group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-800/80 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#222B26] text-gray-400 border border-[#2A352F]">
                    {count} Products
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors mb-2">
                  {cat.name}
                </h3>

                {/* Subcategories */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {cat.subcategories.map((sub, idx) => (
                    <Link
                      key={idx}
                      href={`/search?category=${encodeURIComponent(cat.name)}&q=${encodeURIComponent(sub)}`}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-[#101312] text-gray-300 hover:text-white border border-[#2A352F] hover:border-emerald-500/40 transition-colors"
                    >
                      {sub}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href={`/search?category=${encodeURIComponent(cat.name)}`}
                className="pt-4 border-t border-[#2A352F] flex items-center justify-between text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <span>Compare {cat.name} Prices</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          );
        })}
      </div>

    </div>
  );
}
