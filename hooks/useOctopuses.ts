'use client';

import { useState, useEffect } from 'react';

const OCTOPUS_COUNT_KEY = 'octopus-count';
const OCTOPUS_COLLECTED_KEY = 'octopus-collected-ids';
const AGENTS_STORAGE_KEY = 'agents-progress';
const UNLOCKABLES_STORAGE_KEY = 'unlockables-progress';

interface Agent {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  owned: number;
  collectionRate: number; // Krakenlings per second
  collectionInterval: number;
  costMultiplier: number;
  multiplier: number; // Multiplier for efficiency
  unlockRequirement?: string;
}

export function useOctopuses() {
  const [octopusCount, setOctopusCount] = useState(0);
  const [collectedOctopuses, setCollectedOctopuses] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const savedCount = localStorage.getItem(OCTOPUS_COUNT_KEY);
    const savedCollected = localStorage.getItem(OCTOPUS_COLLECTED_KEY);
    
    if (savedCount) {
      try {
        setOctopusCount(parseInt(savedCount, 10));
      } catch (e) {
        setOctopusCount(0);
      }
    }
    
    if (savedCollected) {
      try {
        setCollectedOctopuses(JSON.parse(savedCollected));
      } catch (e) {
        setCollectedOctopuses([]);
      }
    }
  }, []);

  const updateOctopusCount = (newCount: number) => {
    setOctopusCount(newCount);
    if (typeof window !== 'undefined') {
      localStorage.setItem(OCTOPUS_COUNT_KEY, newCount.toString());
    }
  };

  const collectOctopus = (octopusId: string) => {
    if (!collectedOctopuses.includes(octopusId)) {
      const newCollected = [...collectedOctopuses, octopusId];
      const newCount = octopusCount + 1;
      
      setCollectedOctopuses(newCollected);
      setOctopusCount(newCount);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(OCTOPUS_COLLECTED_KEY, JSON.stringify(newCollected));
        localStorage.setItem(OCTOPUS_COUNT_KEY, newCount.toString());
      }
    }
  };

  // Listen for changes in localStorage from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === OCTOPUS_COUNT_KEY && e.newValue) {
        setOctopusCount(parseInt(e.newValue, 10));
      }
      if (e.key === OCTOPUS_COLLECTED_KEY && e.newValue) {
        try {
          setCollectedOctopuses(JSON.parse(e.newValue));
        } catch (e) {
          setCollectedOctopuses([]);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Automatic agent collection system (works globally)
  // Also synchronizes counter from localStorage for external changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Use a ref to store fractional count to avoid losing precision
    // Always read from localStorage to sync with external changes (like purchases)
    const updateCount = () => {
      try {
        // Always sync fractional count from localStorage first to catch external changes
        let fractionalCount = parseFloat(localStorage.getItem(OCTOPUS_COUNT_KEY) || '0');
        
        // First, collect from agents if they exist
        const savedAgents = localStorage.getItem(AGENTS_STORAGE_KEY);
        if (savedAgents) {
          const agents: Agent[] = JSON.parse(savedAgents);
          const activeAgents = agents.filter(a => a.owned > 0);
          
          if (activeAgents.length > 0) {
            // Get passive collection upgrades
            let passiveMultiplier = 0;
            try {
              const savedUnlockables = localStorage.getItem(UNLOCKABLES_STORAGE_KEY);
              if (savedUnlockables) {
                const unlockables: any[] = JSON.parse(savedUnlockables);
                const passiveUpgrades = unlockables.filter(
                  u => u.type === 'upgrade' && u.upgradeType === 'passive' && u.unlocked
                );
                passiveMultiplier = passiveUpgrades.reduce((sum, upgrade) => {
                  return sum + (upgrade.multiplierValue || 0);
                }, 0);
              }
            } catch (e) {
              // Ignore errors
            }

            // Calculate total krakenlings per second from all agents (with multipliers)
            const baseKrakenlingsPerSecond = activeAgents.reduce((total, agent) => {
              return total + (agent.owned * agent.collectionRate * (agent.multiplier || 1.0));
            }, 0);

            // Apply passive collection bonus (percentage of base rate)
            const passiveBonus = baseKrakenlingsPerSecond * passiveMultiplier;
            const totalKrakenlingsPerSecond = baseKrakenlingsPerSecond + passiveBonus;

            if (totalKrakenlingsPerSecond > 0) {
              // Increment by corresponding fraction (100ms = 0.1 seconds)
              // Use fractional count to maintain precision
              const increment = totalKrakenlingsPerSecond * 0.1;
              fractionalCount = fractionalCount + increment;
              const newCountRounded = Math.floor(fractionalCount);
              
              // Update state and localStorage with rounded value
              setOctopusCount(newCountRounded);
              localStorage.setItem(OCTOPUS_COUNT_KEY, fractionalCount.toString());
              return;
            }
          }
        }
        
        // If no active agents, synchronize from localStorage
        const currentRounded = Math.floor(fractionalCount);
        setOctopusCount(prev => {
          if (prev !== currentRounded) {
            return currentRounded;
          }
          return prev;
        });
      } catch (e) {
        // If there's an error, ignore it
      }
    };

    // Update every 100ms for smooth and constant increment
    const updateInterval = setInterval(updateCount, 100);

    return () => clearInterval(updateInterval);
  }, []);

  return {
    octopusCount,
    collectedOctopuses,
    updateOctopusCount,
    collectOctopus
  };
}

