// src/app/api/user/price-alerts/route.ts - User Price Alerts API
import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser, getUserPriceAlerts, addUserPriceAlert, deleteUserPriceAlert } from '@/lib/db';

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
    const { searchParams } = new URL(request.url);
    const emailParam = searchParams.get('email');

    if (!user && !emailParam) {
      return NextResponse.json({ success: true, alerts: [] });
    }

    const alerts = getUserPriceAlerts(user?.id || '', emailParam || user?.email);
    return NextResponse.json({ success: true, alerts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    const body = await request.json();
    const { product_id, product_title, target_price, current_price, email, image } = body;

    if (!product_id || !target_price) {
      return NextResponse.json(
        { success: false, error: 'Product ID and Target Price are required.' },
        { status: 400 }
      );
    }

    const userEmail = email || user?.email || 'shopper@dealfinder.ai';
    const userId = user?.id || 'usr_guest';

    const newAlert = addUserPriceAlert(userId, {
      product_id,
      product_title: product_title || 'Tracked Product',
      target_price: Number(target_price),
      current_price: Number(current_price || target_price),
      email: userEmail,
      image,
    });

    return NextResponse.json({
      success: true,
      message: 'Price drop alert registered successfully! We will notify you when the price reaches your target.',
      alert: newAlert,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Alert ID is required.' }, { status: 400 });
    }

    const deleted = deleteUserPriceAlert(id);
    return NextResponse.json({
      success: deleted,
      message: deleted ? 'Price alert cancelled.' : 'Alert not found.',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
