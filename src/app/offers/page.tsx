// src/app/offers/page.tsx - Bank Offers & Card Intelligence Directory
'use client';

import React, { useState } from 'react';
import { CreditCard, ShieldCheck, Filter, Sparkles, Check } from 'lucide-react';
import { BANK_OFFERS } from '@/lib/data/catalog';
import BankOfferCard from '@/components/BankOfferCard';
import { useApp } from '@/context/AppContext';

export default function OffersPage() {
  const { selectedBank, setSelectedBank } = useApp();
  const [bankFilter, setBankFilter] = useState<string>('All');
  const [retailerFilter, setRetailerFilter] = useState<string>('All');

  const banks = ['All', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'SBI Card', 'Kotak Mahindra Bank', 'IDFC FIRST Bank', 'YES Bank'];
  const retailers = ['All', 'Amazon India', 'Flipkart', 'Croma', 'Reliance Digital', 'Myntra', 'AJIO', 'Tata CLiQ'];

  const filteredOffers = BANK_OFFERS.filter((offer) => {
    if (bankFilter !== 'All' && offer.bank !== bankFilter) return false;
    if (retailerFilter !== 'All' && offer.retailer !== retailerFilter) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-[#191F1C] to-[#191F1C] border border-emerald-500/30 space-y-3 shadow-2xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <CreditCard className="w-3.5 h-3.5" />
          <span>Card Stacking Engine</span>
        </div>
        <h1 className="text-3xl font-black text-white">Bank Offers & Card Intelligence</h1>
        <p className="text-xs sm:text-sm text-gray-400 max-w-xl">
          Instantly apply credit and debit card promotions across leading stores. Select your primary card to automatically calculate true checkout prices across the catalog.
        </p>
      </div>

      {/* Primary Card Selector Banner */}
      <div className="p-5 rounded-2xl bg-[#191F1C] border border-[#2A352F] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-white text-sm">Select Primary Card for Price Deductions:</h3>
          <p className="text-xs text-gray-400">Current active card: <strong className="text-emerald-400">{selectedBank}</strong></p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {banks.filter(b => b !== 'All').map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBank(b)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedBank === b
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                  : 'bg-[#222B26] text-gray-300 hover:text-white border border-[#2A352F]'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-4 p-4 rounded-2xl bg-[#191F1C] border border-[#2A352F]">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-400">Filter by Bank:</span>
          <select
            value={bankFilter}
            onChange={(e) => setBankFilter(e.target.value)}
            className="bg-[#222B26] border border-[#2A352F] text-xs text-white rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500"
          >
            {banks.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-400">Filter by Store:</span>
          <select
            value={retailerFilter}
            onChange={(e) => setRetailerFilter(e.target.value)}
            className="bg-[#222B26] border border-[#2A352F] text-xs text-white rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500"
          >
            {retailers.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOffers.map((offer) => (
          <BankOfferCard key={offer.id} offer={offer} />
        ))}
      </div>

    </div>
  );
}
