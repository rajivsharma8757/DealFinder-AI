// src/app/api/user/comparisons/route.ts - Saved Comparisons API
import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser, getUserComparisons, saveUserComparison, deleteUserComparison } from '@/lib/db';
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

    const rawComparisons = getUserComparisons(user.id);
    const enriched = rawComparisons.map(c => ({
      ...c,
      products: c.productIds.map(id => getProductById(id)).filter(Boolean)
    }));

    return NextResponse.json({
      success: true,
      comparisons: enriched,
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

    const { title, productIds } = await request.json();
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one product ID is required to save a comparison.' },
        { status: 400 }
      );
    }

    const saved = saveUserComparison(user.id, title || 'My Comparison', productIds);

    return NextResponse.json({
      success: true,
      message: 'Comparison saved to your dashboard.',
      comparison: saved,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Comparison ID is required.' }, { status: 400 });
    }

    const deleted = deleteUserComparison(user.id, id);

    return NextResponse.json({
      success: deleted,
      message: deleted ? 'Comparison deleted successfully.' : 'Comparison not found.',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
