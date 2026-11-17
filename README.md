# DealFinder AI — AI-Powered Multi-Platform Shopping Intelligence & Deal Discovery System

> **Tagline:** Search Once. Compare Everywhere. Save More.

**DealFinder AI** is an enterprise-grade shopping intelligence platform built using Next.js 15 (App Router), React 19, TypeScript, and Tailwind CSS. It aggregates, analyzes, and compares real-time product prices across 20+ verified Indian eCommerce platforms, automatically applying bank card promotions, coupon codes, and shipping fees to determine the true net eligible checkout price.

---

## 🌟 Key Features

1. **Universal Natural Language Search & Voice Recognition**
   - Natural language query understanding (e.g. *"laptop under 60000"*, *"Samsung phone below 25k"*, *"running shoes under 3000"*).
   - Voice-search integration with browser Web Speech API (English `en-IN` and Hindi `hi-IN` toggle).
   - Strict intent scoring, brand detection, category filtering, and duplicate removal.

2. **128+ Expanded Multi-Category Catalog & 20+ Indian Retailers**
   - 128 realistic products spanning 15 major categories: Smartphones, Laptops, Tablets, Headphones, Smartwatches, Cameras, Televisions, Home Appliances, Fashion, Shoes, Gaming, Kitchen, Beauty, Furniture, and Accessories.
   - Comprehensive multi-store pricing comparison across Amazon India, Flipkart, Myntra, Croma, Reliance Digital, AJIO, Tata CLiQ, and Nykaa.

3. **Net Effective Purchase Price Calculator**
   - True price ranking engine: `Net Price = Base Price - Max(Bank Offer, Coupon) + Delivery Fee`.
   - Stacks instant credit/debit card discounts (HDFC, ICICI, Axis, SBI, Kotak, IDFC FIRST) and validated promotional codes.

4. **Conversational AI Shopping Assistant**
   - Multi-lingual intelligence supporting English, Hindi, and Hinglish.
   - Deep specification matching, head-to-head recommendation reasoning, and direct comparison triggers.

5. **Side-by-Side Product Comparison Matrix**
   - Compare up to 4 products simultaneously with dynamic specification alignment.
   - Side-by-side merchant price grids with direct store checkout links.

6. **User Dashboard & Isolated Profile Management**
   - Overview with real-time statistics (Wishlist count, Active Price Alerts, Comparisons, Search History).
   - User profile management with profile completion score and avatar selector.
   - User-isolated storage for saved comparisons, search history, and price drop notifications.

7. **Security Architecture & Production Hardening**
   - **HttpOnly & SameSite Cookies:** Session tokens are stored strictly in secure HttpOnly cookies, completely hidden from client-side JavaScript.
   - **Zero Secret Exposure:** Session tokens and raw password reset tokens are never returned in JSON API responses.
   - **Bcrypt Password Hashing:** 10-round salted password hashing with secure server verification.
   - **SHA-256 Single-Use Reset Tokens:** Password recovery uses cryptographically secure tokens with strict 15-minute expiration and immediate consumption.
   - **Git-Ignored Runtime Storage:** Runtime databases and user data are strictly excluded from version control (`.gitignore`).

---

## 🛠️ Technology Stack

- **Framework:** Next.js 15 (App Router)
- **UI Library:** React 19
- **Language:** TypeScript 5.7
- **Styling:** Tailwind CSS 3.4 with custom dark mode glassmorphism (`#101312` background, `#22C55E` emerald accent)
- **Security:** Bcrypt.js, Node.js Crypto, HttpOnly Cookies
- **Icons:** Lucide React

---

## 📂 Project Structure

```
dealfinder-ai/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Home Page (Hero, Search, Super Deals)
│   │   ├── search/                     # Faceted Search Results & Relevance Engine
│   │   ├── compare/                    # 4-Product Side-by-Side Comparison Matrix
│   │   ├── assistant/                  # AI Shopping Assistant Chatbot
│   │   ├── dashboard/                  # Authenticated User Dashboard
│   │   ├── login/ & signup/            # Secure Shopper Authentication
│   │   ├── forgot-password/            # Secure Password Reset Request
│   │   ├── reset-password/             # Token-Verified Password Reset
│   │   └── api/                        # Secure REST API Endpoints
│   │       ├── auth/                   # login, signup, logout, me, reset routes
│   │       └── user/                   # profile, wishlist, comparisons, alerts
│   ├── components/                     # VoiceInputButton, Navbar, Footer, SearchBar
│   ├── context/                        # AppContext (Session sync, Toast system)
│   ├── lib/
│   │   ├── data/catalog.ts             # 128-Product Multi-Category Catalog
│   │   ├── db/index.ts                 # Secure Database & Session Engine
│   │   └── engine/                     # Search, Price & Adapter Engines
│   └── types/                          # TypeScript Contracts
├── .env.example                        # Production Environment Template
├── .gitignore                          # Strict Exclusion of Runtime Data & Secrets
└── package.json
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.x or later
- npm or yarn

### 2. Environment Setup
```bash
cp .env.example .env.local
```

### 3. Run Locally
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Or build and start production server
npm run build
npm run start
```

Visit [http://localhost:3000](http://localhost:3000).

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
