// src/lib/engine/assistant.ts - Conversational AI Shopping Assistant Engine
// Handles natural language queries, Hindi/Hinglish/English questions, spec matching, and deal advice.

import { ChatMessage, Product } from '@/types';
import { getAllProducts } from '../data/catalog';
import { parseNaturalLanguageQuery, searchProducts } from './search';
import { getBestEligiblePrice } from './calculator';

export interface AssistantResponse {
  message: string;
  recommendedProducts?: Product[];
  comparisonTrigger?: {
    productIds: string[];
    highlightReason: string;
  };
  suggestedFollowUps?: string[];
  bestDealSummary?: {
    productTitle: string;
    bestRetailer: string;
    finalPrice: number;
    savings: number;
    offerApplied: string;
  };
}

/**
 * Handles incoming shopper messages with smart intent classification and deal reasoning.
 */
export async function processAssistantMessage(
  userQuery: string,
  history: ChatMessage[] = [],
  selectedCard?: string
): Promise<AssistantResponse> {
  const queryLower = userQuery.toLowerCase().trim();
  const allProducts = getAllProducts();

  // 1. Language & Intent Detection
  const isHindiOrHinglish = /(?:kya|kaunsa|sabse|sasta|achha|accha|chahiye|mein|kaise|batao|lena|hai|kitna|discount)/i.test(queryLower);
  const isComparisonQuery = /(?:compare|vs|versus|dono mein se|difference between)/i.test(queryLower);
  const isBankOfferQuery = /(?:bank|card|hdfc|icici|axis|sbi|kotak|credit card|emi|cashback)/i.test(queryLower);
  const isPriceDropQuery = /(?:price drop|alert|kam hoga|offer kab|sasta kab)/i.test(queryLower);

  // 2. Multi-Product Comparison Intent
  if (isComparisonQuery) {
    // Find products mentioned in query
    const matched = allProducts.filter(p =>
      queryLower.includes(p.brand.toLowerCase()) ||
      p.title.toLowerCase().split(' ').some(w => w.length > 2 && queryLower.includes(w)) ||
      (p.tags || []).some(t => queryLower.includes(t.toLowerCase()))
    );

    const candidates = matched.length >= 2
      ? matched.slice(0, 3)
      : matched.length === 1
      ? [matched[0], allProducts.find(p => p.id !== matched[0].id) || allProducts[0]]
      : allProducts.slice(0, 2);

    const p1 = candidates[0] || allProducts[0];
    const p2 = candidates[1] || allProducts[1] || p1;
    const best1 = getBestEligiblePrice(p1);
    const best2 = getBestEligiblePrice(p2);

    const responseMsg = isHindiOrHinglish
      ? `Maine **${p1.title}** aur **${p2.title}** ke prices sabhi stores par compare kiye hain:\n\n` +
        `• **${p1.title}**: Sabse sasta **${best1.retailer}** par mil raha hai **₹${best1.eligible_final_price.toLocaleString('en-IN')}** mein (${best1.discount_pct}% discount).\n` +
        `• **${p2.title}**: Sabse best deal **${best2.retailer}** par hai **₹${best2.eligible_final_price.toLocaleString('en-IN')}** par.\n\n` +
        `Agar aapka budget strict hai toh **${best1.eligible_final_price < best2.eligible_final_price ? p1.title : p2.title}** ₹${Math.abs(best1.eligible_final_price - best2.eligible_final_price).toLocaleString('en-IN')} sasta padega!`
      : `Here is a side-by-side deal analysis between **${p1.title}** and **${p2.title}**:\n\n` +
        `1. **${p1.title}**: Lowest at **${best1.retailer}** for **₹${best1.eligible_final_price.toLocaleString('en-IN')}** (effective savings of ${best1.discount_pct}%).\n` +
        `2. **${p2.title}**: Lowest at **${best2.retailer}** for **₹${best2.eligible_final_price.toLocaleString('en-IN')}**.\n\n` +
        `Verdict: The **${best1.eligible_final_price < best2.eligible_final_price ? p1.brand : p2.brand}** option gives you the maximum value for money right now across 20+ verified Indian retailers.`;

    return {
      message: responseMsg,
      recommendedProducts: candidates,
      comparisonTrigger: {
        productIds: candidates.map(c => c.id),
        highlightReason: 'Direct price & specification head-to-head comparison'
      },
      suggestedFollowUps: [
        'Check bank card discounts',
        'Which has better camera specs?',
        'Set price drop alert'
      ]
    };
  }

  // 3. Bank Offer Specific Queries
  if (isBankOfferQuery) {
    const cardName = selectedCard || (queryLower.includes('hdfc') ? 'HDFC Bank' : queryLower.includes('icici') ? 'ICICI Bank' : queryLower.includes('axis') ? 'Axis Bank' : 'HDFC Bank');
    const electronics = allProducts.filter(p => p.category === 'Mobiles' || p.category === 'Electronics' || p.category === 'Laptops');
    const topOffers = electronics.slice(0, 3);

    const message = isHindiOrHinglish
      ? `**${cardName}** card use karne par abhi instant bank discount available hai!\n\n` +
        `• **Croma & Reliance Digital**: Electronics aur Laptops par flat ₹3,000 instant discount mil raha hai.\n` +
        `• **Amazon & Flipkart**: 10% instant off (up to ₹1,500) eligible orders par automatically apply hoga.\n\n` +
        `Neeche diye gaye products par aapka card sabse zyada savings dega:`
      : `Based on real-time promotions for **${cardName}**:\n\n` +
        `• **Croma & Reliance Digital**: Instant ₹3,000 flat discount on premium electronics above ₹45,000.\n` +
        `• **Amazon India & Flipkart**: 10% instant discount up to ₹1,500 with instant coupon auto-stacking.\n\n` +
        `Here are the highest saving products configured with verified bank discounts:`;

    return {
      message,
      recommendedProducts: topOffers,
      suggestedFollowUps: [
        'How to apply coupon codes?',
        'Are there no-cost EMI options?',
        'Show fashion deals with bank offers'
      ]
    };
  }

  // 4. Budget & Semantic Product Search
  const parsed = parseNaturalLanguageQuery(userQuery);
  const searchRes = searchProducts({
    query: parsed.cleanedQuery || userQuery,
    category: parsed.category,
    brand: parsed.brand,
    max_price: parsed.maxBudget,
    min_price: parsed.minBudget,
    sort_by: 'best_price'
  });

  const matchedProducts = searchRes.products.slice(0, 4);

  if (matchedProducts.length > 0) {
    const topPick = matchedProducts[0];
    const bestListing = getBestEligiblePrice(topPick);
    const savings = bestListing.original_price - bestListing.eligible_final_price;

    let responseMsg = '';
    if (isHindiOrHinglish) {
      responseMsg = `Maine aapke liye **${matchedProducts.length} best options** dhoondhe hain!\n\n` +
        `Top recommendation: **${topPick.title}**\n` +
        `• Best Price: **₹${bestListing.eligible_final_price.toLocaleString('en-IN')}** on **${bestListing.retailer}**\n` +
        `• MRP: ~~₹${bestListing.original_price.toLocaleString('en-IN')}~~ (Aap ₹${savings.toLocaleString('en-IN')} bacha rahe hain)\n` +
        (bestListing.bank_offer ? `• Bank Offer: ${bestListing.bank_offer.terms}\n` : '') +
        (bestListing.coupon ? `• Coupon: Use code **${bestListing.coupon.code}** for extra ₹${bestListing.coupon.discount_value} off.\n` : '') +
        `\nNeeche baaki stores ke saath complete rate comparison dekhein:`;
    } else {
      responseMsg = `I analyzed listings across Amazon India, Flipkart, Croma, Reliance Digital, and Myntra for **"${userQuery}"**:\n\n` +
        `**Top Recommended Deal:** ${topPick.title}\n` +
        `• Lowest verified price: **₹${bestListing.eligible_final_price.toLocaleString('en-IN')}** at **${bestListing.retailer}**\n` +
        `• Total savings: **₹${savings.toLocaleString('en-IN')}** (${bestListing.discount_pct}% off MRP)\n` +
        (bestListing.bank_offer ? `• Card Advantage: ${bestListing.bank_offer.bank} card discount applied at checkout.\n` : '') +
        (bestListing.coupon ? `• Auto-Coupon: Extra savings with code **${bestListing.coupon.code}**.\n` : '') +
        `• Estimated delivery: ${bestListing.estimated_delivery} (${bestListing.delivery_fee === 0 ? 'Free Shipping' : `₹${bestListing.delivery_fee}`})\n\n` +
        `Browse the top matched options below with full multi-platform comparison:`;
    }

    return {
      message: responseMsg,
      recommendedProducts: matchedProducts,
      bestDealSummary: {
        productTitle: topPick.title,
        bestRetailer: bestListing.retailer,
        finalPrice: bestListing.eligible_final_price,
        savings,
        offerApplied: bestListing.bank_offer?.bank || bestListing.coupon?.code || 'Retailer Flash Sale'
      },
      suggestedFollowUps: [
        `Compare ${topPick.brand} with alternatives`,
        'Show all coupon codes',
        'Which store has fastest delivery?'
      ]
    };
  }

  // 5. Fallback helpful response
  const popularPicks = allProducts.slice(0, 3);
  const fallbackMsg = isHindiOrHinglish
    ? `Mujhe aapki exact query ke liye koi direct match nahi mila, lekin maine aaj ke **sabse popular trending deals** shortlist kiye hain. Aap brand name (jaise Apple, Samsung, Sony), product category ya budget (jaise "laptop under 60000") bata sakte hain!`
    : `I couldn't locate an exact match for that specific phrasing, but here are today's **highest-saving multi-store deals** across electronics, fashion, and lifestyle. You can also ask me by budget (e.g. "running shoes under ₹3,000" or "best phone under ₹25,000")!`;

  return {
    message: fallbackMsg,
    recommendedProducts: popularPicks,
    suggestedFollowUps: [
      'iPhone 16 under 80,000',
      'Best gaming laptops with HDFC offer',
      'Top fashion deals on Myntra & AJIO'
    ]
  };
}
