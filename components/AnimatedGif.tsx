'use client';

import { useEffect, useRef } from 'react';

interface AnimatedGifProps {
  src: string;
  alt: string;
  className?: string;
}

export default function AnimatedGif({ src, alt, className = '' }: AnimatedGifProps) {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Force reload the GIF to ensure animation works
    if (imgRef.current) {
      const img = imgRef.current;
      // Get the current src
      const currentSrc = img.src;

      // Clear the src to stop any cached rendering
      img.src = '';

      // Force reload with a small delay to ensure browser processes it
      const timeoutId = setTimeout(() => {
        if (img) {
          // Add a cache-busting parameter
          const separator = currentSrc.includes('?') ? '&' : '?';
          img.src = `${currentSrc.split('?')[0]}${separator}_=${Date.now()}`;

          // After a moment, reload again to ensure animation starts
          setTimeout(() => {
            if (img) {
              img.src = currentSrc.split('?')[0];
            }
          }, 50);
        }
      }, 10);

      return () => clearTimeout(timeoutId);
    }
  }, [src]);

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className={className}
      style={{ imageRendering: 'auto' }}
    />
  );
}
