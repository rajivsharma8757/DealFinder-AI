// src/app/api/stores/route.ts - Retailers Ecosystem API Endpoint
import { NextRequest, NextResponse } from 'next/server';
import { INDIAN_RETAILER_PROVIDERS } from '@/lib/engine/storeAdapters';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const status = searchParams.get('status');

  let results = [...INDIAN_RETAILER_PROVIDERS];

  if (category && category !== 'All') {
    results = results.filter(s => (s.categories || s.category_coverage || []).includes(category as any));
  }
  if (status) {
    results = results.filter(s => s.status === status);
  }

  return NextResponse.json({
    success: true,
    count: results.length,
    data: results,
  });
}
