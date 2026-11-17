// src/app/api/products/route.ts - Products Search & Filter API Endpoint
import { NextRequest, NextResponse } from 'next/server';
import { searchProducts } from '@/lib/engine/search';
import { getAllProducts } from '@/lib/data/catalog';
import { SearchQueryFilter } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || undefined;
  const brand = searchParams.get('brand') || undefined;
  const retailer = searchParams.get('retailer') || undefined;
  const minPrice = searchParams.get('min_price') ? Number(searchParams.get('min_price')) : undefined;
  const maxPrice = searchParams.get('max_price') ? Number(searchParams.get('max_price')) : undefined;
  const rating = searchParams.get('rating') ? Number(searchParams.get('rating')) : undefined;
  const inStockOnly = searchParams.get('in_stock') === 'true';
  const sortBy = (searchParams.get('sort_by') as any) || 'best_price';

  const filter: SearchQueryFilter = {
    query,
    category,
    brand,
    retailer,
    min_price: minPrice,
    max_price: maxPrice,
    rating,
    in_stock_only: inStockOnly,
    sort_by: sortBy,
  };

  const results = searchProducts(filter);

  return NextResponse.json({
    success: true,
    total: results.total_results,
    data: results.products,
    facets: results.facets,
  });
}
