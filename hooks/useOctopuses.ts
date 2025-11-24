'use client';

import { useState, useEffect } from 'react';
import { cookieStorage } from '@/utils/cookieStorage';
import { calculateTotalKps, deserializeAgents, deserializeUnlockables, resolveManualCollectionTier } from '@/shared/gameData';

const OCTOPUS_COUNT_KEY = 'octopus-count';
const OCTOPUS_COLLECTED_KEY = 'octopus-collected-ids';
const OCTOPUS_PICKED_COUNT_KEY = 'octopus-picked-count'; // Total manually picked krakenlings
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
    
    const savedCount = cookieStorage.getItem(OCTOPUS_COUNT_KEY);
    const savedCollected = cookieStorage.getItem(OCTOPUS_COLLECTED_KEY);
    const savedPickedCount = cookieStorage.getItem(OCTOPUS_PICKED_COUNT_KEY);
    
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
    
    // Initialize picked count if it doesn't exist
    if (!savedPickedCount) {
      cookieStorage.setItem(OCTOPUS_PICKED_COUNT_KEY, '0');
    }
  }, []);

  const updateOctopusCount = (newCount: number) => {
    setOctopusCount(newCount);
    if (typeof window !== 'undefined') {
      cookieStorage.setItem(OCTOPUS_COUNT_KEY, newCount.toString());
    }
  };

  const collectOctopus = (octopusId: string) => {
    if (!collectedOctopuses.includes(octopusId)) {
      const newCollected = [...collectedOctopuses, octopusId];
      
      // Get current fractional count from cookies to maintain precision
      const currentFractional = parseFloat(cookieStorage.getItem(OCTOPUS_COUNT_KEY) || '0');
      
      // Get total manually picked krakenlings (not from agents)
      const pickedCount = parseFloat(cookieStorage.getItem(OCTOPUS_PICKED_COUNT_KEY) || '0');
      
      // Calculate collection value based on upgrades
      // Base: 1 Krakenling, incremented by unlocked upgrades
      let collectionValue = 1;
      
      try {
        const { state: unlockables } = deserializeUnlockables(cookieStorage.getItem(UNLOCKABLES_STORAGE_KEY));
        const tier = resolveManualCollectionTier(unlockables);
        if (tier.kind === 'flat') {
          collectionValue = tier.value;
        } else {
          const { state: agents } = deserializeAgents(cookieStorage.getItem(AGENTS_STORAGE_KEY));
          const totalKps = calculateTotalKps(agents, unlockables);
          collectionValue = Math.max(1, Math.floor(totalKps * tier.percent));
        }
      } catch (e) {
        // Ignore errors
      }
      
      const newFractionalCount = currentFractional + collectionValue;
      const newCount = Math.floor(newFractionalCount);
      
      // Update picked count (only the base 1, not the multipliers)
      const newPickedCount = pickedCount + 1;
      
      setCollectedOctopuses(newCollected);
      setOctopusCount(newCount);
      
      if (typeof window !== 'undefined') {
        cookieStorage.setItem(OCTOPUS_COLLECTED_KEY, JSON.stringify(newCollected));
        cookieStorage.setItem(OCTOPUS_COUNT_KEY, newFractionalCount.toString());
        cookieStorage.setItem(OCTOPUS_PICKED_COUNT_KEY, newPickedCount.toString());
      }
      
      // Return the value for display purposes
      return collectionValue;
    }
    return 1;
  };

  // Automatic agent collection system (works globally)
  // Also synchronizes counter from cookies for external changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Use a ref to store fractional count to avoid losing precision
    // Always read from cookies to sync with external changes (like purchases)
    const updateCount = () => {
      try {
        // Always sync fractional count from cookies first to catch external changes
        let fractionalCount = parseFloat(cookieStorage.getItem(OCTOPUS_COUNT_KEY) || '0');
        
        // First, collect from agents if they exist
        const { state: agents } = deserializeAgents(cookieStorage.getItem(AGENTS_STORAGE_KEY));
        if (agents.length > 0) {
          const activeAgents = agents.filter(a => a.owned > 0);
          
          if (activeAgents.length > 0) {
            // Get passive collection upgrades
            let passiveMultiplier = 0;
            try {
              const { state: unlockables } = deserializeUnlockables(cookieStorage.getItem(UNLOCKABLES_STORAGE_KEY));
              const passiveUpgrades = unlockables.filter(
                u => u.type === 'upgrade' && u.upgradeType === 'passive' && u.unlocked
              );
              passiveMultiplier = passiveUpgrades.reduce((sum, upgrade) => {
                return sum + (upgrade.multiplierValue || 0);
              }, 0);
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
              
              // Update state and cookies with rounded value
              setOctopusCount(newCountRounded);
              cookieStorage.setItem(OCTOPUS_COUNT_KEY, fractionalCount.toString());
              return;
            }
          }
        }
        
        // If no active agents, synchronize from cookies
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

