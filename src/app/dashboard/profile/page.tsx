// src/app/dashboard/profile/page.tsx - User Profile Editor & Preference Management
'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  FileText, 
  Image as ImageIcon, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { UserProfile } from '@/types';

export default function ProfileEditorPage() {
  const { user, profile, updateProfileState, addToast, setSelectedBank, selectedBank } = useApp();

  const [fullName, setFullName] = useState(profile?.fullName || user?.name || '');
  const [phone, setPhone] = useState(profile?.phone || user?.phone || '');
  const [bio, setBio] = useState(profile?.bio || user?.bio || '');
  const [location, setLocation] = useState(profile?.location || 'Ambala / Chandigarh, India');
  const [avatar, setAvatar] = useState(profile?.avatar || user?.avatar || '');
  const [preferredCard, setPreferredCard] = useState(profile?.preferredCard || selectedBank || 'HDFC Bank');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Sync when profile loads
  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || user?.name || '');
      setPhone(profile.phone || user?.phone || '');
      setBio(profile.bio || user?.bio || '');
      setLocation(profile.location || 'India');
      setAvatar(profile.avatar || user?.avatar || '');
      setPreferredCard(profile.preferredCard || 'HDFC Bank');
    }
  }, [profile, user]);

  const calculateCompletion = () => {
    let score = 20; // base for email
    if (fullName.trim()) score += 20;
    if (phone.trim()) score += 20;
    if (bio.trim()) score += 15;
    if (location.trim()) score += 15;
    if (avatar.trim()) score += 10;
    return Math.min(100, score);
  };

  const completionPct = calculateCompletion();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const updates: Partial<UserProfile> = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        bio: bio.trim(),
        location: location.trim(),
        avatar: avatar.trim(),
        preferredCard,
        completionPct,
      };

      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        updateProfileState(data.profile);
        setSelectedBank(preferredCard);
        addToast('Profile saved successfully to database!', 'success');
        setMessage({ text: 'Your profile has been saved successfully.', type: 'success' });
      } else {
        setMessage({ text: data.error || 'Failed to update profile.', type: 'error' });
      }
    } catch {
      setMessage({ text: 'Network error occurred while saving profile.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const availableCards = [
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'SBI Card',
    'Kotak Mahindra Bank',
    'IDFC FIRST Bank',
    'None (Regular MRP)'
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#191F1C] border border-[#2A352F] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-400" />
            <span>Shopper Profile & Preferences</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Manage your personal identity, contact information, and default payment card for deal calculations.
          </p>
        </div>

        {/* Profile Completion Badge */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-[#101312] border border-[#2A352F]">
          <div className="text-right">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Completeness</span>
            <span className="text-sm font-black text-emerald-400">{completionPct}%</span>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-emerald-500/30 flex items-center justify-center p-1">
            <div
              className="w-full h-full rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px] font-bold text-emerald-400"
            >
              ✓
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`p-3.5 rounded-2xl text-xs flex items-center gap-2.5 border ${
            message.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-800 text-emerald-200'
              : 'bg-red-950/80 border-red-800 text-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSave} className="p-8 rounded-3xl bg-[#191F1C] border border-[#2A352F] space-y-6">
        
        {/* Avatar Preview */}
        <div className="flex items-center gap-5 pb-6 border-b border-[#2A352F]">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-tr from-emerald-600 via-green-500 to-emerald-400 flex items-center justify-center text-black font-black text-3xl shadow-xl shadow-emerald-500/20 border-2 border-emerald-500/40 flex-shrink-0">
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              fullName.charAt(0) || 'U'
            )}
          </div>

          <div className="flex-grow space-y-1">
            <label className="block text-xs font-semibold text-gray-300">Avatar Image URL</label>
            <div className="relative">
              <ImageIcon className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full bg-[#101312] border border-[#2A352F] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <p className="text-[11px] text-gray-500">Provide an image URL to customize your avatar icon.</p>
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-300">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full bg-[#101312] border border-[#2A352F] rounded-xl pl-10 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>
          </div>

          {/* Email (Read Only) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-gray-300">Registered Email Address</label>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Verified
              </span>
            </div>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={user?.email || profile?.email || 'rajiv.sharma@dealfinder.ai'}
                disabled
                className="w-full bg-[#141816] border border-[#222B26] rounded-xl pl-10 pr-3 py-2.5 text-xs text-gray-400 cursor-not-allowed font-medium"
              />
            </div>
          </div>

          {/* Mobile Phone */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-300">Mobile Phone</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-[#101312] border border-[#2A352F] rounded-xl pl-10 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>
          </div>

          {/* Location / City */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-300">Location / City</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ambala, Chandigarh, Delhi, India"
                className="w-full bg-[#101312] border border-[#2A352F] rounded-xl pl-10 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>
          </div>

        </div>

        {/* Preferred Bank Card */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-300">Primary Bank Card for Offer Optimization</label>
          <div className="relative">
            <CreditCard className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              value={preferredCard}
              onChange={(e) => setPreferredCard(e.target.value)}
              className="w-full bg-[#101312] border border-[#2A352F] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
            >
              {availableCards.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <p className="text-[11px] text-gray-500">
            DealFinder AI automatically checks eligible instant discounts for this card across Amazon, Flipkart, Croma, and others.
          </p>
        </div>

        {/* Bio / Shopping Preferences */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-300">Bio & Shopping Preferences</label>
          <div className="relative">
            <FileText className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. B.Tech CSE Final Year student exploring electronics deals, tech gear, and gaming equipment..."
              className="w-full bg-[#101312] border border-[#2A352F] rounded-xl pl-10 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium resize-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-black font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving to Database...' : 'Save Profile Changes'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
