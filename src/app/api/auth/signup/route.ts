// src/app/api/auth/signup/route.ts - Secure User Registration API
import { NextRequest, NextResponse } from 'next/server';
import { createUser, createSession, getUserByEmail } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, phone } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Full name is required.' }, { status: 400 });
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'A valid email address is required.' }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existing = getUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'An account with this email address already exists. Please log in.' },
        { status: 409 }
      );
    }

    // Create user in persistent DB
    const result = createUser({
      name: name.trim(),
      email: email.trim(),
      password,
      phone: phone?.trim() || '',
    });

    if (result.error || !result.user) {
      return NextResponse.json({ success: false, error: result.error || 'Failed to create user.' }, { status: 400 });
    }

    // Create cryptographically secure session on server
    const token = createSession(result.user.id);

    // Response never exposes session token in JSON body
    const response = NextResponse.json({
      success: true,
      message: 'Account created successfully!',
      user: result.user,
    });

    // Session token is strictly set in HttpOnly, Secure cookie
    response.cookies.set('dealfinder_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error during registration.' },
      { status: 500 }
    );
  }
}
