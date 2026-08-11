'use client';

import React, { useState } from 'react';
import { Link as LinkIcon, UploadCloud, X, Loader2, CheckCircle2 } from 'lucide-react';
import { uploadImageFile } from '@/utils/imageUpload';
import { showToast } from '@/components/ui/toastConfig';

interface ImageUploadInputProps {
  value?: string;
  onChange: (url: string) => void;
  error?: string;
}

export function ImageUploadInput({ value = '', onChange, error }: ImageUploadInputProps) {
  const [activeTab, setActiveTab] = useState<'url' | 'upload'>('url');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast.error('Please select a valid image file (PNG, JPG, WEBP)');
      return;
    }

    try {
      setIsUploading(true);
      const imageUrl = await uploadImageFile(file);
      onChange(imageUrl);
      showToast.success('Image loaded successfully');
    } catch (err: any) {
      showToast.error('Failed to process uploaded image');
    } finally {
      setIsUploading(false);
    }
  };

  const safeValue = value || '';

  return (
    <div className="space-y-3">
      {/* Option Mode Selector Tabs */}
      <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-xl w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('url')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'url'
              ? 'bg-white text-[#E91E63] shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <LinkIcon className="h-3.5 w-3.5" />
          <span>Paste Image URL</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'upload'
              ? 'bg-white text-[#E91E63] shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <UploadCloud className="h-3.5 w-3.5" />
          <span>Upload Image File</span>
        </button>
      </div>

      {/* Mode 1: URL Input */}
      {activeTab === 'url' && (
        <div className="space-y-2">
          <div className="relative flex items-center">
            <LinkIcon className="absolute left-3.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={safeValue}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-xs sm:text-sm text-[#1F2937] placeholder-gray-400 focus:border-[#E91E63] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E91E63]/20"
            />
          </div>
        </div>
      )}

      {/* Mode 2: File Upload */}
      {activeTab === 'upload' && (
        <div className="space-y-2">
          <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 hover:bg-rose-50/40 hover:border-[#E91E63]/50 cursor-pointer transition-all">
            <div className="flex flex-col items-center justify-center p-4 text-center">
              {isUploading ? (
                <div className="flex items-center gap-2 text-xs font-semibold text-[#E91E63]">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Processing Image...</span>
                </div>
              ) : (
                <>
                  <UploadCloud className="h-8 w-8 text-[#0EA5A4] mb-1.5" />
                  <p className="text-xs font-bold text-[#1F2937]">
                    Click or Drag & Drop image file here
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Supports PNG, JPG, JPEG, WEBP (Max 5MB)
                  </p>
                </>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              disabled={isUploading}
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      )}

      {/* Image Preview Box */}
      {safeValue && (
        <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 shadow-inner group">
          <img src={safeValue} alt="Cover Preview" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-gray-800 shadow">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Cover Image Selected
            </span>
            <button
              type="button"
              onClick={() => onChange('')}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow"
              title="Remove Image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-[11px] font-medium text-rose-500">{error}</p>}
    </div>
  );
}
