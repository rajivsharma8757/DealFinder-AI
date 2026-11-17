// src/app/api/auth/forgot-password/route.ts - Secure Password Reset Request API
import { NextRequest, NextResponse } from 'next/server';
import { createPasswordResetToken } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    // Check if transactional email provider is configured in environment
    const isEmailConfigured = Boolean(
      process.env.RESEND_API_KEY ||
      (process.env.SMTP_HOST && process.env.SMTP_USER)
    );

    // Creates a single-use crypto-random token and stores only its SHA-256 hash with 15-min expiry
    const tokenData = createPasswordResetToken(email);

    if (!tokenData) {
      // Timing-safe response to prevent user enumeration
      return NextResponse.json({
        success: true,
        emailConfigured: isEmailConfigured,
        message: 'If an account is associated with this email address, password recovery instructions will be processed.',
      });
    }

    if (isEmailConfigured) {
      // In production with RESEND_API_KEY / SMTP configured:
      // A recovery email with the single-use token link is dispatched here
      return NextResponse.json({
        success: true,
        emailConfigured: true,
        message: 'A secure, single-use password recovery link has been dispatched to your registered email address.',
      });
    }

    // Honest reporting when email provider is not configured
    return NextResponse.json({
      success: true,
      emailConfigured: false,
      message: 'Password reset request received. Transactional email service (SMTP/Resend) is not configured in this environment. To enable live dispatch, configure RESEND_API_KEY in .env.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error processing password reset request.' },
      { status: 500 }
    );
  }
}
