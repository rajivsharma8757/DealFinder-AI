// src/app/api/auth/me/route.ts - Get Current Authenticated User & Profile
import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser, getUserProfile } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('dealfinder_session')?.value;
    const authHeader = request.headers.get('authorization')?.replace('Bearer ', '');
    const token = sessionCookie || authHeader;

    if (!token) {
      return NextResponse.json(
        { success: false, authenticated: false, user: null },
        { status: 401 }
      );
    }

    const user = getSessionUser(token);
    if (!user) {
      return NextResponse.json(
        { success: false, authenticated: false, user: null },
        { status: 401 }
      );
    }

    const profile = getUserProfile(user.id);

    return NextResponse.json({
      success: true,
      authenticated: true,
      user,
      profile,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error fetching user session.' },
      { status: 500 }
    );
  }
}
