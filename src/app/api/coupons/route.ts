// src/app/api/coupons/route.ts - Promotional Coupons API Endpoint
import { NextRequest, NextResponse } from 'next/server';
import { COUPONS } from '@/lib/data/catalog';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const retailer = searchParams.get('retailer');
  const code = searchParams.get('code');

  let results = [...COUPONS];

  if (retailer) {
    results = results.filter(c => c.retailer.toLowerCase().includes(retailer.toLowerCase()));
  }
  if (code) {
    results = results.filter(c => c.code.toLowerCase() === code.toLowerCase());
  }

  return NextResponse.json({
    success: true,
    count: results.length,
    data: results,
  });
}
