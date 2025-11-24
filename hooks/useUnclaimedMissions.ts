'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { cookieStorage } from '@/utils/cookieStorage';
import { deserializeMissions } from '@/shared/gameData';

const MISSIONS_STORAGE_KEY = 'missions-progress';

export function useUnclaimedMissions() {
  const [unclaimedCount, setUnclaimedCount] = useState(0);
  const pathname = usePathname();

  const updateCount = () => {
    if (typeof window === 'undefined') return;
    
    const raw = cookieStorage.getItem(MISSIONS_STORAGE_KEY);
    if (!raw) {
      setUnclaimedCount(0);
      return;
    }

    try {
      const { state: missions } = deserializeMissions(raw);
      const count = missions.filter(m => m.completed && !m.claimed).length;
      setUnclaimedCount(count);
    } catch {
      setUnclaimedCount(0);
    }
  };

  // Update when pathname changes (for visit-page missions)
  useEffect(() => {
    updateCount();
  }, [pathname]);

  useEffect(() => {
    updateCount();

    // Listen for mission changes and related events
    const handleMissionChange = () => {
      // Small delay to ensure cookies are updated
      setTimeout(updateCount, 100);
    };

    // Listen for direct mission changes
    window.addEventListener('missionChanged', handleMissionChange);
    
    // Listen for shop events (missions might be checked/updated when shop opens/closes)
    window.addEventListener('shopOpened', handleMissionChange);
    window.addEventListener('shopClosed', handleMissionChange);
    
    // Listen for events that might affect mission completion
    window.addEventListener('unlockableChanged', handleMissionChange);
    window.addEventListener('octopusCollected', handleMissionChange);
    window.addEventListener('minigameCompleted', handleMissionChange);
    
    // Listen for pathname changes (for visit-page missions)
    const handlePathnameChange = () => {
      setTimeout(updateCount, 200);
    };
    window.addEventListener('popstate', handlePathnameChange);
    
    // Also check periodically in case of external changes
    const interval = setInterval(updateCount, 500);

    return () => {
      window.removeEventListener('missionChanged', handleMissionChange);
      window.removeEventListener('shopOpened', handleMissionChange);
      window.removeEventListener('shopClosed', handleMissionChange);
      window.removeEventListener('unlockableChanged', handleMissionChange);
      window.removeEventListener('octopusCollected', handleMissionChange);
      window.removeEventListener('minigameCompleted', handleMissionChange);
      window.removeEventListener('popstate', handlePathnameChange);
      
      clearInterval(interval);
    };
  }, [pathname]);

  return unclaimedCount;
}

