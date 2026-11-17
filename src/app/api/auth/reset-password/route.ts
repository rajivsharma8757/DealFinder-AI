// src/app/api/auth/reset-password/route.ts - Password Reset API
import { NextRequest, NextResponse } from 'next/server';
import { resetPasswordWithToken } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Password reset token is missing or invalid.' },
        { status: 400 }
      );
    }

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'New password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const resetSuccess = resetPasswordWithToken(token, newPassword);

    if (!resetSuccess) {
      return NextResponse.json(
        { success: false, error: 'Reset token is invalid or has expired. Please request a new link.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Password has been updated successfully! You may now log in with your new password.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error updating password.' },
      { status: 500 }
    );
  }
}
