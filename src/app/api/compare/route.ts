// src/app/api/compare/route.ts - Multi-Product Side-by-Side Comparison API Endpoint
import { NextRequest, NextResponse } from 'next/server';
import { getProductById } from '@/lib/data/catalog';
import { getBestEligiblePrice, rankStoreListings } from '@/lib/engine/calculator';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get('product_ids') || '';
  const productIds = idsParam.split(',').map(s => s.trim()).filter(Boolean);

  if (productIds.length === 0) {
    return NextResponse.json(
      { success: false, error: 'product_ids query parameter is required (e.g. ?product_ids=prod_1,prod_2)' },
      { status: 400 }
    );
  }

  const products = productIds
    .map(id => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined)
    .map(p => ({
      ...p,
      best_eligible_listing: getBestEligiblePrice(p),
      store_listings: rankStoreListings(p.store_listings || p.rows || []),
    }));

  return NextResponse.json({
    success: true,
    count: products.length,
    data: products,
  });
}
