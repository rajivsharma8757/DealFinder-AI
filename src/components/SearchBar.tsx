// src/components/SearchBar.tsx - Universal Search with Voice, NL Queries & Instant Suggestions
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Mic, X, ArrowRight, Sparkles, TrendingUp, History } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { TRENDING_SEARCHES } from '@/lib/engine/search';

interface SearchBarProps {
  initialQuery?: string;
  size?: 'normal' | 'large';
  placeholder?: string;
}

export default function SearchBar({
  initialQuery = '',
  size = 'normal',
  placeholder = 'Search products, brands, or budget (e.g. "phone under 25000", "running shoes")...'
}: SearchBarProps) {
  const router = useRouter();
  const { searchHistory, addSearchHistory, clearSearchHistory } = useApp();
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync with prop if it changes
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  // Handle outside click to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchTerm: string) => {
    const q = searchTerm.trim();
    if (!q) return;
    addSearchHistory(q);
    setIsFocused(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      // Simulate voice input fallback
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        const voiceSample = 'iPhone 16 128GB';
        setQuery(voiceSample);
        handleSearch(voiceSample);
      }, 1500);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
        handleSearch(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const isLarge = size === 'large';

  return (
    <div ref={containerRef} className="relative w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch(query);
        }}
        className={`relative flex items-center w-full rounded-2xl bg-[#191F1C] border transition-all duration-300 ${
          isFocused 
            ? 'border-emerald-500 shadow-xl shadow-emerald-950/30' 
            : 'border-[#2A352F] hover:border-[#3B4B42]'
        } ${isLarge ? 'p-2' : 'p-1.5'}`}
      >
        <div className="pl-3 text-gray-400">
          <Search className={`${isLarge ? 'w-6 h-6' : 'w-5 h-5'} ${isFocused ? 'text-emerald-400' : ''}`} />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className={`w-full bg-transparent border-none text-white focus:outline-none px-3 font-medium placeholder-gray-500 ${
            isLarge ? 'text-base sm:text-lg' : 'text-sm'
          }`}
        />

        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Voice Search Button */}
        <button
          type="button"
          onClick={handleVoiceSearch}
          className={`p-2 rounded-xl transition-all ${
            isListening 
              ? 'bg-red-500 text-white animate-pulse' 
              : 'text-gray-400 hover:text-emerald-400 hover:bg-[#222B26]'
          }`}
          title="Voice Search"
        >
          <Mic className="w-4 h-4" />
        </button>

        {/* Submit Search Button */}
        <button
          type="submit"
          className={`rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-black font-bold flex items-center justify-center transition-all hover:scale-[1.02] shadow-lg shadow-emerald-500/20 ${
            isLarge ? 'px-6 py-3 text-sm' : 'px-4 py-2 text-xs'
          }`}
        >
          <span className="hidden sm:inline mr-1">Compare</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Dropdown Suggestions */}
      {isFocused && (
        <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-[#191F1C] border border-[#2A352F] shadow-2xl p-4 z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Recent Search History */}
          {searchHistory.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-2 px-1">
                <span className="flex items-center gap-1.5 font-semibold text-gray-300">
                  <History className="w-3.5 h-3.5 text-gray-400" /> Recent Searches
                </span>
                <button
                  type="button"
                  onClick={clearSearchHistory}
                  className="text-[11px] text-gray-500 hover:text-red-400"
                >
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {searchHistory.slice(0, 5).map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setQuery(item);
                      handleSearch(item);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#222B26] hover:bg-[#2A352F] text-xs text-gray-300 hover:text-white border border-[#2A352F] transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trending Searches */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-2 px-1">
              <TrendingUp className="w-3.5 h-3.5" /> Trending Searches
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TRENDING_SEARCHES.slice(0, 6).map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setQuery(item);
                    handleSearch(item);
                  }}
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#141816] hover:bg-[#222B26] text-xs text-gray-300 hover:text-white text-left transition-colors border border-transparent hover:border-[#2A352F]"
                >
                  <span className="truncate">{item}</span>
                  <ArrowRight className="w-3 h-3 text-gray-500" />
                </button>
              ))}
            </div>
          </div>

          {/* Natural Language Prompt Tips */}
          <div className="mt-4 pt-3 border-t border-[#2A352F] flex items-center justify-between text-[11px] text-gray-500">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              Tip: Try searching with budget (e.g., "laptop under 60000" or "shoes below 3k")
            </span>
          </div>

        </div>
      )}
    </div>
  );
}
