// src/app/login/page.tsx - User Login with Secure Authentication
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Lock, Mail, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      setSuccessMessage('Login successful! Redirecting to your dashboard...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 700);
    } else {
      setErrorMessage(res.error || 'Invalid credentials. Please verify and try again.');
    }
  };

  const handleAutofillDemo = () => {
    setEmail('rajiv.sharma@dealfinder.ai');
    setPassword('Password@123');
    setErrorMessage(null);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-green-500 to-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
          <Sparkles className="w-6 h-6 text-black" />
        </div>
        <h1 className="text-2xl font-black text-white">Welcome Back</h1>
        <p className="text-xs text-gray-400">
          Sign in to access your saved comparisons, price drop alerts, and payment cards.
        </p>
      </div>

      {/* Demo Credentials Quick Fill Banner */}
      <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/70 text-xs text-emerald-300 flex items-center justify-between">
        <div>
          <span className="font-bold text-white block">Pre-Configured Demo Account</span>
          <span className="text-[11px] text-gray-400">rajiv.sharma@dealfinder.ai</span>
        </div>
        <button
          type="button"
          onClick={handleAutofillDemo}
          className="px-2.5 py-1.5 rounded-lg bg-emerald-500 text-black font-bold text-[11px] hover:bg-emerald-400 transition-colors"
        >
          Auto-Fill
        </button>
      </div>

      <div className="p-8 rounded-3xl bg-[#191F1C] border border-[#2A352F] shadow-2xl space-y-6">
        
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-xs text-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-xs text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full bg-[#101312] border border-[#2A352F] rounded-xl pl-10 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-gray-300">Password</label>
              <Link href="/forgot-password" className="text-[11px] text-emerald-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#101312] border border-[#2A352F] rounded-xl pl-10 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#2A352F] text-center">
          <p className="text-xs text-gray-400">
            Don't have an account?{' '}
            <Link href="/signup" className="text-emerald-400 font-bold hover:underline">
              Create an Account
            </Link>
          </p>
        </div>

      </div>

    </div>
  );
}
