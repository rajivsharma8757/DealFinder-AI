// src/app/profile/page.tsx - User Settings & Card Optimization Preferences
'use client';

import React, { useState } from 'react';
import { User, CreditCard, ShieldCheck, Check, Plus, Trash2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function ProfilePage() {
  const { user, selectedBank, setSelectedBank, logout } = useApp();
  const [cards, setCards] = useState([
    { id: '1', bank: 'HDFC Bank', type: 'Credit Card', last4: '4821' },
    { id: '2', bank: 'ICICI Bank', type: 'Credit Card', last4: '9012' },
    { id: '3', bank: 'Axis Bank', type: 'Debit Card', last4: '3341' }
  ]);
  const [newBank, setNewBank] = useState('SBI Card');

  const addCard = () => {
    if (!newBank) return;
    const newCard = {
      id: `${Date.now()}`,
      bank: newBank,
      type: 'Credit Card',
      last4: `${Math.floor(1000 + Math.random() * 9000)}`
    };
    setCards([...cards, newCard]);
  };

  const removeCard = (id: string) => {
    setCards(cards.filter(c => c.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Profile Header */}
      <div className="p-8 rounded-3xl bg-[#191F1C] border border-[#2A352F] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-black text-2xl flex items-center justify-center">
            {user?.name?.charAt(0) || 'R'}
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">{user?.name || 'Rajiv Sharma'}</h1>
            <p className="text-xs text-gray-400">{user?.email || 'rajiv.sharma@dealfinder.ai'}</p>
            <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              Verified Shopper
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-red-400 hover:bg-[#222B26] border border-[#2A352F] transition-colors"
        >
          Sign Out
        </button>
      </div>

      {/* Payment Card Stacking Engine Settings */}
      <div className="p-8 rounded-3xl bg-[#191F1C] border border-[#2A352F] space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-400" />
            <span>Saved Bank Cards for Auto-Discount Stacking</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Choose which card to apply by default across multi-store price calculations.
          </p>
        </div>

        <div className="space-y-3">
          {cards.map((c) => {
            const isSelected = selectedBank === c.bank;
            return (
              <div
                key={c.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                  isSelected 
                    ? 'bg-emerald-950/30 border-emerald-500' 
                    : 'bg-[#101312] border-[#2A352F] hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#191F1C] border border-[#2A352F] flex items-center justify-center text-emerald-400">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{c.bank}</h4>
                    <span className="text-[11px] text-gray-400">{c.type} •••• {c.last4}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedBank(c.bank)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-emerald-500 text-black'
                        : 'bg-[#222B26] text-gray-300 hover:text-white border border-[#2A352F]'
                    }`}
                  >
                    {isSelected ? 'Active Default' : 'Set as Default'}
                  </button>

                  <button
                    onClick={() => removeCard(c.id)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Card */}
        <div className="pt-4 border-t border-[#2A352F] flex items-center gap-3">
          <select
            value={newBank}
            onChange={(e) => setNewBank(e.target.value)}
            className="bg-[#101312] border border-[#2A352F] text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
          >
            <option value="SBI Card">SBI Card</option>
            <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
            <option value="IDFC FIRST Bank">IDFC FIRST Bank</option>
            <option value="YES Bank">YES Bank</option>
            <option value="Bank of Baroda">Bank of Baroda</option>
          </select>

          <button
            onClick={addCard}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add Bank Card</span>
          </button>
        </div>
      </div>

    </div>
  );
}
