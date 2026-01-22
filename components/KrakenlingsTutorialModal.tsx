'use client';

import { useState, useEffect } from 'react';
import { cookieStorage } from '@/utils/cookieStorage';
import { useLanguage } from '@/contexts/LanguageContext';
import KrakenlingIcon from './KrakenlingIcon';

interface KrakenlingsTutorialModalProps {
  onClose: () => void;
}

export default function KrakenlingsTutorialModal({ onClose }: KrakenlingsTutorialModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    // Show modal with animation
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Mark as seen
    if (typeof window !== 'undefined') {
      cookieStorage.setItem('has-seen-krakenlings-tutorial', 'true');
    }
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div
      className={`fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      style={{ zIndex: 10000 }}
      onClick={handleClose}
    >
      <div
        className={`relative bg-turquoise-800 rounded-2xl p-6 sm:p-8 md:p-12 max-w-md mx-4 border-2 border-turquoise-400 text-center transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center justify-center mb-2">
            <KrakenlingIcon
              size={64}
              className="animate-pulse"
              tint="turquoise"
            />
          </div>

          <h2 className="font-lora text-2xl md:text-3xl font-bold text-turquoise-400">
            {t.krakenlingsTutorial.title}
          </h2>

          <p className="text-white text-base md:text-lg">
            {t.krakenlingsTutorial.message}
          </p>

          <button
            onClick={handleClose}
            className="mt-4 px-6 py-3 bg-turquoise-400 hover:bg-turquoise-300 text-black font-bold rounded-xl transition-colors duration-200"
          >
            {t.krakenlingsTutorial.button}
          </button>
        </div>
      </div>
    </div>
  );
}
