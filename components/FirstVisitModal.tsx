'use client';

import { useState, useEffect } from 'react';
import { cookieStorage } from '@/utils/cookieStorage';
import KrakenlingIcon from './KrakenlingIcon';
import { useLanguage } from '@/contexts/LanguageContext';

interface FirstVisitModalProps {
  onComplete: () => void;
}

export default function FirstVisitModal({ onComplete }: FirstVisitModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isCollecting, setIsCollecting] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Check if user has already seen the first visit modal
    const hasSeenFirstVisit = cookieStorage.getItem('has-seen-first-visit');
    if (!hasSeenFirstVisit) {
      setIsVisible(true);
    } else {
      // If already seen, immediately call onComplete to show content
      onComplete();
    }
  }, [onComplete]);

  const handleKrakenlingClick = () => {
    if (isCollecting) return;
    
    setIsCollecting(true);
    
    if (typeof window === 'undefined') return;
    
    // Mark as seen
    cookieStorage.setItem('has-seen-first-visit', 'true');
    
    // Give the user their first krakenling
    const currentCount = parseFloat(cookieStorage.getItem('octopus-count') || '0');
    cookieStorage.setItem('octopus-count', (currentCount + 1).toString());
    
    // Dispatch event to update counter
    window.dispatchEvent(new CustomEvent('octopusCollected', { detail: { count: currentCount + 1 } }));
    
    // Animate and close - slower, calmer transition
    setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        // Dispatch event to show Header and Footer
        window.dispatchEvent(new CustomEvent('firstVisitComplete'));
        onComplete();
      }, 800); // Longer delay for smoother transition
    }, 1200); // Longer animation time for collection
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black flex items-center justify-center transition-opacity duration-1000 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ zIndex: 9999 }}
    >
      <div className={`relative bg-turquoise-800 rounded-2xl p-6 sm:p-8 md:p-12 lg:p-16 max-w-md mx-4 border-2 border-turquoise-400 text-center transition-all duration-1000 ease-in-out max-h-[90vh] overflow-y-auto ${
        isVisible && !isCollecting ? 'opacity-100 scale-100' : isCollecting ? 'opacity-0 scale-95' : 'opacity-0 scale-95'
      }`}>
        <div className="flex flex-col items-center gap-6">
          <h2 className="font-lora text-3xl md:text-4xl font-bold text-turquoise-400 mb-2">
            {t.firstVisit.title}
          </h2>
          
          <p className="text-white text-lg md:text-xl mb-4">
            {t.firstVisit.subtitle}
          </p>
          
          <p className="text-turquoise-300 text-xl md:text-2xl font-bold mb-6">
            {t.firstVisit.action}
          </p>
          
          <button
            onClick={handleKrakenlingClick}
            disabled={isCollecting}
            className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all select-none ${
              isCollecting
                ? 'scale-150 opacity-0'
                : 'hover:scale-110 cursor-pointer animate-pulse'
            }`}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none'
            }}
          >
            <KrakenlingIcon
              size={96}
              className="transition-all duration-1000 ease-in-out"
              tint="turquoise"
              style={{
                transform: isCollecting ? 'scale(1.5) rotate(180deg)' : undefined,
                opacity: isCollecting ? 0 : 1
              }}
            />
            
            {isCollecting && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-green-400 animate-ping"></div>
              </div>
            )}
          </button>
          
          {!isCollecting && (
            <p className="text-gray-300 text-sm mt-4">
              {t.firstVisit.instruction}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

