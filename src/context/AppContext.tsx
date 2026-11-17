// src/context/AppContext.tsx - Global State Management for DealFinder AI
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PriceAlert, User, UserProfile } from '@/types';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  wishlist: string[];
  toggleWishlist: (productId: string) => Promise<boolean>;
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
  addPriceAlert: (productId: string, productTitle: string, targetPrice: number, currentPrice: number, email?: string) => Promise<boolean>;
  removePriceAlert: (alertId: string) => Promise<boolean>;

  user: User | null;
  profile: UserProfile | null;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  updateProfileState: (updated: UserProfile) => void;

  selectedBank: string;
  setSelectedBank: (bank: string) => void;

  searchModalOpen: boolean;
  setSearchModalOpen: (open: boolean) => void;

  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<string[]>(['prod_iphone_16', 'prod_sony_xm4']);
  const [searchHistory, setSearchHistory] = useState<string[]>([
    'iPhone 16 128GB',
    'Sony WH-1000XM4',
    'Gaming laptop under ₹60,000'
  ]);
  const [comparisonIds, setComparisonIds] = useState<string[]>(['prod_iphone_16', 'prod_samsung_s24_ultra']);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);
  
  // Real authenticated user state
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  const [selectedBank, setSelectedBank] = useState<string>('HDFC Bank');
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast Notification System
  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Check authenticated session from server API
  const refreshAuth = useCallback(async () => {
    try {
      setAuthLoading(true);
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
          setProfile(data.profile || null);
          return;
        }
      }
      setUser(null);
      setProfile(null);
    } catch {
      setUser(null);
      setProfile(null);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // Fetch initial authentication and persistent local data
  useEffect(() => {
    refreshAuth();

    try {
      const savedWishlist = localStorage.getItem('dealfinder_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedHistory = localStorage.getItem('dealfinder_history');
      if (savedHistory) setSearchHistory(JSON.parse(savedHistory));

      const savedComp = localStorage.getItem('dealfinder_compare');
      if (savedComp) setComparisonIds(JSON.parse(savedComp));

      const savedBank = localStorage.getItem('dealfinder_bank');
      if (savedBank) setSelectedBank(savedBank);
    } catch {}
  }, [refreshAuth]);

  // Load user-isolated wishlist and price alerts from server when logged in
  useEffect(() => {
    if (!user) return;

    // Fetch user wishlist
    fetch('/api/user/wishlist')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.wishlistIds)) {
          setWishlist(data.wishlistIds);
          try {
            localStorage.setItem('dealfinder_wishlist', JSON.stringify(data.wishlistIds));
          } catch {}
        }
      })
      .catch(() => {});

    // Fetch user price alerts
    fetch('/api/user/price-alerts')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.alerts)) {
          setPriceAlerts(data.alerts);
        }
      })
      .catch(() => {});
  }, [user]);

  // Wishlist toggle with server synchronization
  const toggleWishlist = async (productId: string): Promise<boolean> => {
    const isCurrentlySaved = wishlist.includes(productId);
    const updated = isCurrentlySaved
      ? wishlist.filter(id => id !== productId)
      : [productId, ...wishlist];

    setWishlist(updated);
    try {
      localStorage.setItem('dealfinder_wishlist', JSON.stringify(updated));
    } catch {}

    const nowAdded = !isCurrentlySaved;
    addToast(nowAdded ? 'Saved to your wishlist' : 'Removed from wishlist', 'info');

    // If logged in, sync with database
    if (user) {
      try {
        await fetch('/api/user/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        });
      } catch {}
    }

    return nowAdded;
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const addSearchHistory = (query: string) => {
    if (!query.trim()) return;
    const trimmed = query.trim();
    setSearchHistory(prev => {
      const filtered = prev.filter(q => q.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 15);
      try {
        localStorage.setItem('dealfinder_history', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    if (user) {
      fetch('/api/user/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmed }),
      }).catch(() => {});
    }
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    try {
      localStorage.removeItem('dealfinder_history');
    } catch {}

    if (user) {
      fetch('/api/user/history', { method: 'DELETE' }).catch(() => {});
    }
  };

  const addToComparison = (productId: string): boolean => {
    if (comparisonIds.includes(productId)) return true;
    if (comparisonIds.length >= 4) {
      addToast('Comparison limit reached (max 4 products)', 'error');
      return false;
    }
    const updated = [...comparisonIds, productId];
    setComparisonIds(updated);
    try {
      localStorage.setItem('dealfinder_compare', JSON.stringify(updated));
    } catch {}
    addToast('Added to comparison matrix', 'success');
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

  const addPriceAlert = async (
    productId: string,
    productTitle: string,
    targetPrice: number,
    currentPrice: number,
    email?: string
  ): Promise<boolean> => {
    const userEmail = email || user?.email || 'shopper@dealfinder.ai';
    try {
      const res = await fetch('/api/user/price-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          product_title: productTitle,
          target_price: targetPrice,
          current_price: currentPrice,
          email: userEmail,
        }),
      });

      const data = await res.json();
      if (data.success && data.alert) {
        setPriceAlerts(prev => [data.alert, ...prev]);
        addToast('Price drop alert registered successfully!', 'success');
        return true;
      }
    } catch {}

    // Fallback local alert
    const newAlert: PriceAlert = {
      id: `alert_${Date.now()}`,
      product_id: productId,
      product_title: productTitle,
      target_price: targetPrice,
      current_price: currentPrice,
      email: userEmail,
      created_at: new Date().toISOString().split('T')[0],
      is_active: true,
    };
    setPriceAlerts(prev => [newAlert, ...prev]);
    addToast('Price alert tracked locally.', 'info');
    return true;
  };

  const removePriceAlert = async (alertId: string): Promise<boolean> => {
    setPriceAlerts(prev => prev.filter(a => a.id !== alertId));
    try {
      await fetch(`/api/user/price-alerts?id=${encodeURIComponent(alertId)}`, {
        method: 'DELETE',
      });
      addToast('Price alert removed', 'info');
      return true;
    } catch {
      return false;
    }
  };

  // Real API-backed login
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        await refreshAuth();
        addToast(`Welcome back, ${data.user.name}!`, 'success');
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Invalid credentials' };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error during login' };
    }
  };

  // Real API-backed signup
  const signup = async (
    name: string,
    email: string,
    password: string,
    phone?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        await refreshAuth();
        addToast(`Account created! Welcome, ${data.user.name}!`, 'success');
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Failed to create account' };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error during registration' };
    }
  };

  // Real API-backed logout
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    setUser(null);
    setProfile(null);
    addToast('Signed out successfully', 'info');
  };

  const updateProfileState = (updated: UserProfile) => {
    setProfile(updated);
    if (user) {
      setUser({ ...user, name: updated.fullName, phone: updated.phone, bio: updated.bio, avatar: updated.avatar });
    }
  };

  const handleSetSelectedBank = (bank: string) => {
    setSelectedBank(bank);
    try {
      localStorage.setItem('dealfinder_bank', bank);
    } catch {}
    addToast(`Card offers optimized for ${bank}`, 'info');
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
        profile,
        authLoading,
        login,
        signup,
        logout,
        refreshAuth,
        updateProfileState,
        selectedBank,
        setSelectedBank: handleSetSelectedBank,
        searchModalOpen,
        setSearchModalOpen,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}

      {/* Global Toast Render Container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-3 rounded-2xl text-xs font-semibold shadow-2xl flex items-center gap-2.5 backdrop-blur-xl border transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-700/80 shadow-emerald-950/50'
                : toast.type === 'error'
                ? 'bg-red-950/90 text-red-300 border-red-700/80 shadow-red-950/50'
                : 'bg-[#191F1C]/95 text-gray-200 border-[#2A352F] shadow-black/50'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                toast.type === 'success' ? 'bg-emerald-400' : toast.type === 'error' ? 'bg-red-400' : 'bg-blue-400'
              }`}
            />
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 text-gray-400 hover:text-white text-sm leading-none"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
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
