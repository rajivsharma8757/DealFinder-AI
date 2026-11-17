// src/components/BankOfferCard.tsx - Bank Card Offer Display Card
import React from 'react';
import { CreditCard, Calendar, ShieldCheck, Tag } from 'lucide-react';
import { BankOffer } from '@/types';

interface BankOfferCardProps {
  offer: BankOffer;
}

export default function BankOfferCard({ offer }: BankOfferCardProps) {
  return (
    <div className="rounded-2xl bg-[#191F1C] border border-[#2A352F] hover:border-emerald-500/40 p-5 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-emerald-950/20">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-800/80 flex items-center justify-center text-emerald-400">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">{offer.bank}</h4>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider">{offer.card_type.replace('_', ' ')}</span>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-[#222B26] border border-[#2A352F] text-gray-300 font-medium">
            {offer.retailer}
          </span>
        </div>

        {/* Offer Terms */}
        <p className="text-xs text-gray-300 font-medium mb-3 leading-relaxed">
          {offer.terms}
        </p>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-2 text-xs bg-[#101312] p-3 rounded-xl border border-[#2A352F] mb-3">
          <div>
            <div className="text-[10px] text-gray-500">Max Discount</div>
            <div className="font-bold text-emerald-400 text-sm">
              ₹{offer.max_discount.toLocaleString('en-IN')}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500">Min Purchase</div>
            <div className="font-bold text-gray-300 text-sm">
              ₹{offer.min_purchase.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-[#2A352F] flex items-center justify-between text-[11px] text-gray-500">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3 text-gray-400" />
          Valid till {offer.expiry}
        </span>
        <span className="text-emerald-500 font-medium">
          {offer.source}
        </span>
      </div>
    </div>
  );
}
