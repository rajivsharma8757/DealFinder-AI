// src/app/api/offers/route.ts - Bank Offers API Endpoint
import { NextRequest, NextResponse } from 'next/server';
import { BANK_OFFERS } from '@/lib/data/catalog';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const bank = searchParams.get('bank');
  const retailer = searchParams.get('retailer');
  const category = searchParams.get('category');

  let results = [...BANK_OFFERS];

  if (bank) {
    results = results.filter(b => b.bank.toLowerCase().includes(bank.toLowerCase()));
  }
  if (retailer) {
    results = results.filter(b => b.retailer.toLowerCase().includes(retailer.toLowerCase()));
  }
  if (category && category !== 'All') {
    results = results.filter(b => b.category.toLowerCase() === category.toLowerCase() || b.category === 'All');
  }

  return NextResponse.json({
    success: true,
    count: results.length,
    data: results,
  });
}
