// src/context/AppContext.tsx - Global State Management for DealFinder AI
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { PriceAlert, User } from '@/types';

interface AppContextType {
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  searchHistory: string[];
  addSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;

  comparisonIds: string[];
  addToComparison: (productId: string) => boolean;
  removeFromComparison: (productId: string) => void;
  clearComparison: () => void;
  isInComparison: (productId: string) => boolean;

  priceAlerts: PriceAlert[];
  addPriceAlert: (productId: string, productTitle: string, targetPrice: number, currentPrice: number, email?: string) => void;
  removePriceAlert: (alertId: string) => void;

  user: User | null;
  login: (name: string, email: string) => void;
  logout: () => void;

  selectedBank: string;
  setSelectedBank: (bank: string) => void;

  searchModalOpen: boolean;
  setSearchModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<string[]>(['prod_iphone16_128', 'prod_sony_wh1000xm5']);
  const [searchHistory, setSearchHistory] = useState<string[]>([
    'iPhone 16 128GB',
    'Sony WH-1000XM5',
    'Gaming laptop under ₹60,000'
  ]);
  const [comparisonIds, setComparisonIds] = useState<string[]>(['prod_iphone16_128', 'prod_samsung_s24_ultra']);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([
    {
      id: 'alert_1',
      product_id: 'prod_iphone16_128',
      product_title: 'Apple iPhone 16 (128 GB) - Ultramarine',
      target_price: 72000,
      current_price: 76999,
      email: 'rajiv.sharma@example.com',
      created_at: '2026-11-10',
      is_active: true
    }
  ]);
  const [user, setUser] = useState<User | null>({
    id: 'usr_demo_1',
    name: 'Rajiv Sharma',
    email: 'rajiv.sharma@dealfinder.ai',
    saved_cards: [
      { id: 'c1', bank_name: 'HDFC Bank', card_type: 'credit_card', last4: '4821' },
      { id: 'c2', bank_name: 'ICICI Bank', card_type: 'credit_card', last4: '9012' }
    ],
    role: 'user'
  });
  const [selectedBank, setSelectedBank] = useState<string>('HDFC Bank');
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);

  // Load persisted state from localStorage on client mount
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem('dealfinder_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedHistory = localStorage.getItem('dealfinder_history');
      if (savedHistory) setSearchHistory(JSON.parse(savedHistory));

      const savedComp = localStorage.getItem('dealfinder_compare');
      if (savedComp) setComparisonIds(JSON.parse(savedComp));

      const savedAlerts = localStorage.getItem('dealfinder_alerts');
      if (savedAlerts) setPriceAlerts(JSON.parse(savedAlerts));

      const savedBank = localStorage.getItem('dealfinder_bank');
      if (savedBank) setSelectedBank(savedBank);
    } catch {
      // ignore in SSR or restricted environments
    }
  }, []);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const updated = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      try {
        localStorage.setItem('dealfinder_wishlist', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const addSearchHistory = (query: string) => {
    if (!query.trim()) return;
    setSearchHistory(prev => {
      const filtered = prev.filter(q => q.toLowerCase() !== query.toLowerCase());
      const updated = [query.trim(), ...filtered].slice(0, 10);
      try {
        localStorage.setItem('dealfinder_history', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    try {
      localStorage.removeItem('dealfinder_history');
    } catch {}
  };

  const addToComparison = (productId: string): boolean => {
    if (comparisonIds.includes(productId)) return true;
    if (comparisonIds.length >= 4) {
      return false; // Maximum 4 products can be compared at once
    }
    const updated = [...comparisonIds, productId];
    setComparisonIds(updated);
    try {
      localStorage.setItem('dealfinder_compare', JSON.stringify(updated));
    } catch {}
    return true;
  };

  const removeFromComparison = (productId: string) => {
    const updated = comparisonIds.filter(id => id !== productId);
    setComparisonIds(updated);
    try {
      localStorage.setItem('dealfinder_compare', JSON.stringify(updated));
    } catch {}
  };

  const clearComparison = () => {
    setComparisonIds([]);
    try {
      localStorage.removeItem('dealfinder_compare');
    } catch {}
  };

  const isInComparison = (productId: string) => comparisonIds.includes(productId);

  const addPriceAlert = (productId: string, productTitle: string, targetPrice: number, currentPrice: number, email?: string) => {
    const newAlert: PriceAlert = {
      id: `alert_${Date.now()}`,
      product_id: productId,
      product_title: productTitle,
      target_price: targetPrice,
      current_price: currentPrice,
      email: email || user?.email || 'shopper@dealfinder.ai',
      created_at: new Date().toISOString().split('T')[0],
      is_active: true
    };
    const updated = [newAlert, ...priceAlerts];
    setPriceAlerts(updated);
    try {
      localStorage.setItem('dealfinder_alerts', JSON.stringify(updated));
    } catch {}
  };

  const removePriceAlert = (alertId: string) => {
    const updated = priceAlerts.filter(a => a.id !== alertId);
    setPriceAlerts(updated);
    try {
      localStorage.setItem('dealfinder_alerts', JSON.stringify(updated));
    } catch {}
  };

  const login = (name: string, email: string) => {
    setUser({
      id: `usr_${Date.now()}`,
      name,
      email,
      saved_cards: [
        { id: 'c1', bank_name: 'HDFC Bank', card_type: 'credit_card', last4: '4821' },
        { id: 'c2', bank_name: 'Axis Bank', card_type: 'credit_card', last4: '1099' }
      ],
      role: 'user'
    });
  };

  const logout = () => {
    setUser(null);
  };

  const handleSetSelectedBank = (bank: string) => {
    setSelectedBank(bank);
    try {
      localStorage.setItem('dealfinder_bank', bank);
    } catch {}
  };

  return (
    <AppContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isInWishlist,
        searchHistory,
        addSearchHistory,
        clearSearchHistory,
        comparisonIds,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isInComparison,
        priceAlerts,
        addPriceAlert,
        removePriceAlert,
        user,
        login,
        logout,
        selectedBank,
        setSelectedBank: handleSetSelectedBank,
        searchModalOpen,
        setSearchModalOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
