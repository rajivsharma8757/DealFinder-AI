// src/app/api/products/[id]/route.ts - Single Product Details API Endpoint
import { NextRequest, NextResponse } from 'next/server';
import { getProductById } from '@/lib/data/catalog';
import { rankStoreListings, getBestEligiblePrice } from '@/lib/engine/calculator';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return NextResponse.json(
      { success: false, error: 'Product not found' },
      { status: 404 }
    );
  }

  const rankedListings = rankStoreListings(product.store_listings || product.rows || []);
  const bestListing = getBestEligiblePrice(product);

  return NextResponse.json({
    success: true,
    data: {
      ...product,
      store_listings: rankedListings,
      best_eligible_listing: bestListing,
    },
  });
}
