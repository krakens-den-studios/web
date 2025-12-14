'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/Button';
import { Route } from '@/shared/Route';
import { RiLockLine } from 'react-icons/ri';
import Link from 'next/link';
import { useUnlockedPages } from '@/hooks/useUnlockedPages';
import Image from 'next/image';
import FirstVisitModal from '@/components/FirstVisitModal';
import { useUnclaimedMissions } from '@/hooks/useUnclaimedMissions';
import { useMissionChecker } from '@/hooks/useMissionChecker';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAvailablePurchases } from '@/hooks/useAvailablePurchases';

export default function Root() {
  const { unlockedPages } = useUnlockedPages();
  const [showContent, setShowContent] = useState(false);
  const [visibleParagraphs, setVisibleParagraphs] = useState<number[]>([]);
  const unclaimedMissionsCount = useUnclaimedMissions();
  const availablePurchasesCount = useAvailablePurchases();
  const { t } = useLanguage();
  useMissionChecker(); // Check missions even when shop is closed

  useEffect(() => {
    if (showContent) {
      // Show paragraphs one by one with delays
      const delays = [0, 800, 1600, 2400, 3200]; // Added delay for screenshots
      
      delays.forEach((delay, index) => {
        setTimeout(() => {
          setVisibleParagraphs(prev => [...prev, index]);
        }, delay);
      });
    }
  }, [showContent]);

  // Screenshots del joc - afegir aquí les imatges quan estiguin disponibles
  const gameScreenshots = [
    '/screenshot-1.jpg',
    '/screenshot-2.jpg',
    '/screenshot-3.jpg',
    '/screenshot-4.jpg'
  ].filter(src => {
    // Només mostrar si l'imatge existeix (es pot comprovar després)
    return true; // Per ara mostrem els placeholders
  });

  return (
    <>
      <FirstVisitModal onComplete={() => setShowContent(true)} />
      {showContent && (
        <main className="relative w-full min-h-screen flex flex-col items-center animate-fade-in">
          {/* Hero Section amb imatge/video del joc */}
          <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
            {/* Video de fons (opcional) - descomentar quan hi hagi video */}
            {<video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-70"
            >
              <source src="/hero-heartweaver.mp4" type="video/mp4" />
            </video>}
            
            {/* Imatge de fons (fallback si no hi ha video) */}
            {/*<div className="absolute inset-0 w-full h-full">
              <Image
                src="/hero-heartweaver.png"
                alt="HeartWeaver Game Hero"
                fill
                className="object-cover opacity-60"
                priority
                onError={(e) => {
                  // Si no existeix la imatge, usar la cover existent com a fallback
                  (e.target as HTMLImageElement).src = '/heartweaverCover.png';
                }}
              />
            </div>*/}

            {/* Overlay per millorar llegibilitat */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-10" />

            {/* Contingut del Hero */}
            <div className="relative z-20 max-w-4xl text-center flex flex-col gap-6 sm:gap-8 items-center p-4 sm:p-8">
              <div className="flex flex-col gap-4 sm:gap-6">
                <h1 
                  className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-lora font-bold text-turquoise-400 transition-opacity duration-1000 ease-in-out ${
                    visibleParagraphs.includes(0) ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {t.home.title}
                </h1>

                {/*<p 
                  className={`text-lg sm:text-xl md:text-2xl text-white transition-opacity duration-1000 ease-in-out ${
                    visibleParagraphs.includes(1) ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {t.home.subtitle}
                </p>
                
                <p 
                  className={`text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl mx-auto transition-opacity duration-1000 ease-in-out ${
                    visibleParagraphs.includes(2) ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {t.home.description}
                </p>*/}
              </div>

              <div 
                className={`flex flex-col gap-4 sm:gap-6 items-center mt-4 transition-opacity duration-1000 ease-in-out ${
                  visibleParagraphs.includes(1) ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <button
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('openTreasure'));
                  }}
                  className="bg-turquoise-400 hover:bg-turquoise-300 rounded-xl px-6 sm:px-8 py-3 sm:py-4 shadow-lg transition-all flex items-center gap-2 group font-lora font-bold text-black text-base sm:text-lg md:text-xl relative hover:scale-105"
                  title="Open Treasure"
                >
                  {t.home.openTreasure}
                  {unclaimedMissionsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-turquoise-400 text-xs font-bold rounded-full min-w-[1.25rem] h-5 px-1 flex items-center justify-center border-2 border-turquoise-400 z-10">
                      {unclaimedMissionsCount}
                    </span>
                  )}
                  {availablePurchasesCount > 0 && (
                    <span className="absolute -top-1 -left-1 bg-amber-500 text-black text-xs font-bold rounded-full min-w-[1.25rem] h-5 px-1 flex items-center justify-center border-2 border-amber-600 z-10">
                      {availablePurchasesCount}
                    </span>
                  )}
                </button>
                {unlockedPages.home && (
                  <Link 
                    href={Route.HOME}
                  >
                    <Button label={t.home.enterDen} />
                  </Link>
                )}
              </div>
            </div>
          </section>

          {/* Secció de Screenshots del Joc */}
          {/*{gameScreenshots.length > 0 && (
            <section className="relative w-full py-12 sm:py-16 md:py-20 bg-black/80">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 
                  className={`text-2xl sm:text-3xl md:text-4xl font-lora font-bold text-center text-turquoise-400 mb-8 sm:mb-12 transition-opacity duration-1000 ease-in-out ${
                    visibleParagraphs.includes(4) ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  Descobreix HeartWeaver
                </h2>
                
                <div 
                  className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 transition-opacity duration-1000 ease-in-out ${
                    visibleParagraphs.includes(4) ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {gameScreenshots.map((src, index) => (
                    <div
                      key={index}
                      className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer border-2 border-turquoise-400/30 hover:border-turquoise-400 transition-all hover:scale-105"
                    >
                      <Image
                        src={src}
                        alt={`HeartWeaver Screenshot ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        onError={(e) => {
                          // Si no existeix la imatge, amagar aquesta card
                          (e.target as HTMLElement).parentElement?.parentElement?.classList.add('hidden');
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}*/}
        </main>
      )}
    </>
  );
}
