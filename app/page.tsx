'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/Button';
import { Route } from '@/shared/Route';
import { RiLockLine } from 'react-icons/ri';
import Link from 'next/link';
import { useUnlockedPages } from '@/hooks/useUnlockedPages';
import Image from 'next/image';
import FirstVisitModal from '@/components/FirstVisitModal';

export default function Root() {
  const { unlockedPages } = useUnlockedPages();
  const [showContent, setShowContent] = useState(false);
  const [visibleParagraphs, setVisibleParagraphs] = useState<number[]>([]);

  useEffect(() => {
    if (showContent) {
      // Show paragraphs one by one with delays
      const delays = [0, 800, 1600, 2400]; // 0ms, 800ms, 1600ms, 2400ms
      
      delays.forEach((delay, index) => {
        setTimeout(() => {
          setVisibleParagraphs(prev => [...prev, index]);
          
          // When all paragraphs are visible, dispatch event to show footer
          if (index === delays.length - 1) {
            setTimeout(() => {
              window.dispatchEvent(new CustomEvent('contentReady'));
            }, 1000); // Wait for fade-in animation to complete
          }
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
        <div 
          className={`relative w-48 h-48 mb-4 transition-opacity duration-1000 ease-in-out ${
            visibleParagraphs.includes(0) ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src="/logoColor.png"
            alt="Kraken's Den Studios Logo"
            width={192}
            height={192}
            className="object-contain"
          />
        </div>

        <div className="flex flex-col gap-4">
          <p 
            className={`text-xl md:text-2xl text-turquoise-300 transition-opacity duration-1000 ease-in-out ${
              visibleParagraphs.includes(0) ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Dive Into the Kraken's Den
          </p>

          <p 
            className={`text-lg md:text-xl text-white mt-4 transition-opacity duration-1000 ease-in-out ${
              visibleParagraphs.includes(1) ? 'opacity-100' : 'opacity-0'
            }`}
          >
          Where play becomes a gentle way to navigate big feelings.
          </p>
          
          <p 
            className={`text-lg md:text-xl text-white mt-4 transition-opacity duration-1000 ease-in-out ${
              visibleParagraphs.includes(2) ? 'opacity-100' : 'opacity-0'
            }`}
          >
          In this tiny corner of the ocean, nothing is "just a game".
          Every click, every mini-challenge, every tiny kraken you collect is an invitation to slow down, notice how you feel, and move through it at your own pace.
          </p>
          
          <p 
            className={`text-lg md:text-xl text-white mt-4 transition-opacity duration-1000 ease-in-out ${
              visibleParagraphs.includes(3) ? 'opacity-100' : 'opacity-0'
            }`}
          >
          Collect <strong>Krakenlings</strong>, unlock <strong>therapies</strong> (mini-games), and uncover the hidden <strong>treasures</strong> of this den – including the most important one: <strong>you</strong>.
          </p>
        </div>

        <div 
          className={`flex flex-col gap-6 items-center mt-8 transition-opacity duration-1000 ease-in-out ${
            visibleParagraphs.includes(3) ? 'opacity-100' : 'opacity-0'
          }`}
        >
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
