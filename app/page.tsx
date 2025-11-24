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

export default function Root() {
  const { unlockedPages } = useUnlockedPages();
  const [showContent, setShowContent] = useState(false);
  const [visibleParagraphs, setVisibleParagraphs] = useState<number[]>([]);
  const unclaimedMissionsCount = useUnclaimedMissions();
  useMissionChecker(); // Check missions even when shop is closed

  useEffect(() => {
    if (showContent) {
      // Show paragraphs one by one with delays
      const delays = [0, 800, 1600, 2400]; // 0ms, 800ms, 1600ms, 2400ms
      
      delays.forEach((delay, index) => {
        setTimeout(() => {
          setVisibleParagraphs(prev => [...prev, index]);
          
          // No need to dispatch contentReady for root page since it doesn't show footer
        }, delay);
      });
    }
  }, [showContent]);

  return (
    <>
      <FirstVisitModal onComplete={() => setShowContent(true)} />
      {showContent && (
        <main 
          className="relative w-full h-screen flex items-center justify-center pt-32 md:pt-40 animate-fade-in"
        >
      
      <div className="max-w-3xl text-center flex flex-col gap-8 items-center p-8">
        <div className="flex flex-col gap-4">
          <p 
            className={`text-lg sm:text-xl md:text-2xl text-turquoise-300 transition-opacity duration-1000 ease-in-out ${
              visibleParagraphs.includes(0) ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Dive Into the Kraken's Den
          </p>

          <p 
            className={`text-base sm:text-lg md:text-xl text-white mt-4 transition-opacity duration-1000 ease-in-out ${
              visibleParagraphs.includes(1) ? 'opacity-100' : 'opacity-0'
            }`}
          >
          Where play helps navigate big feelings.
          </p>
          
          <p 
            className={`text-base sm:text-lg md:text-xl text-white mt-4 transition-opacity duration-1000 ease-in-out ${
              visibleParagraphs.includes(2) ? 'opacity-100' : 'opacity-0'
            }`}
          >
          Collect <strong>Krakenlings</strong>, unlock <strong>therapies</strong>, and discover <strong>treasures</strong>.
          </p>
        </div>

        <div 
          className={`flex flex-col gap-6 items-center mt-8 transition-opacity duration-1000 ease-in-out ${
            visibleParagraphs.includes(3) ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('openTreasure'));
            }}
            className="bg-turquoise-400 hover:bg-turquoise-300 rounded-xl px-6 sm:px-8 py-3 sm:py-4 shadow-lg transition-all flex items-center gap-2 group font-lora font-bold text-black text-base sm:text-lg md:text-xl relative"
            title="Open Treasure"
          >
            Open Treasure
            {unclaimedMissionsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-turquoise-400 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-turquoise-400">
                {unclaimedMissionsCount}
              </span>
            )}
          </button>
          {unlockedPages.home && (
            <Link href={Route.HOME}>
              <Button label="ENTER THE DEN" />
            </Link>
          )}
        </div>
      </div>
    </main>
      )}
    </>
  );
}
