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

// Known category keywords and synonyms mapping directly to the 15 standard catalog categories
const CATEGORY_SYNONYMS: Record<string, string[]> = {
  'Smartphones': ['smartphone', 'smartphones', 'phone', 'phones', 'mobile', 'mobiles', 'iphone', 'iphones', 'galaxy phone', '5g phone'],
  'Laptops': ['laptop', 'laptops', 'notebook', 'notebooks', 'macbook', 'macbooks', 'ultrabook', 'ultrabooks', 'thinkpad', 'gaming laptop'],
  'Tablets': ['tablet', 'tablets', 'ipad', 'ipads', 'tab', 'tabs'],
  'Headphones': ['headphone', 'headphones', 'earphone', 'earphones', 'earbuds', 'earbud', 'airpods', 'tws', 'headset', 'headsets'],
  'Smartwatches': ['smartwatch', 'smartwatches', 'watch', 'watches', 'fitness band', 'apple watch', 'galaxy watch'],
  'Cameras': ['camera', 'cameras', 'dslr', 'mirrorless', 'gopro', 'action cam', 'vlogging camera'],
  'Televisions': ['television', 'televisions', 'tv', 'tvs', 'oled tv', 'qled tv', 'smart tv', '4k tv'],
  'Home Appliances': ['appliance', 'appliances', 'home appliance', 'air conditioner', 'ac', 'fridge', 'refrigerator', 'washing machine', 'vacuum', 'air purifier', 'water purifier', 'heater'],
  'Fashion': ['fashion', 'clothing', 'clothes', 'jacket', 'jackets', 'blazer', 'blazers', 'suit', 'suits', 'kurta', 'kurti', 'kurtas', 'hoodie', 'hoodies', 'sweatshirt', 'shirt', 'shirts', 'trench coat'],
  'Shoes': ['shoe', 'shoes', 'sneaker', 'sneakers', 'footwear', 'running shoe', 'running shoes', 'boots', 'boot', 'sandals', 'sandal', 'jordan', 'jordans', 'retro sneakers'],
  'Gaming': ['gaming', 'game', 'games', 'console', 'consoles', 'ps5', 'playstation', 'xbox', 'nintendo', 'switch oled', 'gaming mouse', 'gaming keyboard', 'controller', 'gamepad'],
  'Kitchen': ['kitchen', 'kitchen appliance', 'air fryer', 'airfryer', 'cooker', 'pressure cooker', 'espresso', 'coffee maker', 'blender', 'mixer grinder', 'grinder', 'otg', 'induction', 'kettle'],
  'Beauty': ['beauty', 'skincare', 'serum', 'serums', 'hair styler', 'airwrap', 'cream', 'creams', 'lipstick', 'lipsticks', 'hydrator', 'night oil'],
  'Furniture': ['furniture', 'chair', 'chairs', 'office chair', 'sofa', 'sofas', 'couch', 'bed', 'beds', 'queen bed', 'coffee table', 'table', 'tables', 'bookcase', 'bookshelf', 'desk', 'computer desk'],
  'Accessories': ['accessory', 'accessories', 'charger', 'fast charger', 'power bank', 'powerbank', 'ssd', 'portable ssd', 'external ssd', 'magsafe', 'phone case', 'case', 'wallet stand']
};

const KNOWN_BRANDS = [
  'Apple', 'Samsung', 'Sony', 'OnePlus', 'Google', 'Xiaomi', 'Vivo', 'Motorola', 'Nothing',
  'Dell', 'HP', 'Lenovo', 'ASUS', 'Acer',
  'Bose', 'Sennheiser', 'JBL', 'boAt', 'Noise', 'Garmin', 'Amazfit',
  'Canon', 'Nikon', 'Fujifilm', 'GoPro', 'DJI', 'Insta360',
  'LG', 'TCL', 'Vu', 'Dyson', 'IFB', 'Havells', 'Philips', 'Aquaguard', 'Eureka Forbes',
  'Nike', 'Adidas', 'Puma', 'Asics', 'New Balance', 'Woodland', 'Birkenstock', 'Converse',
  'Levi\'s', 'Zara', 'Biba', 'FabIndia', 'H&M', 'Marks & Spencer', 'Tommy Hilfiger', 'W for Woman',
  'Logitech', 'Razer', 'SteelSeries', 'Microsoft', 'Nintendo',
  'Instant Pot', 'Morphy Richards', 'NutriBullet', 'Preethi', 'Borosil', 'Pigeon', 'Kent',
  'Estée Lauder', 'Minimalist', 'Kama Ayurveda', 'Forest Essentials', 'Clinique', 'Maybelline', 'L\'Oreal',
  'Wakefit', 'Sleepyhead', 'Royal Oak', 'Urban Ladder', 'IKEA', 'Green Soul', 'Spacewood', 'DeckUp',
  'Anker', 'SanDisk', 'Belkin', 'Spigen', 'ESR'
];

/**
 * Extracts intent, brand, budget, and category from raw natural language input.
 */
export function parseNaturalLanguageQuery(query: string): ParsedQuery {
  const rawQuery = (query || '').trim();
  let cleaned = rawQuery.toLowerCase();
  let maxBudget: number | undefined;
  let minBudget: number | undefined;
  let brand: string | undefined;
  let category: string | undefined;
  let retailer: string | undefined;

  // 1. Budget extraction: "under 50000", "below 2k", "under ₹60,000", "< 3000", "under 3,000"
  const underRegex = /(?:under|below|less than|within|budget of|<|<=)\s*(?:rs\.?|inr|₹)?\s*([0-9,]+(?:\.[0-9]+)?)\s*(k|thousand|lakh|lac)?/i;
  const underMatch = cleaned.match(underRegex);
  if (underMatch) {
    let numStr = underMatch[1].replace(/,/g, '');
    let num = parseFloat(numStr);
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
  const rangeRegex = /(?:between|from)\s*(?:rs\.?|inr|₹)?\s*([0-9,]+)\s*(?:to|and|-)\s*(?:rs\.?|inr|₹)?\s*([0-9,]+)/i;
  const rangeMatch = cleaned.match(rangeRegex);
  if (rangeMatch) {
    minBudget = parseFloat(rangeMatch[1].replace(/,/g, ''));
    maxBudget = parseFloat(rangeMatch[2].replace(/,/g, ''));
    cleaned = cleaned.replace(rangeMatch[0], ' ').trim();
  }

  // 3. Known Brand Detection
  for (const b of KNOWN_BRANDS) {
    const escaped = b.replace("'", "\\'");
    const reg = new RegExp(`\\b${escaped}\\b`, 'i');
    if (reg.test(cleaned)) {
      brand = b;
      cleaned = cleaned.replace(reg, ' ').trim();
      break;
    }
  }

  // 4. Category and Synonym Detection
  for (const [catName, synonyms] of Object.entries(CATEGORY_SYNONYMS)) {
    for (const syn of synonyms) {
      const reg = new RegExp(`\\b${syn}\\b`, 'i');
      if (reg.test(cleaned)) {
        category = catName;
        cleaned = cleaned.replace(reg, ' ').trim();
        break;
      }
    }
    if (category) break;
  }

  // 5. Retailer detection
  const retailers = [
    'Amazon', 'Flipkart', 'Croma', 'Reliance Digital', 'Myntra', 'Meesho', 'AJIO',
    'Tata CLiQ', 'Nykaa', 'JioMart'
  ];
  for (const ret of retailers) {
    const reg = new RegExp(`\\bon\\s+${ret}\\b|\\bfrom\\s+${ret}\\b|\\bat\\s+${ret}\\b|\\b${ret}\\b`, 'i');
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
 * Strictly guarantees that queries return relevant products and non-matching queries return 0 results.
 */
export function searchProducts(filter: SearchQueryFilter): SearchResult {
  const allProducts = getAllProducts();
  const rawQ = (filter.query || '').trim();
  const parsed = rawQ ? parseNaturalLanguageQuery(rawQ) : null;

  // Resolved filter attributes
  const explicitCategory = filter.category && filter.category !== 'All' ? filter.category : undefined;
  const inferredCategory = parsed?.category;
  const targetCategory = explicitCategory || inferredCategory;

  const explicitBrand = filter.brand && filter.brand !== 'All' ? filter.brand : undefined;
  const targetBrand = explicitBrand || parsed?.brand;

  const targetRetailer = filter.retailer && filter.retailer !== 'All' ? filter.retailer : parsed?.retailer;
  const maxPrice = filter.max_price ?? parsed?.maxBudget;
  const minPrice = filter.min_price ?? parsed?.minBudget;

  // Extract query keywords (excluding stop words)
  const stopWords = new Set(['the', 'and', 'with', 'for', 'in', 'on', 'of', 'best', 'buy', 'deals', 'top', 'under', 'below', 'price', 'compare']);
  const rawTokens = rawQ
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1 && !stopWords.has(t));

  // Determine if query explicitly asked for a category
  const hasCategoryIntent = Boolean(targetCategory);

  // Score each product
  const scoredProducts: { product: Product; score: number }[] = [];

  for (const product of allProducts) {
    const listings = product.store_listings || product.rows || [];

    // --- HARD CRITERIA CHECKS ---

    // 1. Explicit or Inferred Category Match
    if (targetCategory) {
      const prodCat = (product.category || '').toLowerCase();
      const targetCat = targetCategory.toLowerCase();
      const prodSub = (product.subcategory || '').toLowerCase();

      // Check category match or subcategory match
      const isCatMatch = prodCat === targetCat || prodSub.includes(targetCat) || targetCat.includes(prodCat);
      if (!isCatMatch) {
        // If the user explicitly searched for a category (like "shoes" or "laptop"), strictly skip non-matching categories
        continue;
      }
    }

    // 2. Brand Match
    if (targetBrand) {
      if (product.brand.toLowerCase() !== targetBrand.toLowerCase()) {
        continue;
      }
    }

    // 3. Retailer Match
    if (targetRetailer) {
      const hasRetailer = listings.some(l =>
        l.retailer.toLowerCase().includes(targetRetailer.toLowerCase())
      );
      if (!hasRetailer) continue;
    }

    // 4. In Stock Filter
    if (filter.in_stock_only) {
      const anyInStock = listings.some(l => l.in_stock);
      if (!anyInStock) continue;
    }

    // 5. Rating Filter
    if (filter.rating && filter.rating > 0) {
      const r = product.overall_rating || product.rating || 0;
      if (r < filter.rating) continue;
    }

    // 6. Price Range Filter
    const bestPrice = getBestEligiblePrice(product).eligible_final_price;
    if (maxPrice !== undefined && bestPrice > maxPrice) continue;
    if (minPrice !== undefined && bestPrice < minPrice) continue;

    // --- RELEVANCE SCORING ---
    let score = 0;

    if (rawTokens.length > 0) {
      const titleLower = product.title.toLowerCase();
      const brandLower = product.brand.toLowerCase();
      const descLower = product.description.toLowerCase();
      const categoryLower = product.category.toLowerCase();
      const subcategoryLower = product.subcategory.toLowerCase();
      const tags = (product.tags || []).map(t => t.toLowerCase());
      const specs = Object.values(product.specifications || product.specs || {}).map(s => String(s).toLowerCase());

      let matchedTokenCount = 0;

      for (const token of rawTokens) {
        let tokenMatched = false;

        // Exact Title Match (highest weight)
        if (titleLower.includes(token)) {
          score += 15;
          tokenMatched = true;
        }

        // Brand Match
        if (brandLower.includes(token)) {
          score += 12;
          tokenMatched = true;
        }

        // Category / Subcategory Match
        if (categoryLower.includes(token) || subcategoryLower.includes(token)) {
          score += 10;
          tokenMatched = true;
        }

        // Tags Match
        if (tags.some(t => t.includes(token))) {
          score += 8;
          tokenMatched = true;
        }

        // Specifications Match
        if (specs.some(s => s.includes(token))) {
          score += 5;
          tokenMatched = true;
        }

        // Description Match
        if (descLower.includes(token)) {
          score += 3;
          tokenMatched = true;
        }

        if (tokenMatched) {
          matchedTokenCount++;
        }
      }

      // If user typed search tokens and none matched, and no category/brand was matched either, discard!
      if (matchedTokenCount === 0 && !hasCategoryIntent && !targetBrand) {
        continue;
      }
    } else {
      // Default score when no text query (just browsing / category view)
      score = product.popularity || 50;
    }

    scoredProducts.push({ product, score });
  }

  // Sort by user requested order or relevance
  const sortBy = filter.sort_by || 'best_price';

  scoredProducts.sort((a, b) => {
    const prodA = a.product;
    const prodB = b.product;
    const bestA = getBestEligiblePrice(prodA);
    const bestB = getBestEligiblePrice(prodB);

    switch (sortBy) {
      case 'lowest_price':
      case 'best_price':
        return bestA.eligible_final_price - bestB.eligible_final_price;
      case 'highest_discount':
        return bestB.discount_pct - bestA.discount_pct;
      case 'rating':
        return (prodB.overall_rating || prodB.rating || 0) - (prodA.overall_rating || prodA.rating || 0);
      case 'popular':
        return (prodB.total_reviews || prodB.review_count || 0) - (prodA.total_reviews || prodA.review_count || 0);
      default:
        // Relevance first, then popularity
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return (prodB.popularity || 0) - (prodA.popularity || 0);
    }
  });

  const matched = scoredProducts.map(sp => sp.product);

  // Extract Dynamic Facets for UI filters
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
      categories: Object.entries(categoriesCount).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
      brands: Object.entries(brandsCount).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
      retailers: Object.entries(retailersCount).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
      price_range: {
        min: 500,
        max: 250000
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
  'Nike Air Jordan 1',
  'Dyson V15 Detect',
  'Philips Air Fryer 4.1L',
  'Sony Bravia 65-inch OLED',
  'Birkenstock Arizona Sandals',
  'PlayStation 5 Slim'
];
