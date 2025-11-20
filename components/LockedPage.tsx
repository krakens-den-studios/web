'use client';

import { useUnlockedPages } from '@/hooks/useUnlockedPages';
import { Route } from '@/shared/Route';
import Button from './Button';
import { RiLockLine, RiEmotionLine } from 'react-icons/ri';

interface LockedPageProps {
  route: Route;
  emotionName: string;
  emotionDescription: string;
  onStartJourney: () => void;
}

export default function LockedPage({ route, emotionName, emotionDescription, onStartJourney }: LockedPageProps) {
  const { isPageUnlocked } = useUnlockedPages();

  if (isPageUnlocked(route)) {
    return null; // If unlocked, don't show anything
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-8">
      <div className="max-w-2xl text-center flex flex-col gap-8 items-center">
        <div className="relative">
          <RiLockLine className="w-32 h-32 text-gray-500 mx-auto" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 border-4 border-turquoise-400 rounded-full animate-pulse" />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="font-lora text-4xl md:text-5xl font-bold text-white">
            Locked Page
          </h1>
          
          <p className="text-xl md:text-2xl text-white opacity-80">
            This page is protected by the emotion of <span className="text-turquoise-400 font-bold">{emotionName}</span>
          </p>
          
          <p className="text-lg md:text-xl text-white opacity-60 mt-4">
            {emotionDescription}
          </p>
        </div>

        <div className="flex flex-col gap-4 items-center mt-4">
          <p className="text-white text-lg opacity-80 mb-2">
            Access The Kraken's Treasure from the header to unlock this page
          </p>
          
          <p className="text-white text-sm opacity-60 flex items-center gap-2">
            <RiEmotionLine className="w-5 h-5" />
            Get this page in the "Treasures" tab of The Kraken's Treasure
          </p>
        </div>
      </div>
    </div>
  );
}
