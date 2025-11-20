'use client';

import { useState, useEffect } from 'react';
import { Route } from '@/shared/Route';

const STORAGE_KEY = 'emotion-journey-progress';

interface UnlockedPages {
  home: boolean;
  games: boolean;
  team: boolean;
  newsletter: boolean;
}

const loadUnlockedPages = (): UnlockedPages => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const progress = JSON.parse(saved);
      const emotions = progress.emotions || [];
      
      // Map emotions to pages
      const hopeUnlocked = emotions.find((e: any) => e.id === 'hope')?.unlocked || false;
      const courageUnlocked = emotions.find((e: any) => e.id === 'courage')?.unlocked || false;
      const connectionUnlocked = emotions.find((e: any) => e.id === 'connection')?.unlocked || false;
      const healingUnlocked = emotions.find((e: any) => e.id === 'healing')?.unlocked || false;

      return {
        home: hopeUnlocked, // Esperanza desbloquea Home
        games: courageUnlocked, // Courage unlocks Games
        team: connectionUnlocked, // Connection unlocks Team
        newsletter: healingUnlocked // Healing unlocks Newsletter
      };
    } catch (e) {
      // Si hay error, mantener valores por defecto
    }
  }
  return {
    home: false, // Home empieza bloqueado
    games: false,
    team: false,
    newsletter: false
  };
};

export function useUnlockedPages() {
  const [unlockedPages, setUnlockedPages] = useState<UnlockedPages>(loadUnlockedPages);

  useEffect(() => {
    const updateUnlockedPages = () => {
      setUnlockedPages(loadUnlockedPages());
    };

    // Escuchar cambios en localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        updateUnlockedPages();
      }
    };

    // Listen for custom events when an emotion is unlocked
    const handleEmotionUnlocked = () => {
      updateUnlockedPages();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('emotionUnlocked', handleEmotionUnlocked);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('emotionUnlocked', handleEmotionUnlocked);
    };
  }, []);

  // Function to check if a route is unlocked
  const isPageUnlocked = (route: Route | string): boolean => {
    if (route === Route.HOME) return unlockedPages.home;
    if (route === Route.HEART_WEAVER) return unlockedPages.games;
    if (route === Route.TEAM) return unlockedPages.team;
    if (route === 'newsletter') return unlockedPages.newsletter;
    return false;
  };

  return { unlockedPages, isPageUnlocked };
}
