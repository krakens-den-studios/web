'use client';

import { useState, useEffect } from 'react';
import { cookieStorage } from '@/utils/cookieStorage';
import { deserializeUnlockables, deserializeMissions, UNLOCKABLE_TEMPLATES } from '@/shared/gameData';

const UNLOCKABLES_STORAGE_KEY = 'unlockables-progress';
const MISSIONS_STORAGE_KEY = 'missions-progress';

function isMissionCompleted(missionId: string | undefined, missions: any[]): boolean {
  if (!missionId) return true;
  const mission = missions.find(m => m.id === missionId);
  return mission?.claimed ? true : false;
}

export function useAvailablePurchases() {
  const [availableCount, setAvailableCount] = useState(0);

  const updateCount = () => {
    if (typeof window === 'undefined') return;
    
    try {
      // Get unlockables
      const unlockablesRaw = cookieStorage.getItem(UNLOCKABLES_STORAGE_KEY);
      const { state: unlockables } = unlockablesRaw 
        ? deserializeUnlockables(unlockablesRaw)
        : { state: UNLOCKABLE_TEMPLATES.map(t => ({ ...t, unlocked: false })) };

      // Get missions
      const missionsRaw = cookieStorage.getItem(MISSIONS_STORAGE_KEY);
      const { state: missions } = missionsRaw 
        ? deserializeMissions(missionsRaw)
        : { state: [] };

      // Get current krakenling count
      const octopusCount = parseFloat(cookieStorage.getItem('octopus-count') || '0');

      // Count available purchases (only treasures and pages, not upgrades or features)
      let count = 0;
      
      unlockables.forEach(unlockable => {
        // Only count treasures and pages (not upgrades or features)
        if (unlockable.type !== 'treasure' && unlockable.type !== 'page') {
          return;
        }

        // Skip if already unlocked
        if (unlockable.unlocked) return;

        // Newsletter only appears if Contact is unlocked
        if (unlockable.id === 'newsletter') {
          const contactUnlockable = unlockables.find(ul => ul.id === 'contact');
          if (!contactUnlockable?.unlocked) return;
        }

        // True Heart only appears when all other treasures and pages are unlocked
        if (unlockable.id === 'true-heart') {
          const allOtherUnlockables = unlockables.filter(
            ul => (ul.type === 'page' || ul.type === 'treasure') && ul.id !== 'true-heart'
          );
          if (!allOtherUnlockables.every(ul => ul.unlocked)) return;
        }

        // Check mission requirement
        const missionCompleted = isMissionCompleted(unlockable.missionRequirement, missions);
        if (!missionCompleted) return;

        // Check if user can afford
        if (octopusCount >= unlockable.cost) {
          count++;
        }
      });

      setAvailableCount(count);
    } catch {
      setAvailableCount(0);
    }
  };

  useEffect(() => {
    updateCount();

    // Listen for changes that might affect available purchases
    const handleChange = () => {
      setTimeout(updateCount, 100);
    };

    window.addEventListener('unlockableChanged', handleChange);
    window.addEventListener('missionChanged', handleChange);
    window.addEventListener('octopusCollected', handleChange);
    window.addEventListener('shopOpened', handleChange);
    window.addEventListener('shopClosed', handleChange);

    // Check periodically
    const interval = setInterval(updateCount, 1000);

    return () => {
      window.removeEventListener('unlockableChanged', handleChange);
      window.removeEventListener('missionChanged', handleChange);
      window.removeEventListener('octopusCollected', handleChange);
      window.removeEventListener('shopOpened', handleChange);
      window.removeEventListener('shopClosed', handleChange);
      clearInterval(interval);
    };
  }, []);

  return availableCount;
}

