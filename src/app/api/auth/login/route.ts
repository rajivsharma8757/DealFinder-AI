// src/app/api/auth/login/route.ts - Secure User Authentication API
import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, verifyPassword, createSession } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const user = getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password. Please verify your credentials.' },
        { status: 401 }
      );
    }

    const isValid = verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password. Please verify your credentials.' },
        { status: 401 }
      );
    }

    // Create cryptographically secure session token on server
    const token = createSession(user.id);

    // Return sanitized public user object - never expose password hashes or reset tokens
    const { passwordHash: _, resetTokenHash: __, resetTokenExpiry: ___, ...publicUser } = user;

    // Secure response: token is NEVER returned in the JSON payload
    const response = NextResponse.json({
      success: true,
      message: 'Login successful!',
      user: publicUser,
    });

    // Session token is strictly set in HttpOnly, Secure, SameSite cookie
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
      { success: false, error: error.message || 'Internal server error during login.' },
      { status: 500 }
    );
  }
}
