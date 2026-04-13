'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Route } from '@/shared/Route';
import { useLanguage } from '@/contexts/LanguageContext';

const randomizeQuote = (copies: string[]) => {
  return copies[Math.floor(Math.random() * copies.length)];
};

const getRandomDelay = () => {
  return Math.random() * 20000;
};

export default function FloatingNewsletterBanner() {
  const { t } = useLanguage();
  const [currentQuote, setCurrentQuote] = useState<string>('');
  const [isFadingOut, setIsFadingOut] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!t.footer.newsletterCopies || t.footer.newsletterCopies.length === 0) return;

    // Set initial quote
    const initialQuote = randomizeQuote(t.footer.newsletterCopies);
    setCurrentQuote(initialQuote);

    const changeQuote = () => {
      // Fade out banner completely
      setIsFadingOut(true);

      // After fade out completes, change quote and fade in
      fadeTimeoutRef.current = setTimeout(() => {
        const newQuote = randomizeQuote(t.footer.newsletterCopies);
        setCurrentQuote(newQuote);
        setIsFadingOut(false);

        // Schedule next change
        timeoutRef.current = setTimeout(changeQuote, getRandomDelay());
      }, 8000); // Very slow fade out duration for calm feeling
    };

    // Start changing quotes after initial delay
    timeoutRef.current = setTimeout(changeQuote, getRandomDelay());

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    };
  }, [t.footer.newsletterCopies]);

  if (!currentQuote) return null;

  return (
    <div
      className={`z-30 w-full py-4 bg-turquoise-800/95 backdrop-blur-sm border-2 border-turquoise-400/50 transition-opacity duration-[8000ms] ease-in-out ${isFadingOut ? 'opacity-0' : 'opacity-100'
        }`}
    >
      <Link href={Route.CONTACT} className="block w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="cursor-pointer hover:bg-turquoise-700/20 transition-colors rounded-lg px-4 py-2">
            <p className="text-white text-center text-xs sm:text-sm md:text-base font-lora">
              🐙 {currentQuote}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
