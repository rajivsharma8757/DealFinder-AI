# DealFinder AI — AI-Powered Multi-Platform Shopping Intelligence & Deal Discovery System

> **Tagline:** Search Once. Compare Everywhere. Save More.

**DealFinder AI** is an enterprise-grade shopping intelligence platform built using Next.js 15 (App Router), React 19, TypeScript, and Tailwind CSS. It aggregates, analyzes, and compares real-time product prices across 20+ verified Indian eCommerce platforms, automatically applying bank card promotions, coupon codes, and shipping fees to determine the true net eligible checkout price.

---

## 🌟 Key Features

1. **Universal Natural Language Search & Voice Recognition**
   - Natural language query understanding (e.g. *"laptop under 60000"*, *"Samsung phone below 25k"*, *"running shoes under 3000"*).
   - Voice-search integration with browser speech recognition and fallback.
   - Budget constraints, brand detection, and category filtering automatically parsed.

2. **20+ Indian Retailer Integration**
   - Real-time comparison across Amazon India, Flipkart, Myntra, Meesho, Croma, Reliance Digital, AJIO, Tata CLiQ, Nykaa, JioMart, and 10+ emerging platforms.
   - Verified feeds, affiliate feeds, and automated price sync engines with latency tracking.

3. **Net Effective Purchase Price Calculator**
   - True price ranking engine: `Net Price = Base Price - Max(Bank Offer, Coupon) + Delivery Fee`.
   - Stacks instant credit/debit card discounts (HDFC, ICICI, Axis, SBI, Kotak, IDFC FIRST) and validated promotional codes.

4. **Conversational AI Shopping Assistant**
   - Multi-lingual intelligence supporting English, Hindi, and Hinglish.
   - Deep specification matching, head-to-head recommendation reasoning, and direct comparison triggers.

5. **Side-by-Side Product Comparison Matrix**
   - Compare up to 4 products simultaneously with dynamic specification alignment (Processor, Display, Camera, Battery, Storage, OS, Warranty).
   - Side-by-side merchant price grids with direct store checkout links.

6. **Price Drop Alerts & 90-Day Trend Tracking**
   - Custom threshold price alert notifications.
   - 90-day price history graphs detecting genuine discounts versus inflated sales.

7. **Admin Dashboard & Provider Management**
   - Real-time catalog health monitoring, crawler ingestion telemetry, and round-trip provider connectivity tests.

---

## 🛠️ Technology Stack

- **Framework:** Next.js 15 (App Router)
- **UI Library:** React 19
- **Language:** TypeScript 5.7
- **Styling:** Tailwind CSS 3.4 with custom dark mode glassmorphism (`#101312` background, `#22C55E` emerald accent)
- **Icons:** Lucide React
- **Engine Modules:**
  - `src/lib/engine/calculator.ts` — Net effective price ranking
  - `src/lib/engine/search.ts` — Semantic natural language query parser & faceted search
  - `src/lib/engine/assistant.ts` — Conversational AI shopping assistant
  - `src/lib/engine/storeAdapters.ts` — 20 Indian retailer adapters & telemetry

---

## 📂 Project Structure

```
dealfinder-ai/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Home Page (Hero, Search, Super Deals, Promo)
│   │   ├── deals/                      # Today's Best Super Deals
│   │   ├── search/                     # Search Results & Multi-Criteria Filtering
│   │   ├── products/[id]/              # Product Details, Store Comparison & Trends
│   │   ├── compare/                    # 4-Product Side-by-Side Comparison Matrix
│   │   ├── assistant/                  # AI Shopping Assistant Chatbot
│   │   ├── categories/                 # Category & Subcategory Directory
│   │   ├── stores/                     # 20+ Indian Retailer Directory
│   │   ├── offers/                     # Bank Offers & Card Stacking Engine
│   │   ├── coupons/                    # Verified Promo Codes with 1-Click Copy
│   │   ├── login/ & signup/            # Shopper Authentication
│   │   ├── dashboard/                  # User Dashboard (Saved Items, Alerts, Cards)
│   │   ├── wishlist/                   # Saved Products
│   │   ├── history/                    # Search History
│   │   ├── saved-comparisons/          # Saved Comparison Sets
│   │   ├── price-alerts/               # Active Price Threshold Alerts
│   │   ├── price-history/              # Market Price Trends
│   │   ├── profile/                    # User Settings & Primary Discount Card
│   │   ├── admin/                      # Operations Dashboard
│   │   │   └── providers/              # Retailer Provider Management
│   │   ├── api/                        # REST API Routes
│   │   │   ├── products/               # Product search & single item retrieval
│   │   │   ├── compare/                # Multi-product comparison API
│   │   │   ├── offers/                 # Bank offers API
│   │   │   ├── coupons/                # Coupons API
│   │   │   ├── assistant/              # AI assistant POST endpoint
│   │   │   ├── stores/                 # Retailers API
│   │   │   └── admin/providers/        # Admin provider management API
│   │   ├── globals.css                 # Dark theme, glassmorphism & Tailwind styles
│   │   └── layout.tsx                  # Root layout with Navbar, Footer & Search Modal
│   ├── components/                     # Reusable UI Components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ComparisonTable.tsx
│   │   ├── SearchBar.tsx
│   │   ├── SearchModal.tsx
│   │   ├── BankOfferCard.tsx
│   │   ├── CouponCard.tsx
│   │   └── PriceAlertModal.tsx
│   ├── context/
│   │   └── AppContext.tsx              # Global state (Wishlist, Compare, Alerts, Cards)
│   ├── lib/
│   │   ├── data/catalog.ts             # Comprehensive Product & Promotion Catalog
│   │   └── engine/                     # Calculation, Search & Adapter Engines
│   └── types/
│       └── index.ts                    # TypeScript Data Contracts
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or later
- npm or yarn

### Installation & Run

```bash
# 1. Navigate to the project directory
cd dealfinder-ai

# 2. Install dependencies (if not already installed)
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# Visit http://localhost:3000
```

### Production Build

```bash
# Build optimized Next.js bundle
npm run build

# Start production server
npm run start
```

---

## 🎓 Academic Credit & Attribution

- **Project Title:** DEALFINDER AI – AI-POWERED MULTI-PLATFORM SHOPPING COMPARISON AND DEAL DISCOVERY SYSTEM
- **Academic Institution:** M. M. Engineering College, Maharishi Markandeshwar (Deemed to be University), Mullana, Ambala
- **Department:** Computer Science & Engineering
- **Academic Session:** 2026–2027
- **Project Members:**
  1. Rajiv Kumar Sharma (Univ. Roll No. 11242618)
  2. Mantu Kumar (Univ. Roll No. 11242596)
  3. Muskan Kumari (Univ. Roll No. 11242346)
  4. Vishal Kumar (Univ. Roll No. 11242733)
