'use client';

import { useEffect } from 'react';
import { formatKrakenValue } from '@/utils/formatNumber';

interface FloatingTextProps {
  value: number;
  x: number; // Position in percentage
  y: number; // Position in percentage
  onComplete: () => void;
}

export default function FloatingText({ value, x, y, onComplete }: FloatingTextProps) {
  useEffect(() => {
    // Call onComplete after animation finishes
    const timer = setTimeout(() => {
      onComplete();
    }, 1500); // Match animation duration

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className="fixed pointer-events-none z-[99999] select-none animate-float-up"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, 0)',
      }}
    >
      <div className="text-turquoise-400 font-bold text-xl md:text-2xl drop-shadow-[0_0_8px_rgba(17,180,187,0.8)] whitespace-nowrap">
        +{formatKrakenValue(value)}
      </div>
    </div>
  );
}

