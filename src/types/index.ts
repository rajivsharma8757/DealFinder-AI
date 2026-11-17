// src/types/index.ts - Core TypeScript Data Definitions

export type RetailerName =
  | 'Amazon India'
  | 'Flipkart'
  | 'Myntra'
  | 'Meesho'
  | 'AJIO'
  | 'Tata CLiQ'
  | 'Shopsy'
  | 'Snapdeal'
  | 'Croma'
  | 'Reliance Digital'
  | 'Nykaa'
  | 'JioMart'
  | 'FirstCry'
  | 'Decathlon'
  | 'Vijay Sales'
  | 'Pepperfry'
  | 'Urban Ladder'
  | 'BigBasket'
  | 'Blinkit'
  | 'Zepto'
  | string;

export type ProductCategory =
  | 'All'
  | 'Smartphones'
  | 'Mobiles'
  | 'Laptops'
  | 'Tablets'
  | 'Headphones'
  | 'Electronics'
  | 'Smartwatches'
  | 'Cameras'
  | 'Televisions'
  | 'Home Appliances'
  | 'Fashion'
  | 'Shoes'
  | 'Footwear'
  | 'Gaming'
  | 'Kitchen'
  | 'Home & Kitchen'
  | 'Beauty'
  | 'Furniture'
  | 'Accessories'
  | string;

export interface BankOffer {
  id: string;
  bank: string;
  retailer: string;
  card_type: 'credit_card' | 'debit_card' | 'emi' | string;
  discount_type: 'percent' | 'flat';
  discount_value: number;
  max_discount: number;
  min_purchase: number;
  category: string;
  expiry: string;
  coupon_code?: string;
  terms: string;
  source: string;
  is_active: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  retailer: string;
  discount_type: 'percent' | 'flat';
  discount_value: number;
  max_discount: number;
  min_purchase: number;
  category: string;
  expiry: string;
  terms: string;
  verified: boolean;
}

export interface StoreListing {
  id: string;
  product_id: string;
  retailer: RetailerName;
  current_price: number;
  original_price: number;
  discount_pct: number;
  in_stock: boolean;
  delivery_fee: number;
  estimated_delivery: string;
  rating: number;
  review_count: number;
  product_url: string;
  bank_offer?: BankOffer;
  coupon?: Coupon;
  cashback_text?: string;
  eligible_final_price: number;
  last_verified: string;
  source: 'verified_partner' | 'affiliate_feed' | 'scraped_catalog' | 'demo' | string;
}

export interface ProductVariant {
  id: string;
  color?: string;
  size?: string;
  storage?: string;
  ram?: string;
  price_delta: number;
  in_stock: boolean;
}

export interface Product {
  id: string;
  title: string;
  brand: string;
  category: ProductCategory;
  subcategory: string;
  description: string;
  base_price?: number;
  original_price: number;
  discount?: number;
  final_price?: number;
  final_store?: RetailerName;
  store_count?: number;
  rating: number;
  overall_rating?: number;
  review_count: number;
  total_reviews?: number;
  popularity?: number;
  is_trending?: boolean;
  image?: string;
  image_url?: string;
  images?: string[];
  specs?: Record<string, string>;
  specifications?: Record<string, string>;
  colors?: string[];
  sizes?: string[];
  storages?: string[];
  tags?: string[];
  in_stock: boolean;
  variants?: ProductVariant[];
  rows?: StoreListing[];
  store_listings?: StoreListing[];
  best_offer_store?: string;
  best_offer_amount?: number;
  price_history?: { date: string; price: number; store?: string }[];
}

export interface RetailerProvider {
  id: string;
  name: RetailerName;
  logo: string;
  category_coverage?: ProductCategory[];
  categories?: ProductCategory[];
  country?: string;
  direct_url?: string;
  website_url?: string;
  status: 'active' | 'beta' | 'maintenance' | string;
  adapter_type?: 'affiliate_api' | 'catalog_feed' | 'webhook' | 'demo' | string;
  integration_type?: string;
  supported_features?: string[];
  last_sync?: string;
  latency_ms?: number;
  sync_latency?: string;
  api_key_configured?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  role: 'user' | 'admin';
  saved_cards: any[];
  created_at?: string;
}

export interface UserProfile {
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  preferredCard?: string;
  completionPct: number;
  createdAt: string;
  updatedAt: string;
}

export interface SavedComparison {
  id: string;
  userId: string;
  title: string;
  productIds: string[];
  createdAt: string;
}

export interface SearchHistoryItem {
  id: string;
  userId: string;
  query: string;
  timestamp: string;
}

export interface PriceAlert {
  id: string;
  product_id: string;
  product_title: string;
  target_price: number;
  current_price: number;
  image?: string;
  email?: string;
  active?: boolean;
  is_active?: boolean;
  created_at: string;
  notify_email?: boolean;
  notify_whatsapp?: boolean;
}

export interface ChatMessage {
  id: string;
  role?: 'user' | 'assistant';
  sender?: 'user' | 'assistant';
  content?: string;
  text?: string;
  timestamp: string;
  recommendations?: Product[];
  actionLinks?: { label: string; url: string }[];
}

export interface SearchQueryFilter {
  query?: string;
  category?: string;
  brand?: string;
  retailer?: string;
  min_price?: number;
  max_price?: number;
  rating?: number;
  in_stock_only?: boolean;
  sort_by?: 'best_price' | 'lowest_price' | 'highest_discount' | 'rating' | 'popular';
}

export interface SearchFacetItem {
  name: string;
  count: number;
}

export interface SearchResult {
  products: Product[];
  total_results: number;
  facets: {
    categories: SearchFacetItem[];
    brands: SearchFacetItem[];
    retailers: SearchFacetItem[];
    price_range: {
      min: number;
      max: number;
    };
  };
}
