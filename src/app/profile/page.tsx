// src/app/profile/page.tsx - Redirect & Render Profile Editor
'use client';

import React from 'react';
import ProfileEditorPage from '@/app/dashboard/profile/page';

export default function ProfileRootPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ProfileEditorPage />
    </div>
  );
}
