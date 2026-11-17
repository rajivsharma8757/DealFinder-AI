// src/app/history/page.tsx - Search Query History
'use client';

import React from 'react';
import Link from 'next/link';
import { History, Trash2, Search, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function HistoryPage() {
  const { searchHistory, clearSearchHistory } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      <div className="p-8 rounded-3xl bg-[#191F1C] border border-[#2A352F] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <History className="w-3.5 h-3.5" />
            <span>Activity Log</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Search History</h1>
          <p className="text-xs text-gray-400">Previous searches and comparison lookups.</p>
        </div>

        {searchHistory.length > 0 && (
          <button
            onClick={clearSearchHistory}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-red-400 hover:bg-[#222B26] border border-[#2A352F] transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {searchHistory.length > 0 ? (
        <div className="rounded-3xl bg-[#191F1C] border border-[#2A352F] divide-y divide-[#2A352F] overflow-hidden">
          {searchHistory.map((query, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 flex items-center justify-between hover:bg-[#222B26]/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Search className="w-4 h-4 text-emerald-400" />
                <span className="text-xs sm:text-sm font-semibold text-white">{query}</span>
              </div>
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>Search Again</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#191F1C] rounded-3xl border border-[#2A352F] space-y-3">
          <History className="w-10 h-10 text-gray-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No search history</h3>
          <p className="text-xs text-gray-400">Your recent searches will be saved here automatically.</p>
        </div>
      )}

    </div>
  );
}
