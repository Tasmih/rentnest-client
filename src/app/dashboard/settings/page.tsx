'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Settings, Lock, Bell, Shield, Save, KeyRound } from 'lucide-react';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { showToast } from '@/components/ui/toastConfig';

export default function SettingsPage() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast.error('Please enter your current password');
      return;
    }
    if (newPassword.length < 6) {
      showToast.error('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast.error('New passwords do not match');
      return;
    }

    showToast.success('Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSaveNotifications = () => {
    showToast.success('Notification preferences updated');
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200/60 px-3 py-1 text-xs font-semibold text-[#E91E63] mb-1">
          <Settings className="h-3.5 w-3.5" />
          <span>System Settings</span>
        </div>
        <h1 className="text-2xl font-extrabold text-[#1F2937]">Account & Security Settings</h1>
      </div>

      {/* Security & Password Card */}
      <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#1F2937] border-b border-gray-100 pb-3 flex items-center gap-2">
          <Lock className="h-4 w-4 text-[#E91E63]" />
          Change Password
        </h2>

        <form onSubmit={handleChangePassword} className="space-y-4">
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

      {/* Notifications Preference Card */}
      <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#1F2937] border-b border-gray-100 pb-3 flex items-center gap-2">
          <Bell className="h-4 w-4 text-[#0EA5A4]" />
          Notification Preferences
        </h2>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 cursor-pointer">
            <div>
              <span className="text-xs font-bold text-[#1F2937] block">Email Notifications</span>
              <span className="text-[11px] text-gray-500">Receive email alerts for rental applications and updates</span>
            </div>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="h-4 w-4 rounded text-[#E91E63] focus:ring-[#E91E63]"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 cursor-pointer">
            <div>
              <span className="text-xs font-bold text-[#1F2937] block">SMS Phone Alerts</span>
              <span className="text-[11px] text-gray-500">Receive urgent SMS notifications on your mobile number</span>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
              className="h-4 w-4 rounded text-[#E91E63] focus:ring-[#E91E63]"
            />
          </label>
        </div>

        <button
          onClick={handleSaveNotifications}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-teal-50 border border-teal-200 text-[#0EA5A4] hover:bg-teal-100 transition-colors"
        >
          <Save className="h-3.5 w-3.5" />
          <span>Save Preferences</span>
        </button>
      </div>
    </div>
  );
}
