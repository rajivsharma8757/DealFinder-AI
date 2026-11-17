// src/components/PriceAlertModal.tsx - Set Target Price Drop Notification
'use client';

import React, { useState } from 'react';
import { Bell, X, Check, ShieldCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface PriceAlertModalProps {
  productId: string;
  productTitle: string;
  currentPrice: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function PriceAlertModal({
  productId,
  productTitle,
  currentPrice,
  isOpen,
  onClose
}: PriceAlertModalProps) {
  const { addPriceAlert, user } = useApp();
  const [targetPrice, setTargetPrice] = useState(Math.round(currentPrice * 0.9));
  const [email, setEmail] = useState(user?.email || '');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPrice || targetPrice >= currentPrice) return;
    addPriceAlert(productId, productTitle, Number(targetPrice), currentPrice, email);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-[#191F1C] border border-[#2A352F] p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#222B26] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Price Alert Created!</h3>
            <p className="text-xs text-gray-400">
              We will notify you at <strong className="text-emerald-400">{email}</strong> as soon as the price drops to or below ₹{targetPrice.toLocaleString('en-IN')}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <Bell className="w-5 h-5" />
              <h3 className="font-bold text-white text-base">Set Price Drop Alert</h3>
            </div>
            
            <p className="text-xs text-gray-400 line-clamp-2">
              For: <span className="text-gray-200 font-medium">{productTitle}</span>
            </p>

            <div className="bg-[#101312] p-3 rounded-xl border border-[#2A352F] text-xs">
              <span className="text-gray-500">Current Lowest Eligible Price: </span>
              <span className="font-bold text-white">₹{currentPrice.toLocaleString('en-IN')}</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Notify me when price drops to (₹)
              </label>
              <input
                type="number"
                value={targetPrice}
                onChange={(e) => setTargetPrice(Number(e.target.value))}
                max={currentPrice - 1}
                min={100}
                required
                className="w-full rounded-xl bg-[#101312] border border-[#2A352F] px-4 py-2.5 text-white font-semibold focus:outline-none focus:border-emerald-500 text-sm"
              />
              <span className="text-[11px] text-gray-500 mt-1 block">
                Recommended target: ₹{Math.round(currentPrice * 0.9).toLocaleString('en-IN')} (10% drop)
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Your Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl bg-[#101312] border border-[#2A352F] px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 text-sm"
              />
            </div>

            <div className="flex items-center gap-2 text-[11px] text-gray-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>We check store feeds every 15 minutes. No spam.</span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white hover:bg-[#222B26]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-lg shadow-emerald-500/20"
              >
                Create Alert
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
