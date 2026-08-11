'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  /** Current rating value (1-5) */
  rating: number;
  /** If true, stars are clickable for selection */
  interactive?: boolean;
  /** Callback when a star is clicked (interactive mode only) */
  onChange?: (rating: number) => void;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Show numeric label beside stars */
  showLabel?: boolean;
  /** Total count label text e.g. "(12 reviews)" */
  countLabel?: string;
}

const sizeMap = {
  sm: 'h-3.5 w-3.5',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

export function RatingStars({
  rating,
  interactive = false,
  onChange,
  size = 'md',
  showLabel = false,
  countLabel,
}: RatingStarsProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const starSize = sizeMap[size];

  const displayRating = hovered !== null ? hovered : rating;

  return (
    <div className="inline-flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= displayRating;
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(star)}
            onMouseEnter={() => interactive && setHovered(star)}
            onMouseLeave={() => interactive && setHovered(null)}
            className={`focus:outline-none transition-transform ${
              interactive
                ? 'cursor-pointer hover:scale-110 active:scale-95'
                : 'cursor-default'
            }`}
            aria-label={interactive ? `Rate ${star} star${star !== 1 ? 's' : ''}` : `${star} stars`}
          >
            <Star
              className={`${starSize} transition-colors ${
                filled ? 'fill-amber-400 text-amber-400' : 'fill-none text-gray-300'
              }`}
            />
          </button>
        );
      })}

      {showLabel && (
        <span className="text-xs font-bold text-gray-700 ml-1">
          {rating.toFixed(1)}
          {countLabel && (
            <span className="text-gray-400 font-normal ml-1">{countLabel}</span>
          )}
        </span>
      )}
    </div>
  );
}
