'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Route } from '@/shared/Route';
import { useLanguage } from '@/contexts/LanguageContext';

const randomizeQuote = (copies: string[]) => copies[Math.floor(Math.random() * copies.length)];

/** Tras la carga, no competir con el primer paint (ms). */
const DEFER_AFTER_LOAD_MS = 3500;
/** Si el usuario no interactúa, mostrar el banner suavemente pasado este tiempo (ms). */
const FALLBACK_WAKE_MS = 120_000;
/** Entre rotaciones de frase (ms) — ritmo calmado. */
const QUOTE_INTERVAL_MIN_MS = 28_000;
const QUOTE_INTERVAL_MAX_MS = 52_000;
/** Duración de fundido de texto (ms). */
const FADE_MS = 800;
/** Apertura/cierre de la franja (altura + opacidad) (ms). */
const SHELL_MS = 900;

function scheduleIdle(cb: () => void) {
  if (typeof window === 'undefined') return;
  const ric = (window as Window & { requestIdleCallback?: (fn: () => void, opts?: { timeout: number }) => number })
    .requestIdleCallback;
  if (typeof ric === 'function') {
    ric(cb, { timeout: DEFER_AFTER_LOAD_MS + 2000 });
  } else {
    window.setTimeout(cb, DEFER_AFTER_LOAD_MS);
  }
}

export default function FloatingNewsletterBanner() {
  const { t } = useLanguage();
  const copies = t.footer.newsletterCopies;

  /** Aún no escuchamos interacción (tras carga diferida). */
  const [listening, setListening] = useState(false);
  /** Franja desplegada (ocupa altura bajo el header). */
  const [expanded, setExpanded] = useState(false);
  const [currentQuote, setCurrentQuote] = useState('');
  const [textFadingOut, setTextFadingOut] = useState(false);

  const rotateTimeoutRef = useRef<number | null>(null);
  const fadeSwapRef = useRef<number | null>(null);
  const fallbackRef = useRef<number | null>(null);
  const wakeCleanupRef = useRef<(() => void) | null>(null);
  const hasWokenRef = useRef(false);

  const clearRotateTimers = useCallback(() => {
    if (rotateTimeoutRef.current != null) window.clearTimeout(rotateTimeoutRef.current);
    rotateTimeoutRef.current = null;
    if (fadeSwapRef.current != null) window.clearTimeout(fadeSwapRef.current);
    fadeSwapRef.current = null;
  }, []);

  const scheduleNextRotation = useCallback(() => {
    clearRotateTimers();
    const delay = QUOTE_INTERVAL_MIN_MS + Math.random() * (QUOTE_INTERVAL_MAX_MS - QUOTE_INTERVAL_MIN_MS);
    rotateTimeoutRef.current = window.setTimeout(() => {
      setTextFadingOut(true);
      fadeSwapRef.current = window.setTimeout(() => {
        setCurrentQuote(randomizeQuote(copies));
        setTextFadingOut(false);
        scheduleNextRotation();
      }, FADE_MS);
    }, delay);
  }, [clearRotateTimers, copies]);

  const wake = useCallback(() => {
    if (hasWokenRef.current) return;
    hasWokenRef.current = true;

    if (wakeCleanupRef.current) {
      wakeCleanupRef.current();
      wakeCleanupRef.current = null;
    }
    if (fallbackRef.current != null) {
      window.clearTimeout(fallbackRef.current);
      fallbackRef.current = null;
    }
    setCurrentQuote((q) => q || randomizeQuote(copies));
    requestAnimationFrame(() => setExpanded(true));
    scheduleNextRotation();
  }, [copies, scheduleNextRotation]);

  const wakeRef = useRef(wake);
  wakeRef.current = wake;

  // 1) Tras carga + idle: empezar a escuchar (sin mostrar nada aún).
  useEffect(() => {
    if (!copies?.length) return;

    const startListening = () => {
      scheduleIdle(() => {
        setListening(true);
      });
    };

    if (typeof document !== 'undefined' && document.readyState === 'complete') {
      const t0 = window.setTimeout(startListening, DEFER_AFTER_LOAD_MS);
      return () => window.clearTimeout(t0);
    }

    const onLoad = () => {
      window.setTimeout(startListening, DEFER_AFTER_LOAD_MS);
    };
    window.addEventListener('load', onLoad, { once: true });
    return () => window.removeEventListener('load', onLoad);
  }, [copies?.length]);

  // 2) Despertar solo con interacción suave o fallback tardío (nunca en el primer frame).
  useEffect(() => {
    if (!listening || expanded) return;

    const tryWake = () => {
      if (hasWokenRef.current) return;
      wakeRef.current();
    };

    const onScroll = () => {
      if (window.scrollY > 32) tryWake();
    };

    const onFirstGesture = () => tryWake();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointerdown', onFirstGesture, { passive: true });
    window.addEventListener('keydown', onFirstGesture);

    if (typeof window !== 'undefined' && window.scrollY > 32) {
      tryWake();
    }

    fallbackRef.current = window.setTimeout(tryWake, FALLBACK_WAKE_MS);

    wakeCleanupRef.current = () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointerdown', onFirstGesture);
      window.removeEventListener('keydown', onFirstGesture);
    };

    return () => {
      if (wakeCleanupRef.current) wakeCleanupRef.current();
      wakeCleanupRef.current = null;
      if (fallbackRef.current != null) window.clearTimeout(fallbackRef.current);
    };
  }, [listening, expanded]);

  useEffect(() => {
    return () => clearRotateTimers();
  }, [clearRotateTimers]);

  return (
    <div
      className="z-30 w-full overflow-hidden transition-[max-height,opacity,padding] ease-[cubic-bezier(0.22,1,0.36,1)] border-b border-transparent"
      style={{
        maxHeight: expanded ? '7.5rem' : '0px',
        opacity: expanded ? 1 : 0,
        transitionDuration: `${SHELL_MS}ms`,
      }}
    >
      <div
        className={`border-b transition-colors duration-700 ease-out ${
          expanded ? 'border-turquoise-400/40 bg-turquoise-800/95 backdrop-blur-sm' : 'border-transparent bg-transparent'
        }`}
      >
        {currentQuote ? (
          <Link href={Route.CONTACT} className="block w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
              <div className="cursor-pointer hover:bg-turquoise-700/20 transition-colors duration-500 rounded-lg px-3 py-1.5 sm:px-4 sm:py-2">
                <p
                  className={`text-white text-center text-xs sm:text-sm md:text-base font-lora transition-opacity ease-in-out ${
                    textFadingOut ? 'opacity-0' : 'opacity-100'
                  }`}
                  style={{ transitionDuration: `${FADE_MS}ms` }}
                >
                  🐙 {currentQuote}
                </p>
              </div>
            </div>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
