'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Calendar, Building2, MessageSquare, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/utils/format';
import { rentalService } from '@/services/rental.service';
import { showToast } from '@/components/ui/toastConfig';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

interface RentalRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: {
    id: string;
    title: string;
    rent: number;
  };
  onSuccess?: () => void;
}

export function RentalRequestModal({
  isOpen,
  onClose,
  property,
  onSuccess,
}: RentalRequestModalProps) {
  const [message, setMessage] = useState('');
  const [moveInDate, setMoveInDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await rentalService.createRentalRequest({
        propertyId: property.id,
        message: message.trim() || undefined,
        moveInDate: moveInDate ? new Date(moveInDate).toISOString() : undefined,
      });

      showToast.success('Rental request submitted successfully!');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to submit rental request';
      showToast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-black/5"
        >
          {/* Close Icon Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Modal Header */}
          <div className="space-y-1.5 pb-4 border-b border-gray-100 pr-8">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200/60 px-3 py-0.5 text-xs font-semibold text-[#E91E63]">
              <Building2 className="h-3.5 w-3.5" />
              <span>Rental Request</span>
            </div>
            <h3 className="text-lg font-bold text-[#1F2937] line-clamp-1">{property.title}</h3>
            <p className="text-xs font-semibold text-gray-500">
              Monthly Rent:{' '}
              <span className="text-[#E91E63] font-extrabold">{formatCurrency(property.rent)}</span>
            </p>
          </div>

          {/* Modal Form */}
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Field 1: Target Move-in Date */}
            <div className="space-y-1.5">
              <label htmlFor="moveInDate" className="block text-xs font-bold text-[#1F2937]">
                Expected Move-in Date
              </label>
              <div className="relative flex items-center">
                <Calendar className="absolute left-3.5 h-4 w-4 text-gray-400" />
                <input
                  id="moveInDate"
                  type="date"
                  value={moveInDate}
                  onChange={(e) => setMoveInDate(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-xs sm:text-sm text-[#1F2937] focus:border-[#E91E63] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E91E63]/20"
                />
              </div>
            </div>

            {/* Field 2: Message Textarea */}
            <div className="space-y-1.5">
              <label htmlFor="requestMessage" className="block text-xs font-bold text-[#1F2937]">
                Message to Landlord
              </label>
              <div className="relative">
                <textarea
                  id="requestMessage"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Introduce yourself and specify any requests..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs sm:text-sm text-[#1F2937] placeholder-gray-400 focus:border-[#E91E63] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E91E63]/20 resize-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              <PrimaryButton
                type="submit"
                isLoading={isLoading}
                className="flex-1 py-2.5 text-xs font-semibold rounded-xl shadow-md shadow-rose-500/20"
              >
                <Send className="h-3.5 w-3.5 mr-1" />
                Send Request
              </PrimaryButton>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
