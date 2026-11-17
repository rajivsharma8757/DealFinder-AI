// src/app/page.tsx - DealFinder AI Home Page
import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  Bot, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  CheckCircle, 
  Layers, 
  Store, 
  CreditCard,
  Tag,
  Smartphone,
  Laptop,
  Headphones,
  Shirt,
  Footprints,
  Utensils,
  Sparkle
} from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import ProductCard from '@/components/ProductCard';
import BankOfferCard from '@/components/BankOfferCard';
import { getAllProducts, BANK_OFFERS, CATEGORIES } from '@/lib/data/catalog';
import { getBestEligiblePrice } from '@/lib/engine/calculator';

export default function HomePage() {
  const allProducts = getAllProducts();
  const deals = [...allProducts]
    .sort((a, b) => getBestEligiblePrice(b).discount_pct - getBestEligiblePrice(a).discount_pct)
    .slice(0, 4);

  const featured = allProducts.slice(0, 6);
  const topOffers = BANK_OFFERS.slice(0, 3);

  const categoryIcons: Record<string, any> = {
    'Mobiles': Smartphone,
    'Laptops': Laptop,
    'Electronics': Headphones,
    'Fashion': Shirt,
    'Footwear': Footprints,
    'Home & Kitchen': Utensils,
    'Beauty': Sparkle,
  };

  return (
    <div className="space-y-20 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-800/80 text-emerald-400 text-xs font-semibold shadow-lg shadow-emerald-950/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation AI Shopping Intelligence</span>
          </div>

          {/* Large Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Find the Best Price <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-500 bg-clip-text text-transparent">
              Before You Buy.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            One intelligent search. 20+ verified stores. Complete price, coupon, and bank offer comparison to find the true lowest eligible purchase price.
          </p>

          {/* Universal Search Box */}
          <div className="pt-4 max-w-3xl mx-auto">
            <SearchBar size="large" />
          </div>

          {/* Category Quick Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="text-xs text-gray-500 mr-1">Popular Categories:</span>
            {CATEGORIES.slice(0, 6).map((cat) => {
              const Icon = categoryIcons[cat.name] || Tag;
              return (
                <Link
                  key={cat.id}
                  href={`/search?category=${encodeURIComponent(cat.name)}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#191F1C] border border-[#2A352F] text-xs text-gray-300 hover:text-white hover:border-emerald-500/40 transition-colors"
                >
                  <Icon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{cat.name}</span>
                </Link>
              );
            })}
          </div>

        </div>
      </section>

      {/* 2. LIVE METRICS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-[#191F1C] border border-[#2A352F]">
          <div className="text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-white">20+</div>
            <div className="text-xs text-gray-400 font-medium">Indian Retailers Monitored</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">100%</div>
            <div className="text-xs text-gray-400 font-medium">Verified Price Feeds</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-white">15,000+</div>
            <div className="text-xs text-gray-400 font-medium">Bank & Coupon Combinations</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">₹1.4 Cr+</div>
            <div className="text-xs text-gray-400 font-medium">Verified Shopper Savings</div>
          </div>
        </div>
      </section>

      {/* 3. TODAY'S BEST DEALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Highest Price Drops</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Today's Super Deals
            </h2>
          </div>
          <Link
            href="/deals"
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <span>View All Deals</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {deals.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 4. AI SHOPPING ASSISTANT PROMO BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#191F1C] via-[#1c2621] to-[#191F1C] border border-emerald-500/30 p-8 sm:p-12 overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-semibold">
              <Bot className="w-4 h-4" />
              <span>Conversational Deal Intelligence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              Ask DealFinder AI anything in English, Hindi, or Hinglish.
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              "Mujhe 60,000 ke andar best laptop batao jisme HDFC card discount lag sake" — our AI parses your budget, matches card offers across 20+ stores, and returns the mathematically best deal.
            </p>
            <div className="pt-2">
              <Link
                href="/assistant"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm transition-all shadow-lg shadow-emerald-500/20"
              >
                <Bot className="w-4 h-4" />
                <span>Chat with AI Shopping Assistant</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-96 rounded-2xl bg-[#101312] border border-[#2A352F] p-4 space-y-3">
            <div className="text-xs font-semibold text-gray-400 border-b border-[#2A352F] pb-2 flex items-center justify-between">
              <span>Live Assistant Demo</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            <div className="text-xs bg-[#191F1C] p-3 rounded-xl text-gray-300 border border-[#2A352F]">
              💬 "Compare iPhone 16 on Amazon vs Croma with HDFC credit card."
            </div>
            <div className="text-xs bg-emerald-950/40 p-3 rounded-xl text-emerald-300 border border-emerald-800/60">
              🤖 "Croma has the lowest effective price at ₹73,999 after ₹3,000 instant HDFC discount, beating Amazon India by ₹1,500!"
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURED MULTI-STORE PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4" />
              <span>Catalog Spotlight</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Featured Price Comparisons
            </h2>
          </div>
          <Link
            href="/search"
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <span>Explore All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 6. BANK OFFERS SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              <CreditCard className="w-4 h-4" />
              <span>Smart Card Stacking</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Active Bank Discounts
            </h2>
          </div>
          <Link
            href="/offers"
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <span>View All Card Offers</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topOffers.map((offer) => (
            <BankOfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      </section>

      {/* 7. HOW IT WORKS 3-STEP GUIDE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            How DealFinder AI Works
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto">
            Three simple steps to never overpay for online shopping in India again.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#191F1C] border border-[#2A352F] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center border border-emerald-500/40">
              1
            </div>
            <h3 className="font-bold text-white text-base">Search Once</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Enter any product name, brand, URL, or natural language prompt (e.g. "phone under 25000").
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#191F1C] border border-[#2A352F] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center border border-emerald-500/40">
              2
            </div>
            <h3 className="font-bold text-white text-base">Multi-Store Aggregation</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Our engines query 20+ verified Indian stores in real time to fetch live MRPs, stock, and delivery times.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#191F1C] border border-[#2A352F] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center border border-emerald-500/40">
              3
            </div>
            <h3 className="font-bold text-white text-base">Net Effective Calculation</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              We mathematically subtract bank card discounts and coupons to rank the lowest true checkout price.
            </p>
          </div>
        </div>
      </section>

      {/* 8. CONNECTED STORES TICKER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
          Supported & Integrated Retailer Ecosystem
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 opacity-75 grayscale hover:grayscale-0 transition-all">
          <span className="text-sm font-bold text-gray-300">Amazon India</span>
          <span className="text-sm font-bold text-gray-300">Flipkart</span>
          <span className="text-sm font-bold text-gray-300">Croma</span>
          <span className="text-sm font-bold text-gray-300">Reliance Digital</span>
          <span className="text-sm font-bold text-gray-300">Myntra</span>
          <span className="text-sm font-bold text-gray-300">AJIO</span>
          <span className="text-sm font-bold text-gray-300">Meesho</span>
          <span className="text-sm font-bold text-gray-300">Tata CLiQ</span>
          <span className="text-sm font-bold text-gray-300">Nykaa</span>
          <span className="text-sm font-bold text-gray-300">JioMart</span>
        </div>
      </section>

    </div>
  );
}
