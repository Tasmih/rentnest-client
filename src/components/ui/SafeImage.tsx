'use client';

import React, { useState, useEffect } from 'react';
import { DEFAULT_PROPERTY_IMAGE } from '@/constants/property.constants';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export function SafeImage({
  src,
  alt = 'Property Image',
  fallbackSrc = DEFAULT_PROPERTY_IMAGE,
  className,
  ...props
}: SafeImageProps) {
  const initialSrc = typeof src === 'string' && src.trim() !== '' ? src : fallbackSrc;
  const [imgSrc, setImgSrc] = useState<string>(initialSrc);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const nextSrc = typeof src === 'string' && src.trim() !== '' ? src : fallbackSrc;
    setImgSrc(nextSrc);
    setHasError(false);
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <img
      {...props}
      src={imgSrc || fallbackSrc}
      alt={alt}
      onError={handleError}
      className={className}
    />
  );
}
