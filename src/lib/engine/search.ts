// src/lib/engine/search.ts - Universal Product Search, Filtering, and Natural Language Query Parsing

import { Product, SearchQueryFilter, SearchResult } from '@/types';
import { getAllProducts } from '../data/catalog';
import { getBestEligiblePrice } from './calculator';

export interface ParsedQuery {
  rawQuery: string;
  cleanedQuery: string;
  category?: string;
  brand?: string;
  maxBudget?: number;
  minBudget?: number;
  retailer?: string;
  sortBy?: 'best_price' | 'highest_discount' | 'rating' | 'popular';
}

/**
 * Extracts intent, brand, budget, and category from raw natural language input.
 * Supports patterns like:
 * - "laptop under 60000"
 * - "shoes below 3k"
 * - "Samsung phone under 25,000"
 * - "women kurti under 1000"
 * - "best noise cancelling headphones"
 */
export function parseNaturalLanguageQuery(query: string): ParsedQuery {
  const rawQuery = (query || '').trim();
  let cleaned = rawQuery.toLowerCase();
  let maxBudget: number | undefined;
  let minBudget: number | undefined;
  let brand: string | undefined;
  let category: string | undefined;
  let retailer: string | undefined;

  // 1. Budget extraction: "under 50000", "below 2k", "under ₹60,000", "< 3000"
  const underRegex = /(?:under|below|less than|within|budget of|<|<=)\s*(?:rs\.?|inr|₹)?\s*([0-9]+(?:\.[0-9]+)?)\s*(k|thousand|lakh|lac)?/i;
  const underMatch = cleaned.match(underRegex);
  if (underMatch) {
    let num = parseFloat(underMatch[1]);
    const multiplier = (underMatch[2] || '').toLowerCase();
    if (multiplier === 'k' || multiplier === 'thousand') {
      num *= 1000;
    } else if (multiplier === 'lakh' || multiplier === 'lac') {
      num *= 100000;
    }
    maxBudget = num;
    cleaned = cleaned.replace(underMatch[0], ' ').trim();
  }

  // 2. Range extraction: "between 2000 and 5000"
  const rangeRegex = /(?:between|from)\s*(?:rs\.?|inr|₹)?\s*([0-9]+)\s*(?:to|and|-)\s*(?:rs\.?|inr|₹)?\s*([0-9]+)/i;
  const rangeMatch = cleaned.match(rangeRegex);
  if (rangeMatch) {
    minBudget = parseFloat(rangeMatch[1]);
    maxBudget = parseFloat(rangeMatch[2]);
    cleaned = cleaned.replace(rangeMatch[0], ' ').trim();
  }

  // 3. Known Brand Detection
  const knownBrands = [
    'Apple', 'Samsung', 'Sony', 'Asus', 'Dell', 'HP', 'Lenovo', 'OnePlus', 'Xiaomi',
    'Nike', 'Puma', 'Adidas', 'Levi\'s', 'Zara', 'Biba', 'Philips', 'Estée Lauder',
    'Boat', 'Noise', 'Realme', 'Dyson', 'LG'
  ];
  for (const b of knownBrands) {
    const reg = new RegExp(`\\b${b.replace("'", "\\'")}\\b`, 'i');
    if (reg.test(cleaned)) {
      brand = b;
      cleaned = cleaned.replace(reg, ' ').trim();
      break;
    }
  }

  // 4. Known Category / Subcategory Detection
  const categoryMap: Record<string, string> = {
    'phone': 'Mobiles',
    'mobile': 'Mobiles',
    'smartphone': 'Mobiles',
    'iphone': 'Mobiles',
    'laptop': 'Laptops',
    'notebook': 'Laptops',
    'macbook': 'Laptops',
    'headphone': 'Electronics',
    'earphone': 'Electronics',
    'earbuds': 'Electronics',
    'watch': 'Electronics',
    'smartwatch': 'Electronics',
    'camera': 'Electronics',
    'speaker': 'Electronics',
    'shoe': 'Footwear',
    'sneaker': 'Footwear',
    'running shoes': 'Footwear',
    'jacket': 'Fashion',
    'shirt': 'Fashion',
    'tshirt': 'Fashion',
    't-shirt': 'Fashion',
    'jeans': 'Fashion',
    'kurti': 'Fashion',
    'saree': 'Fashion',
    'dress': 'Fashion',
    'air fryer': 'Home & Kitchen',
    'fryer': 'Home & Kitchen',
    'cooker': 'Home & Kitchen',
    'blender': 'Home & Kitchen',
    'vacuum': 'Home & Kitchen',
    'serum': 'Beauty',
    'cream': 'Beauty',
    'perfume': 'Beauty',
    'lipstick': 'Beauty'
  };

  for (const [kw, cat] of Object.entries(categoryMap)) {
    const reg = new RegExp(`\\b${kw}\\b`, 'i');
    if (reg.test(cleaned)) {
      category = cat;
      break;
    }
  }

  // 5. Retailer detection
  const retailers = [
    'Amazon', 'Flipkart', 'Croma', 'Reliance Digital', 'Myntra', 'Meesho', 'AJIO',
    'Tata CLiQ', 'Nykaa', 'JioMart'
  ];
  for (const ret of retailers) {
    const reg = new RegExp(`\\bon\\s+${ret}\\b|\\bfrom\\s+${ret}\\b|\\bat\\s+${ret}\\b`, 'i');
    if (reg.test(cleaned)) {
      retailer = ret;
      cleaned = cleaned.replace(reg, ' ').trim();
      break;
    }
  }

  return {
    rawQuery,
    cleanedQuery: cleaned.replace(/\s+/g, ' ').trim(),
    category,
    brand,
    maxBudget,
    minBudget,
    retailer,
    sortBy: 'best_price'
  };
}

/**
 * Searches and filters catalog products according to explicit filters and parsed queries.
 */
export function searchProducts(filter: SearchQueryFilter): SearchResult {
  const allProducts = getAllProducts();
  const rawQ = (filter.query || '').trim();
  const parsed = rawQ ? parseNaturalLanguageQuery(rawQ) : null;

  const targetCategory = filter.category || (parsed?.category !== 'All' ? parsed?.category : undefined);
  const targetBrand = filter.brand || parsed?.brand;
  const targetRetailer = filter.retailer || parsed?.retailer;
  const maxPrice = filter.max_price ?? parsed?.maxBudget;
  const minPrice = filter.min_price ?? parsed?.minBudget;

  const searchTokens = (parsed ? parsed.cleanedQuery : rawQ)
    .toLowerCase()
    .split(/\s+/)
    .filter(t => t.length > 1 && !['the', 'and', 'with', 'for', 'in', 'on', 'of', 'best'].includes(t));

  const matched = allProducts.filter(product => {
    const listings = product.store_listings || product.rows || [];

    // 1. Category Filter
    if (targetCategory && targetCategory !== 'All') {
      if (product.category.toLowerCase() !== targetCategory.toLowerCase() &&
          product.subcategory.toLowerCase() !== targetCategory.toLowerCase()) {
        return false;
      }
    }

    // 2. Brand Filter
    if (targetBrand && targetBrand !== 'All') {
      if (product.brand.toLowerCase() !== targetBrand.toLowerCase()) {
        return false;
      }
    }

    // 3. Retailer Filter
    if (targetRetailer && targetRetailer !== 'All') {
      const hasRetailer = listings.some(l =>
        l.retailer.toLowerCase().includes(targetRetailer.toLowerCase())
      );
      if (!hasRetailer) return false;
    }

    // 4. In Stock Filter
    if (filter.in_stock_only) {
      const anyInStock = listings.some(l => l.in_stock);
      if (!anyInStock) return false;
    }

    // 5. Rating Filter
    if (filter.rating && filter.rating > 0) {
      const r = product.overall_rating || product.rating || 0;
      if (r < filter.rating) return false;
    }

    // 6. Price Range Filter
    const bestPrice = getBestEligiblePrice(product).eligible_final_price;
    if (maxPrice !== undefined && bestPrice > maxPrice) return false;
    if (minPrice !== undefined && bestPrice < minPrice) return false;

    // 7. Text Token Matching (Title, Brand, Description, Tags, Specs)
    if (searchTokens.length > 0) {
      const searchableText = [
        product.title,
        product.brand,
        product.category,
        product.subcategory,
        product.description,
        ...(product.tags || []),
        ...Object.values(product.specifications || product.specs || {})
      ].join(' ').toLowerCase();

      // Check if at least one or more tokens match
      const matchedCount = searchTokens.filter(token => searchableText.includes(token)).length;
      if (matchedCount === 0 && searchTokens.length > 0) {
        return false;
      }
    }

    return true;
  });

  // Sorting
  const sortBy = filter.sort_by || 'best_price';
  matched.sort((a, b) => {
    const bestA = getBestEligiblePrice(a);
    const bestB = getBestEligiblePrice(b);

    switch (sortBy) {
      case 'lowest_price':
      case 'best_price':
        return bestA.eligible_final_price - bestB.eligible_final_price;
      case 'highest_discount':
        return bestB.discount_pct - bestA.discount_pct;
      case 'rating':
        return (b.overall_rating || b.rating || 0) - (a.overall_rating || a.rating || 0);
      case 'popular':
      default:
        return (b.total_reviews || b.review_count || 0) - (a.total_reviews || a.review_count || 0);
    }
  });

  // Extract Facets for UI filters
  const categoriesCount: Record<string, number> = {};
  const brandsCount: Record<string, number> = {};
  const retailersCount: Record<string, number> = {};

  allProducts.forEach(p => {
    categoriesCount[p.category] = (categoriesCount[p.category] || 0) + 1;
    brandsCount[p.brand] = (brandsCount[p.brand] || 0) + 1;
    (p.store_listings || p.rows || []).forEach(l => {
      retailersCount[l.retailer] = (retailersCount[l.retailer] || 0) + 1;
    });
  });

  return {
    products: matched,
    total_results: matched.length,
    facets: {
      categories: Object.entries(categoriesCount).map(([name, count]) => ({ name, count })),
      brands: Object.entries(brandsCount).map(([name, count]) => ({ name, count })),
      retailers: Object.entries(retailersCount).map(([name, count]) => ({ name, count })),
      price_range: {
        min: 500,
        max: 200000
      }
    }
  };
}

export const TRENDING_SEARCHES = [
  'iPhone 16 128GB',
  'Samsung Galaxy S24 Ultra',
  'Sony WH-1000XM5',
  'MacBook Air M3',
  'Gaming laptop under ₹60,000',
  'Men\'s running shoes under ₹3,000',
  'Women\'s kurti under ₹1,000',
  'Philips Air Fryer 4.1L',
  'Air Jordan 1 Retro'
];
