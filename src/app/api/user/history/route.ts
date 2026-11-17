// src/app/api/user/history/route.ts - Search History API
import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser, getUserSearchHistory, addUserSearchHistory, clearUserSearchHistory } from '@/lib/db';

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
      return NextResponse.json({ success: false, history: [] });
    }

    const history = getUserSearchHistory(user.id);
    return NextResponse.json({ success: true, history });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: true }); // silently ignore unauth history
    }

    const { query } = await request.json();
    if (query) {
      addUserSearchHistory(user.id, query);
    }

    return NextResponse.json({ success: true });
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

    clearUserSearchHistory(user.id);
    return NextResponse.json({ success: true, message: 'Search history cleared.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
