'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Route } from '@/shared/Route';
import { useLanguage } from '@/contexts/LanguageContext';

const randomizeQuote = (copies: string[]) => {
  return copies[Math.floor(Math.random() * copies.length)];
};

const getRandomDelay = () => {
  // Random delay between 10 and 20 seconds
  return Math.random() * 10000 + 20000;
};

export default function FloatingNewsletterBanner() {
  const { t } = useLanguage();
  const [currentQuote, setCurrentQuote] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const showBanner = () => {
      if (!t.footer.newsletterCopies || t.footer.newsletterCopies.length === 0) return;

      const quote = randomizeQuote(t.footer.newsletterCopies);
      setCurrentQuote(quote);
      setIsVisible(true);
      setIsAnimatingIn(true);
      setIsAnimatingOut(false);

      // After slide-in animation completes (1.5s), stop animating in
      setTimeout(() => {
        setIsAnimatingIn(false);

        // Show for 8-12 seconds, then animate out
        const showDuration = Math.random() * 8000 + 10000;
        hideTimeoutRef.current = setTimeout(() => {
          setIsAnimatingOut(true);

          // After slide-out animation completes (1.5s), hide completely
          setTimeout(() => {
            setIsVisible(false);
            setIsAnimatingOut(false);

            // Schedule next appearance with random delay
            timeoutRef.current = setTimeout(showBanner, getRandomDelay());
          }, 1500);
        }, showDuration);
      }, 2000);
    };

    // Initial delay before first appearance
    timeoutRef.current = setTimeout(showBanner, getRandomDelay());

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [t.footer.newsletterCopies]);

  if (!isVisible || !currentQuote) return null;

  const getTransformClass = () => {
    if (isAnimatingIn) return 'translate-x-full';
    if (isAnimatingOut) return 'translate-x-full';
    return 'translate-x-0';
  };

  return (
    <Link href={Route.CONTACT} className="block">
      <div
        ref={bannerRef}
        className={`fixed top-20 left-0 right-0 z-50 pointer-events-auto transition-transform duration-1500 ease-out ${getTransformClass()}`}
      >
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-turquoise-800/95 backdrop-blur-sm border-2 border-turquoise-400 rounded-xl px-6 py-4 shadow-2xl cursor-pointer hover:bg-turquoise-700/95 transition-colors">
            <p className="text-white text-center text-sm md:text-base font-lora">
              🐙 {currentQuote}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
