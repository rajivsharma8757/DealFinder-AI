// src/app/api/user/wishlist/route.ts - User Isolated Wishlist API
import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser, getUserWishlist, toggleUserWishlist } from '@/lib/db';
import { getProductById } from '@/lib/data/catalog';

function getAuthUser(request: NextRequest) {
  const sessionCookie = request.cookies.get('dealfinder_session')?.value;
  const authHeader = request.headers.get('authorization')?.replace('Bearer ', '');
  const token = sessionCookie || authHeader;
  if (!token) return null;
  return getSessionUser(token);
}

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const productIds = getUserWishlist(user.id);
    const products = productIds.map(id => getProductById(id)).filter(Boolean);

    return NextResponse.json({
      success: true,
      wishlistIds: productIds,
      products,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { productId } = await request.json();
    if (!productId) {
      return NextResponse.json({ success: false, error: 'Product ID is required.' }, { status: 400 });
    }

    const { wishlist, added } = toggleUserWishlist(user.id, productId);
    const products = wishlist.map(id => getProductById(id)).filter(Boolean);

    return NextResponse.json({
      success: true,
      added,
      message: added ? 'Added to your wishlist' : 'Removed from your wishlist',
      wishlistIds: wishlist,
      products,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
