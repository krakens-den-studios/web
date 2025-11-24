'use client';

import { useState, useEffect } from 'react';
import { Route } from '@/shared/Route';
import { cookieStorage } from '@/utils/cookieStorage';
import { deserializeUnlockables } from '@/shared/gameData';

const STORAGE_KEY = 'emotion-journey-progress';

interface UnlockedPages {
  home: boolean;
  games: boolean;
  team: boolean;
  contact: boolean;
  newsletter: boolean;
}

const loadUnlockedPages = (): UnlockedPages => {
  if (typeof window === 'undefined') {
    return {
      home: false,
      games: false,
      team: false,
      contact: false,
      newsletter: false
    };
  }
  
  const saved = cookieStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const progress = JSON.parse(saved);
      const emotions = progress.emotions || [];
      
      // Map emotions to pages
      const hopeUnlocked = emotions.find((e: any) => e.id === 'hope')?.unlocked || false;
      const courageUnlocked = emotions.find((e: any) => e.id === 'courage')?.unlocked || false;
      const connectionUnlocked = emotions.find((e: any) => e.id === 'connection')?.unlocked || false;
      const healingUnlocked = emotions.find((e: any) => e.id === 'healing')?.unlocked || false;

      // Check unlockables for contact and newsletter
      const unlockablesSaved = cookieStorage.getItem('unlockables-progress');
      let contactUnlocked = false;
      let newsletterUnlocked = false;
      
      if (unlockablesSaved) {
        const { state: unlockables } = deserializeUnlockables(unlockablesSaved);
        contactUnlocked = unlockables.some(u => u.id === 'contact' && u.unlocked);
        newsletterUnlocked = unlockables.some(u => u.id === 'newsletter' && u.unlocked);
      }

      return {
        home: hopeUnlocked, // Esperanza desbloquea Home
        games: courageUnlocked, // Courage unlocks Games
        team: connectionUnlocked, // Connection unlocks Team
        contact: contactUnlocked, // Contact unlocked via shop
        newsletter: newsletterUnlocked // Newsletter unlocked via shop
      };
    } catch (e) {
      // Si hay error, mantener valores por defecto
    }
  }
  return {
    home: false, // Home empieza bloqueado
    games: false,
    team: false,
    contact: false,
    newsletter: false
  };
};

export function useUnlockedPages() {
  const [unlockedPages, setUnlockedPages] = useState<UnlockedPages>({
    home: false,
    games: false,
    team: false,
    contact: false,
    newsletter: false
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // Load from cookies on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUnlockedPages(loadUnlockedPages());
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const updateUnlockedPages = () => {
      setUnlockedPages(loadUnlockedPages());
    };

    // Listen for custom events when an emotion is unlocked
    const handleEmotionUnlocked = () => {
      updateUnlockedPages();
    };

    // Listen for unlockable changes
    const handleUnlockableChanged = () => {
      updateUnlockedPages();
    };

    window.addEventListener('emotionUnlocked', handleEmotionUnlocked);
    window.addEventListener('unlockableChanged', handleUnlockableChanged);

    return () => {
      window.removeEventListener('emotionUnlocked', handleEmotionUnlocked);
      window.removeEventListener('unlockableChanged', handleUnlockableChanged);
    };
  }, []);

  // Function to check if a route is unlocked
  const isPageUnlocked = (route: Route | string): boolean => {
    if (route === Route.HOME) return unlockedPages.home;
    if (route === Route.HEART_WEAVER) return unlockedPages.games;
    if (route === Route.TEAM) return unlockedPages.team;
    if (route === Route.CONTACT) return unlockedPages.contact;
    if (route === 'newsletter') return unlockedPages.newsletter;
    return false;
  };

  return { unlockedPages, isPageUnlocked, isLoading };
}
