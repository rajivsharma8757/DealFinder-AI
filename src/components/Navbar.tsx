// src/components/Navbar.tsx - DealFinder AI Main Navigation Header
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Search, 
  Heart, 
  Layers, 
  CreditCard, 
  Tag, 
  Bot, 
  Store, 
  User as UserIcon, 
  Menu, 
  X, 
  ChevronDown,
  LayoutDashboard,
  Bell,
  LogOut,
  UserCheck
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { wishlist, comparisonIds, user, profile, logout, selectedBank, setSelectedBank, setSearchModalOpen } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bankDropdownOpen, setBankDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const bankMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (bankMenuRef.current && !bankMenuRef.current.contains(event.target as Node)) {
        setBankDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Deals', href: '/deals', badge: 'Hot' },
    { name: 'Compare', href: '/compare', badge: comparisonIds.length > 0 ? `${comparisonIds.length}` : undefined },
    { name: 'Categories', href: '/categories' },
    { name: 'Stores', href: '/stores' },
    { name: 'Bank Offers', href: '/offers' },
    { name: 'Coupons', href: '/coupons' },
    { name: 'AI Assistant', href: '/assistant', isSpecial: true },
  ];

  const availableBanks = [
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'SBI Card',
    'Kotak Mahindra Bank',
    'IDFC FIRST Bank',
    'None (Regular MRP)'
  ];

  const handleSignOut = async () => {
    setUserDropdownOpen(false);
    await logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#2A352F] bg-[#101312]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-green-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-black" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                  DealFinder <span className="text-emerald-400 text-xs px-1.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-800">AI</span>
                </span>
                <span className="hidden sm:block text-[10px] text-gray-400 -mt-1 tracking-wider uppercase">
                  Search Once. Compare Everywhere.
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors relative flex items-center gap-1.5 ${
                      link.isSpecial
                        ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 hover:bg-emerald-900/60'
                        : isActive
                        ? 'text-white bg-[#222B26] border border-[#2A352F]'
                        : 'text-gray-300 hover:text-white hover:bg-[#191F1C]'
                    }`}
                  >
                    {link.isSpecial && <Bot className="w-4 h-4 text-emerald-400 animate-pulse" />}
                    {link.name}
                    {link.badge && (
                      <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full ${
                        link.name === 'Deals' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2.5">
            
            {/* Quick Search Button */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#191F1C] border border-[#2A352F] text-gray-400 hover:text-white hover:border-emerald-500/40 transition-all text-sm group"
              title="Search products across 20+ stores (Ctrl+K)"
            >
              <Search className="w-4 h-4 text-gray-400 group-hover:text-emerald-400 transition-colors" />
              <span className="hidden md:inline text-xs">Search stores...</span>
              <kbd className="hidden md:inline text-[10px] font-mono bg-[#222B26] border border-gray-700 px-1.5 py-0.5 rounded text-gray-400">
                ⌘K
              </kbd>
            </button>

            {/* Bank Card Active Selector */}
            <div ref={bankMenuRef} className="relative hidden xl:block">
              <button
                onClick={() => setBankDropdownOpen(!bankDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#191F1C] border border-[#2A352F] text-xs text-gray-300 hover:border-emerald-500/40 transition-colors"
              >
                <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                <span className="max-w-[110px] truncate">{selectedBank}</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {bankDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-52 bg-[#191F1C] border border-[#2A352F] rounded-2xl shadow-2xl py-2 z-50"
                >
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider border-b border-[#2A352F]">
                    Optimize Card Offers
                  </div>
                  {availableBanks.map((bank) => (
                    <button
                      key={bank}
                      onClick={() => {
                        setSelectedBank(bank);
                        setBankDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#222B26] transition-colors ${
                        selectedBank === bank ? 'text-emerald-400 font-medium' : 'text-gray-300'
                      }`}
                    >
                      <span>{bank}</span>
                      {selectedBank === bank && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="relative p-2 rounded-lg bg-[#191F1C] border border-[#2A352F] text-gray-300 hover:text-white hover:border-pink-500/40 transition-colors"
              title="Saved Wishlist"
            >
              <Heart className="w-4 h-4 text-gray-300 hover:text-pink-400 transition-colors" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Comparison Matrix Link */}
            <Link
              href="/compare"
              className="relative p-2 rounded-lg bg-[#191F1C] border border-[#2A352F] text-gray-300 hover:text-white hover:border-emerald-500/40 transition-colors"
              title="Side-by-Side Comparison"
            >
              <Layers className="w-4 h-4 text-gray-300 hover:text-emerald-400 transition-colors" />
              {comparisonIds.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-black text-[10px] font-bold flex items-center justify-center">
                  {comparisonIds.length}
                </span>
              )}
            </Link>

            {/* AUTH STATE: LOGGED IN vs LOGGED OUT */}
            {user ? (
              <div ref={userMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-[#191F1C] border border-[#2A352F] hover:border-emerald-500/50 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg overflow-hidden bg-gradient-to-tr from-emerald-600 to-green-400 text-black font-black text-xs flex items-center justify-center shadow-md">
                    {profile?.avatar || user.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={profile?.avatar || user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      user.name.charAt(0) || 'U'
                    )}
                  </div>
                  <span className="text-xs font-semibold text-gray-200 hidden sm:inline max-w-[90px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>

                {/* User Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-[#191F1C] border border-[#2A352F] rounded-2xl shadow-2xl p-2 z-50 backdrop-blur-xl animate-in fade-in duration-150">
                    <div className="p-3 border-b border-[#2A352F] space-y-0.5">
                      <div className="text-xs font-bold text-white truncate">{user.name}</div>
                      <div className="text-[11px] text-gray-400 truncate">{user.email}</div>
                    </div>

                    <div className="py-1 space-y-0.5 text-xs">
                      <Link
                        href="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-[#222B26] transition-colors"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Dashboard Overview</span>
                      </Link>

                      <Link
                        href="/dashboard/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-[#222B26] transition-colors"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>My Profile & Settings</span>
                      </Link>

                      <Link
                        href="/wishlist"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-[#222B26] transition-colors"
                      >
                        <Heart className="w-3.5 h-3.5 text-pink-400" />
                        <span>Saved Wishlist ({wishlist.length})</span>
                      </Link>

                      <Link
                        href="/price-alerts"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-[#222B26] transition-colors"
                      >
                        <Bell className="w-3.5 h-3.5 text-amber-400" />
                        <span>Price Drop Alerts</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-[#2A352F]">
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-950/30 transition-colors text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-[#191F1C] border border-[#2A352F] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-black font-bold text-xs transition-all shadow-md shadow-emerald-500/20"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-[#191F1C] border border-[#2A352F] text-gray-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#2A352F] bg-[#101312] px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-gray-200 hover:bg-[#191F1C]"
            >
              <span className="flex items-center gap-2">
                {link.isSpecial && <Bot className="w-4 h-4 text-emerald-400" />}
                {link.name}
              </span>
              {link.badge && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
          <div className="pt-3 border-t border-[#2A352F] flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs text-emerald-400 px-3 py-1.5 font-bold"
                >
                  Go to Dashboard &rarr;
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-xs text-red-400 px-3 py-1.5 text-left font-semibold"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2 px-3 py-1.5">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 rounded-xl bg-[#191F1C] border border-[#2A352F] text-xs font-semibold text-white"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 rounded-xl bg-emerald-500 text-black text-xs font-bold"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
