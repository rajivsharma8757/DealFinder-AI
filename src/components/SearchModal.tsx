// src/components/SearchModal.tsx - Global Quick Search Modal Popup (Ctrl+K)
'use client';

import React, { useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import SearchBar from './SearchBar';
import { X } from 'lucide-react';

export default function SearchModal() {
  const { searchModalOpen, setSearchModalOpen } = useApp();

  // Listen for Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(!searchModalOpen);
      } else if (e.key === 'Escape' && searchModalOpen) {
        setSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchModalOpen, setSearchModalOpen]);

  if (!searchModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl">
        <button
          onClick={() => setSearchModalOpen(false)}
          className="absolute -top-12 right-0 p-2 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>
        <SearchBar size="large" />
      </div>
    </div>
  );
}
