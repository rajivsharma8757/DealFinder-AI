// src/app/api/user/profile/route.ts - User Profile Management
import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser, getUserProfile, updateUserProfile } from '@/lib/db';

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

    const profile = getUserProfile(user.id);
    return NextResponse.json({ success: true, profile, user });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await request.json();
    const updatedProfile = updateUserProfile(user.id, updates);

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully!',
      profile: updatedProfile,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
