// src/app/forgot-password/page.tsx - Password Reset
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-green-500 to-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
          <Sparkles className="w-6 h-6 text-black" />
        </div>
        <h1 className="text-2xl font-black text-white">Reset Password</h1>
        <p className="text-xs text-gray-400">
          Enter your registered email address and we'll send you a password recovery link.
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-[#191F1C] border border-[#2A352F] shadow-2xl space-y-6">
        {sent ? (
          <div className="text-center space-y-4 py-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="font-bold text-white text-base">Check Your Inbox</h3>
            <p className="text-xs text-gray-400">
              We have dispatched a password reset link to <strong className="text-emerald-400">{email}</strong>.
            </p>
            <Link
              href="/login"
              className="inline-block px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rajiv@example.com"
                  required
                  className="w-full bg-[#101312] border border-[#2A352F] rounded-xl pl-10 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-all shadow-lg shadow-emerald-500/20"
            >
              Send Reset Link
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-[#2A352F] text-center text-xs">
          <Link href="/login" className="text-gray-400 hover:text-white flex items-center justify-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>

    </div>
  );
}
