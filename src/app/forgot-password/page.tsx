// src/app/forgot-password/page.tsx - Secure Password Reset Request
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Mail, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Info } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('rajiv.sharma@dealfinder.ai');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [emailConfigured, setEmailConfigured] = useState(false);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
        setEmailConfigured(Boolean(data.emailConfigured));
        setServerMessage(data.message);
      } else {
        setErrorMessage(data.error || 'Failed to process password reset request.');
      }
    } catch {
      setErrorMessage('Network error occurred. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-green-500 to-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
          <Sparkles className="w-6 h-6 text-black" />
        </div>
        <h1 className="text-2xl font-black text-white">Reset Password</h1>
        <p className="text-xs text-gray-400">
          Enter your registered email address to initiate secure password recovery.
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-[#191F1C] border border-[#2A352F] shadow-2xl space-y-6">
        
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-xs text-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {submitted ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            
            <h3 className="font-bold text-white text-base">Request Processed</h3>
            
            <p className="text-xs text-gray-300 leading-relaxed">
              {serverMessage}
            </p>

            {!emailConfigured && (
              <div className="p-3.5 bg-[#121614] border border-amber-900/50 rounded-xl text-left space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
                  <Info className="w-3.5 h-3.5" />
                  <span>Development Environment Note</span>
                </div>
                <p className="text-[11px] text-gray-400 leading-normal">
                  Live email delivery is disabled because <code className="text-amber-300">RESEND_API_KEY</code> is not configured. For security, reset tokens are cryptographically hashed and never returned in API responses.
                </p>
              </div>
            )}

            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/reset-password"
                className="w-full py-2.5 px-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Have a Security Token? Reset Password</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              
              <Link href="/login" className="text-xs text-gray-400 hover:text-emerald-400 transition-colors pt-2">
                ← Return to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Registered Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#101312] border border-[#2A352F] text-white text-xs placeholder:text-gray-600 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                A single-use, 15-minute recovery token will be generated.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <span>Generating secure request...</span>
              ) : (
                <>
                  <span>Send Recovery Instructions</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-2 text-center">
              <Link href="/login" className="text-xs text-gray-400 hover:text-emerald-400 transition-colors">
                ← Back to Login
              </Link>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
