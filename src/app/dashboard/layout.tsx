// src/app/dashboard/layout.tsx - User Dashboard Shell with Navigation Sidebar
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  User, 
  Heart, 
  Bell, 
  Layers, 
  History, 
  CreditCard, 
  LogOut, 
  ShieldCheck, 
  Bot,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, logout, wishlist, priceAlerts, comparisonIds } = useApp();
  const [showSignoutModal, setShowSignoutModal] = useState(false);

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', href: '/dashboard/profile', icon: User, badge: profile ? `${profile.completionPct}%` : undefined },
    { name: 'Saved Wishlist', href: '/wishlist', icon: Heart, count: wishlist.length },
    { name: 'Price Alerts', href: '/price-alerts', icon: Bell, count: priceAlerts.length },
    { name: 'Comparisons', href: '/compare', icon: Layers, count: comparisonIds.length },
    { name: 'Search History', href: '/history', icon: History },
    { name: 'AI Shopping Assistant', href: '/assistant', icon: Bot, isSpecial: true },
  ];

  const handleConfirmLogout = async () => {
    setShowSignoutModal(false);
    await logout();
    router.push('/login');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Mobile Bar */}
      <div className="lg:hidden mb-6 flex items-center justify-between p-4 bg-[#191F1C] border border-[#2A352F] rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold flex items-center justify-center">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">{user?.name || 'Shopper Dashboard'}</h2>
            <p className="text-[11px] text-gray-400">{user?.email || 'Logged In'}</p>
          </div>
        </div>

        <button
          onClick={() => setShowSignoutModal(true)}
          className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-[#222B26] border border-[#2A352F]"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:block space-y-6">
          
          {/* User Card */}
          <div className="p-6 rounded-3xl bg-[#191F1C] border border-[#2A352F] space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 via-green-500 to-emerald-400 text-black font-black text-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden">
                <h3 className="font-bold text-white text-sm truncate">{user?.name || 'Shopper'}</h3>
                <p className="text-xs text-gray-400 truncate">{user?.email || 'shopper@dealfinder.ai'}</p>
                <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Verified Shopper
                </span>
              </div>
            </div>

            {/* Profile Completion Indicator */}
            {profile && (
              <div className="space-y-1.5 pt-3 border-t border-[#2A352F]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 text-[11px]">Profile Setup</span>
                  <span className="text-emerald-400 font-bold text-[11px]">{profile.completionPct}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#101312] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-500"
                    style={{ width: `${profile.completionPct}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-3 rounded-3xl bg-[#191F1C] border border-[#2A352F] space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                    item.isSpecial
                      ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 hover:bg-emerald-900/40'
                      : isActive
                      ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20 font-bold'
                      : 'text-gray-300 hover:text-white hover:bg-[#222B26]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>

                  {item.count !== undefined && item.count > 0 && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-black text-emerald-400' : 'bg-[#222B26] text-gray-300 border border-[#2A352F]'
                    }`}>
                      {item.count}
                    </span>
                  )}

                  {item.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-black text-emerald-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Sign Out Button in Nav */}
            <div className="pt-2 border-t border-[#2A352F]">
              <button
                type="button"
                onClick={() => setShowSignoutModal(true)}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-gray-400 hover:text-red-400 hover:bg-red-950/30 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </nav>

        </aside>

        {/* MAIN DASHBOARD CONTENT AREA */}
        <main className="lg:col-span-3">
          {children}
        </main>

      </div>

      {/* Sign Out Confirmation Modal */}
      {showSignoutModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-[#191F1C] border border-[#2A352F] p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-950/60 border border-red-800 text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-white">Sign Out of DealFinder AI?</h3>
              <p className="text-xs text-gray-400">
                You will need to sign in again to view your saved comparisons and price drop alerts.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSignoutModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#222B26] hover:bg-[#2A352F] text-xs font-bold text-gray-300 border border-[#2A352F] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold text-xs transition-colors shadow-lg shadow-red-500/20"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
