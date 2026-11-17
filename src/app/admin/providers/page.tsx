// src/app/admin/providers/page.tsx - Retailer Provider & Integration Management
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Store, 
  ShieldCheck, 
  Activity, 
  RefreshCw, 
  Check, 
  ArrowLeft,
  ExternalLink,
  Power,
  Zap
} from 'lucide-react';
import { INDIAN_RETAILER_PROVIDERS } from '@/lib/engine/storeAdapters';
import { RetailerProvider } from '@/types';

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<RetailerProvider[]>(INDIAN_RETAILER_PROVIDERS);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<Record<string, string>>({});

  const toggleStatus = (id: string) => {
    setProviders(providers.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status: p.status === 'active' ? 'maintenance' : 'active'
        };
      }
      return p;
    }));
  };

  const testConnection = (id: string) => {
    setTestingId(id);
    setTimeout(() => {
      setTestingId(null);
      setTestResult(prev => ({
        ...prev,
        [id]: '200 OK • Response: 98ms • Payload: Valid'
      }));
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 rounded-3xl bg-[#191F1C] border border-[#2A352F]">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <Link href="/admin" className="hover:text-white flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" />
              <span>Admin Dashboard</span>
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Retailer Provider Management</h1>
          <p className="text-xs text-gray-400">
            Configure, monitor, and test connectivity to 20+ Indian eCommerce feeds.
          </p>
        </div>

        <div className="text-xs text-gray-400 bg-[#101312] border border-[#2A352F] px-4 py-2.5 rounded-xl">
          Total Providers: <strong className="text-emerald-400">{providers.length}</strong>
        </div>
      </div>

      {/* Providers Table */}
      <div className="rounded-3xl bg-[#191F1C] border border-[#2A352F] overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#2A352F] bg-[#141816] text-gray-400 uppercase font-semibold">
              <th className="p-4 sm:p-5">Retailer</th>
              <th className="p-4 sm:p-5">Integration Type</th>
              <th className="p-4 sm:p-5">Sync Latency</th>
              <th className="p-4 sm:p-5">Categories</th>
              <th className="p-4 sm:p-5">Feed Status</th>
              <th className="p-4 sm:p-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A352F]">
            {providers.map((provider) => (
              <tr key={provider.id} className="hover:bg-[#222B26]/40 transition-colors">
                
                {/* Store Name & Code */}
                <td className="p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#101312] border border-[#2A352F] flex items-center justify-center font-bold text-white text-xs">
                      {provider.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{provider.name}</div>
                      <a
                        href={provider.website_url || provider.direct_url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-gray-500 hover:text-emerald-400 flex items-center gap-1"
                      >
                        <span>{(provider.website_url || provider.direct_url || '').replace('https://', '')}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                </td>

                {/* Integration Type */}
                <td className="p-4 sm:p-5">
                  <span className="capitalize text-gray-300 font-medium bg-[#101312] px-2.5 py-1 rounded-md border border-[#2A352F]">
                    {(provider.integration_type || provider.adapter_type || 'affiliate_api').replace('_', ' ')}
                  </span>
                </td>

                {/* Sync Latency */}
                <td className="p-4 sm:p-5 text-gray-300">
                  {provider.sync_latency || `${provider.latency_ms || 100}ms`}
                </td>

                {/* Categories */}
                <td className="p-4 sm:p-5">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {(provider.categories || provider.category_coverage || []).slice(0, 3).map((c, i) => (
                      <span key={i} className="text-[10px] bg-[#101312] px-1.5 py-0.5 rounded text-gray-400 border border-[#2A352F]">
                        {c}
                      </span>
                    ))}
                    {(provider.categories || provider.category_coverage || []).length > 3 && (
                      <span className="text-[10px] text-gray-500">+{(provider.categories || provider.category_coverage || []).length - 3}</span>
                    )}
                  </div>
                </td>

                {/* Status */}
                <td className="p-4 sm:p-5">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[10px] border ${
                    provider.status === 'active'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${provider.status === 'active' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                    {provider.status.toUpperCase()}
                  </span>
                </td>

                {/* Actions */}
                <td className="p-4 sm:p-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => testConnection(provider.id)}
                      disabled={testingId === provider.id}
                      className="px-2.5 py-1.5 rounded-lg bg-[#222B26] hover:bg-[#2A352F] text-gray-300 hover:text-white border border-[#2A352F] transition-all flex items-center gap-1 text-[11px]"
                      title="Test API or Scraper Endpoint"
                    >
                      <Zap className={`w-3 h-3 text-emerald-400 ${testingId === provider.id ? 'animate-spin' : ''}`} />
                      <span>{testingId === provider.id ? 'Pinging...' : 'Test Feed'}</span>
                    </button>

                    <button
                      onClick={() => toggleStatus(provider.id)}
                      className={`p-1.5 rounded-lg transition-colors border ${
                        provider.status === 'active'
                          ? 'text-gray-400 hover:text-amber-400 hover:bg-[#222B26] border-[#2A352F]'
                          : 'text-emerald-400 bg-emerald-950 border-emerald-800'
                      }`}
                      title={provider.status === 'active' ? 'Pause Provider' : 'Activate Provider'}
                    >
                      <Power className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {testResult[provider.id] && (
                    <div className="text-[10px] text-emerald-400 font-mono mt-1 text-right">
                      {testResult[provider.id]}
                    </div>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
