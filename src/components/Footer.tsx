// src/components/Footer.tsx - DealFinder AI Comprehensive Footer
import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Zap, Layers, Store, Heart, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[#2A352F] bg-[#101312] text-gray-400 text-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-green-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Sparkles className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                DealFinder <span className="text-emerald-400 text-xs px-1.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-800">AI</span>
              </span>
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
              Next-generation multi-platform shopping intelligence and deal discovery system. Search once, compare real-time prices across 20+ verified Indian retailers, and maximize your savings with automated coupon and bank card offers.
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500 pt-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Retailer Feeds</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Real-Time Price Sync</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Features & Tools</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/deals" className="hover:text-emerald-400 transition-colors">Today's Best Deals</Link></li>
              <li><Link href="/compare" className="hover:text-emerald-400 transition-colors">Multi-Store Comparison</Link></li>
              <li><Link href="/assistant" className="hover:text-emerald-400 transition-colors">AI Shopping Assistant</Link></li>
              <li><Link href="/offers" className="hover:text-emerald-400 transition-colors">Bank Offers Intelligence</Link></li>
              <li><Link href="/coupons" className="hover:text-emerald-400 transition-colors">Verified Coupons</Link></li>
              <li><Link href="/price-alerts" className="hover:text-emerald-400 transition-colors">Price Drop Alerts</Link></li>
            </ul>
          </div>

          {/* Supported Retailers */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Connected Stores</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/stores" className="hover:text-emerald-400 transition-colors">Amazon India</Link></li>
              <li><Link href="/stores" className="hover:text-emerald-400 transition-colors">Flipkart</Link></li>
              <li><Link href="/stores" className="hover:text-emerald-400 transition-colors">Croma & Reliance Digital</Link></li>
              <li><Link href="/stores" className="hover:text-emerald-400 transition-colors">Myntra & AJIO</Link></li>
              <li><Link href="/stores" className="hover:text-emerald-400 transition-colors">Tata CLiQ & Nykaa</Link></li>
              <li><Link href="/stores" className="text-emerald-400 hover:underline flex items-center gap-1">View All 20+ Stores &rarr;</Link></li>
            </ul>
          </div>

          {/* Academic & Platform Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Project & System</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/admin" className="hover:text-emerald-400 transition-colors">Admin Dashboard</Link></li>
              <li><Link href="/admin/providers" className="hover:text-emerald-400 transition-colors">Provider Integrations</Link></li>
              <li><Link href="/history" className="hover:text-emerald-400 transition-colors">Search History</Link></li>
              <li><Link href="/profile" className="hover:text-emerald-400 transition-colors">My Profile & Cards</Link></li>
              <li className="text-[11px] text-gray-500 pt-2">
                B.Tech Final Year CSE Project<br />
                M. M. Engineering College, MM(DU)
              </li>
            </ul>
          </div>

        </div>

        {/* Disclaimer & Bottom Bar */}
        <div className="border-t border-[#2A352F] mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p className="max-w-3xl leading-relaxed">
            © {new Date().getFullYear()} DealFinder AI. All product images, logos, trademarks, and brand names belong to their respective owners. <span className="text-gray-400">Notice: Retailer prices and offers represent indexed catalog benchmarks and demonstration feeds for academic evaluation. Actual purchase prices, bank eligibility, and delivery fees are determined at retailer checkout.</span>
          </p>
          <div className="flex items-center gap-6 flex-shrink-0">
            <span className="text-gray-400 font-medium">Tagline: &quot;Search Once. Compare Everywhere. Save More.&quot;</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
