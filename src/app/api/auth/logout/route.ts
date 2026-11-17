// src/app/api/auth/logout/route.ts - User Sign Out API
import { NextRequest, NextResponse } from 'next/server';
import { deleteSession } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('dealfinder_session')?.value;
    const authHeader = request.headers.get('authorization')?.replace('Bearer ', '');
    const token = sessionCookie || authHeader;

    if (token) {
      deleteSession(token);
    }

    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully.',
    });

    // Explicitly expire and delete the session cookie
    response.cookies.set('dealfinder_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error logging out.' },
      { status: 500 }
    );
  }
}
