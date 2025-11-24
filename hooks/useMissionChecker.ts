'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { cookieStorage } from '@/utils/cookieStorage';
import {
  buildMissions,
  buildMinigames,
  buildAgents,
  buildUnlockables,
  deserializeMissions,
  deserializeMinigames,
  deserializeAgents,
  deserializeUnlockables,
  serializeMissionProgress,
  calculateTotalKps
} from '@/shared/gameData';

const MISSIONS_STORAGE_KEY = 'missions-progress';
const MINIGAMES_STORAGE_KEY = 'minigames-progress';
const AGENTS_STORAGE_KEY = 'agents-progress';
const UNLOCKABLES_STORAGE_KEY = 'unlockables-progress';
const SCROLLED_PAGES_KEY = 'scrolled-pages';

export function useMissionChecker() {
  const pathname = usePathname();

  // Track scroll position to detect when user reaches bottom of page
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Check if user is within 200px of the bottom (just before footer)
      const distanceFromBottom = documentHeight - (scrollTop + windowHeight);
      const threshold = 200;
      
      if (distanceFromBottom <= threshold && pathname) {
        // Get current scrolled pages
        const scrolledPagesRaw = cookieStorage.getItem(SCROLLED_PAGES_KEY);
        let scrolledPages: string[] = [];
        
        if (scrolledPagesRaw) {
          try {
            scrolledPages = JSON.parse(scrolledPagesRaw);
          } catch (e) {
            scrolledPages = [];
          }
        }
        
        // Add current page if not already tracked
        if (!scrolledPages.includes(pathname)) {
          scrolledPages.push(pathname);
          cookieStorage.setItem(SCROLLED_PAGES_KEY, JSON.stringify(scrolledPages));
          
          // Trigger mission check
          window.dispatchEvent(new CustomEvent('pageScrolledToBottom', { detail: { pathname } }));
        }
      }
    };

    // Throttle scroll events for performance
    let scrollTimeout: NodeJS.Timeout;
    const throttledHandleScroll = () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = setTimeout(handleScroll, 100);
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    
    // Check immediately on mount and when pathname changes
    // Use a small delay to ensure DOM is ready
    const checkTimeout = setTimeout(() => {
      handleScroll();
    }, 100);

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      if (checkTimeout) {
        clearTimeout(checkTimeout);
      }
    };
  }, [pathname]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkAndUpdateMissions = () => {
      try {
        // Load current mission progress
        const missionsRaw = cookieStorage.getItem(MISSIONS_STORAGE_KEY);
        const { state: missions } = deserializeMissions(missionsRaw);
        
        // Load other game data needed for mission checks
        const minigamesRaw = cookieStorage.getItem(MINIGAMES_STORAGE_KEY);
        const { state: minigames } = deserializeMinigames(minigamesRaw);
        
        const agentsRaw = cookieStorage.getItem(AGENTS_STORAGE_KEY);
        const { state: agents } = deserializeAgents(agentsRaw);
        
        const unlockablesRaw = cookieStorage.getItem(UNLOCKABLES_STORAGE_KEY);
        const { state: unlockables } = deserializeUnlockables(unlockablesRaw);
        
        // Calculate total KPS
        const totalKps = calculateTotalKps(agents, unlockables);
        
        let hasChanges = false;
        
        const updatedMissions = missions.map(mission => {
          if (mission.completed) return mission;
          
          // Check prerequisites
          if (mission.dependsOn && mission.dependsOn.length > 0) {
            const prerequisitesMet = mission.dependsOn.every(depId => {
              const dependency = missions.find(m => m.id === depId);
              return dependency?.claimed ? true : false;
            });
            if (!prerequisitesMet) {
              return mission;
            }
          }
          
          let isCompleted: boolean = mission.completed;
          
          switch (mission.type) {
            case 'visit-page': {
              if (mission.target) {
                // Check if user has scrolled to bottom of this page
                const scrolledPagesRaw = cookieStorage.getItem(SCROLLED_PAGES_KEY);
                let scrolledPages: string[] = [];
                
                if (scrolledPagesRaw) {
                  try {
                    scrolledPages = JSON.parse(scrolledPagesRaw);
                  } catch (e) {
                    scrolledPages = [];
                  }
                }
                
                if (scrolledPages.includes(mission.target)) {
                  isCompleted = true;
                }
              }
              break;
            }
            case 'complete-therapy': {
              const minigame = minigames.find(m => m.id === mission.target);
              const requiredCount = mission.targetCount || 1;
              if (minigame && minigame.timesCompleted >= requiredCount) {
                isCompleted = true;
              }
              break;
            }
            case 'collect-krakenlings': {
              const targetCollectCount = parseInt(mission.target || '0', 10);
              const pickedCount = parseFloat(cookieStorage.getItem('octopus-picked-count') || '0');
              if (pickedCount >= targetCollectCount) {
                isCompleted = true;
              }
              break;
            }
            case 'reach-krakenlings': {
              const targetTotalCount = parseInt(mission.target || '0', 10);
              const totalCount = parseFloat(cookieStorage.getItem('octopus-count') || '0');
              if (totalCount >= targetTotalCount) {
                isCompleted = true;
              }
              break;
            }
            case 'reach-kps': {
              const targetKps = parseFloat(mission.target || '0');
              if (totalKps >= targetKps) {
                isCompleted = true;
              }
              break;
            }
            case 'purchase-item': {
              if (mission.target && unlockables.some(u => u.id === mission.target && u.unlocked)) {
                isCompleted = true;
              }
              break;
            }
            case 'mission-completed': {
              const targetMission = missions.find(m => m.id === mission.target);
              if (targetMission?.claimed) {
                isCompleted = true;
              }
              break;
            }
            case 'helpers-owned': {
              const requiredHelpers = mission.targetCount ?? parseInt(mission.target || '1', 10);
              const uniqueHelpersOwned = agents.filter(agent => agent.owned > 0).length;
              if (uniqueHelpersOwned >= requiredHelpers) {
                isCompleted = true;
              }
              break;
            }
          }
          
          if (isCompleted !== mission.completed) {
            hasChanges = true;
            return { ...mission, completed: isCompleted };
          }
          
          return mission;
        });
        
        if (hasChanges) {
          // Save updated missions
          const payload = serializeMissionProgress(updatedMissions);
          if (payload.length === 0) {
            cookieStorage.removeItem(MISSIONS_STORAGE_KEY);
          } else {
            cookieStorage.setItem(MISSIONS_STORAGE_KEY, JSON.stringify(payload));
          }
          
          // Dispatch event to update badges
          window.dispatchEvent(new CustomEvent('missionChanged'));
        }
      } catch (error) {
        // Silently fail if there's an error
        console.error('Error checking missions:', error);
      }
    };

    // Check immediately
    checkAndUpdateMissions();

    // Check periodically
    const interval = setInterval(checkAndUpdateMissions, 1000);

    // Listen for events that might affect missions
    const handleEvent = () => {
      setTimeout(checkAndUpdateMissions, 100);
    };

    window.addEventListener('octopusCollected', handleEvent);
    window.addEventListener('minigameCompleted', handleEvent);
    window.addEventListener('unlockableChanged', handleEvent);
    window.addEventListener('pageScrolledToBottom', handleEvent);

    return () => {
      clearInterval(interval);
      window.removeEventListener('octopusCollected', handleEvent);
      window.removeEventListener('minigameCompleted', handleEvent);
      window.removeEventListener('unlockableChanged', handleEvent);
      window.removeEventListener('pageScrolledToBottom', handleEvent);
    };
  }, [pathname]);
}

