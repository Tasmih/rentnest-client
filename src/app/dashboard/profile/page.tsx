'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { User, Mail, Phone, Shield, Edit, Save, Lock, KeyRound, ShieldCheck } from 'lucide-react';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { showToast } from '@/components/ui/toastConfig';
import { ImageUploadInput } from '@/components/ui/ImageUploadInput';
import { SafeImage } from '@/components/ui/SafeImage';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Editable Profile States
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');

  // Security Form States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!user) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast.error('Name cannot be empty');
      return;
    }

    const updatedUser = {
      ...user,
      name: name.trim(),
      phone: phone.trim() || undefined,
      avatarUrl: avatarUrl.trim() || undefined,
    };

    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    showToast.success('Profile information updated successfully!');
    setIsEditing(false);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast.error('Please enter your current password');
      return;
    }
    if (newPassword.length < 6) {
      showToast.error('New password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast.error('New passwords do not match');
      return;
    }

    showToast.success('Security password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 border-purple-300 text-purple-800';
      case 'LANDLORD':
        return 'bg-teal-50 border-teal-200 text-[#0EA5A4]';
      default:
        return 'bg-rose-50 border-rose-200 text-[#E91E63]';
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* 1. Profile Header Card */}
      <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          {avatarUrl || user.avatarUrl ? (
            <SafeImage
              src={avatarUrl || user.avatarUrl}
              alt={user.name}
              className="h-20 w-20 rounded-full object-cover border-2 border-[#E91E63] shadow-md shrink-0"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-rose-100 text-[#E91E63] font-extrabold text-2xl shadow-inner shrink-0">
              {user.name?.[0] || 'U'}
            </div>
          )}

          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#1F2937]">{user.name}</h1>
              <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${getRoleBadgeStyle(user.role)}`}>
                <ShieldCheck className="h-3 w-3" />
                {user.role}
              </span>
            </div>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing((prev) => !prev)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors shrink-0"
        >
          <Edit className="h-3.5 w-3.5" />
          <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
        </button>
      </div>

      {/* 2. Personal Information Section */}
      <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#1F2937] border-b border-gray-100 pb-3 flex items-center gap-2">
          <User className="h-4 w-4 text-[#E91E63]" />
          Personal Information
        </h2>

        {!isEditing ? (
          /* Readonly View Mode */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="rounded-xl bg-gray-50 p-3.5 border border-gray-100 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Full Name</span>
              <div className="flex items-center gap-2 text-xs font-bold text-[#1F2937]">
                <User className="h-4 w-4 text-[#E91E63]" />
                <span>{user.name}</span>
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 p-3.5 border border-gray-100 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Email Address (Readonly)</span>
              <div className="flex items-center gap-2 text-xs font-bold text-[#1F2937]">
                <Mail className="h-4 w-4 text-[#0EA5A4]" />
                <span>{user.email}</span>
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 p-3.5 border border-gray-100 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Phone Number</span>
              <div className="flex items-center gap-2 text-xs font-bold text-[#1F2937]">
                <Phone className="h-4 w-4 text-emerald-600" />
                <span>{user.phone || 'Not provided'}</span>
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 p-3.5 border border-gray-100 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Role Access (Readonly)</span>
              <div className="flex items-center gap-2 text-xs font-bold text-[#1F2937]">
                <Shield className="h-4 w-4 text-amber-600" />
                <span className="capitalize">{user.role.toLowerCase()}</span>
              </div>
            </div>
          </div>
        ) : (
          /* Editable Form Mode */
          <form onSubmit={handleSaveProfile} className="space-y-4 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs sm:text-sm text-[#1F2937] focus:border-[#E91E63] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 01700000000"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs sm:text-sm text-[#1F2937] focus:border-[#E91E63] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-500">Email Address (Readonly)</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full rounded-xl border border-gray-200 bg-gray-100 p-2.5 text-xs sm:text-sm text-gray-500 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-500">System Role (Readonly)</label>
                <input
                  type="text"
                  value={user.role}
                  disabled
                  className="w-full rounded-xl border border-gray-200 bg-gray-100 p-2.5 text-xs sm:text-sm text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700 mb-1">Avatar Image</label>
              <ImageUploadInput
                value={avatarUrl}
                onChange={(url) => setAvatarUrl(url)}
              />
            </div>

            <div className="pt-2">
              <PrimaryButton type="submit" fullWidth size="md" className="rounded-xl font-semibold">
                <Save className="h-4 w-4 mr-1.5" />
                Save Personal Information
              </PrimaryButton>
            </div>
          </form>
        )}
      </div>

      {/* 3. Security Section (Change Password) */}
      <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#1F2937] border-b border-gray-100 pb-3 flex items-center gap-2">
          <Lock className="h-4 w-4 text-[#E91E63]" />
          Account Security & Password
        </h2>

        <form onSubmit={handleChangePassword} className="space-y-4 pt-1">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-700">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs sm:text-sm text-[#1F2937] focus:border-[#E91E63] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs sm:text-sm text-[#1F2937] focus:border-[#E91E63] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs sm:text-sm text-[#1F2937] focus:border-[#E91E63] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-1">
            <PrimaryButton type="submit" size="md" className="rounded-xl font-semibold">
              <KeyRound className="h-4 w-4 mr-1.5" />
              Update Password
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}
