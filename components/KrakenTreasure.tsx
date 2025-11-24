'use client';

import { useState, useEffect } from 'react';
import Button from './Button';
import { RiLockLine, RiEmotionLine, RiGamepadLine, RiShoppingBagLine } from 'react-icons/ri';
import { formatNumber, formatKrakenValue } from '@/utils/formatNumber';
import HopeMinigame from './Minigames/HopeMinigame';
import CourageMinigame from './Minigames/CourageMinigame';
import ConnectionMinigame from './Minigames/ConnectionMinigame';
import HealingMinigame from './Minigames/HealingMinigame';
import FloatingText from './FloatingText';
import { Route } from '@/shared/Route';
import Link from 'next/link';
import { useAudio } from '@/hooks/useAudio';
import { usePathname } from 'next/navigation';
import { useUnlockedPages } from '@/hooks/useUnlockedPages';
import { cookieStorage } from '@/utils/cookieStorage';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  AgentState as Agent,
  MinigameState as Minigame,
  MissionState as Mission,
  UnlockableState as Unlockable,
  buildAgents,
  buildMinigames,
  buildMissions,
  buildUnlockables,
  deserializeAgents,
  deserializeMinigames,
  deserializeMissions,
  deserializeUnlockables,
  serializeAgentProgress,
  serializeMinigameProgress,
  serializeMissionProgress,
  serializeUnlockableProgress
} from '@/shared/gameData';

const persistMissionProgress = (missions: Mission[]) => {
  const payload = serializeMissionProgress(missions);
  if (payload.length === 0) {
    cookieStorage.removeItem(MISSIONS_STORAGE_KEY);
  } else {
    cookieStorage.setItem(MISSIONS_STORAGE_KEY, JSON.stringify(payload));
  }
};

const defaultAudioSettings = {
  buttonClickEnabled: false,
  collectEnabled: false,
  minigameSoundsEnabled: {
    hope: false,
    courage: false,
    connection: false,
    healing: false
  },
  musicEnabled: false
};

const getAudioSettingsFromCookie = () => {
  const saved = cookieStorage.getItem(AUDIO_SETTINGS_KEY);
  if (!saved) return { ...defaultAudioSettings };
  try {
    const parsed = JSON.parse(saved);
    return {
      buttonClickEnabled: !!parsed.buttonClickEnabled,
      collectEnabled: !!parsed.collectEnabled,
      minigameSoundsEnabled: {
        hope: !!parsed.minigameSoundsEnabled?.hope,
        courage: !!parsed.minigameSoundsEnabled?.courage,
        connection: !!parsed.minigameSoundsEnabled?.connection,
        healing: !!parsed.minigameSoundsEnabled?.healing
      },
      musicEnabled: !!parsed.musicEnabled
    };
  } catch (e) {
    return { ...defaultAudioSettings };
  }
};

const persistAudioSettings = (settings: typeof defaultAudioSettings) => {
  cookieStorage.setItem(AUDIO_SETTINGS_KEY, JSON.stringify(settings));
};

const updateAudioSettingsForUnlockable = (unlockableId: string) => {
  const current = getAudioSettingsFromCookie();
  let changed = false;
  switch (unlockableId) {
    case 'sound-button-click':
      if (!current.buttonClickEnabled || !current.collectEnabled) {
        current.buttonClickEnabled = true;
        current.collectEnabled = true;
        changed = true;
      }
      break;
    case 'sound-minigame-hope':
      if (!current.minigameSoundsEnabled.hope) {
        current.minigameSoundsEnabled.hope = true;
        changed = true;
      }
      break;
    case 'sound-minigame-courage':
      if (!current.minigameSoundsEnabled.courage) {
        current.minigameSoundsEnabled.courage = true;
        changed = true;
      }
      break;
    case 'sound-minigame-connection':
      if (!current.minigameSoundsEnabled.connection) {
        current.minigameSoundsEnabled.connection = true;
        changed = true;
      }
      break;
    case 'sound-minigame-healing':
      if (!current.minigameSoundsEnabled.healing) {
        current.minigameSoundsEnabled.healing = true;
        changed = true;
      }
      break;
    case 'sound-music':
      if (!current.musicEnabled) {
        current.musicEnabled = true;
        changed = true;
      }
      break;
  }
  if (changed) {
    persistAudioSettings(current);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('audioSettingsChanged'));
    }
  }
};

interface KrakenTreasureProps {
  collectedOctopuses: number;
  onOctopusChange: (newCount: number) => void;
  onClose: () => void;
}

const STORAGE_KEY = 'emotion-journey-progress';
const MINIGAMES_STORAGE_KEY = 'minigames-progress';
const UNLOCKABLES_STORAGE_KEY = 'unlockables-progress';
const AGENTS_STORAGE_KEY = 'agents-progress';
const MISSIONS_STORAGE_KEY = 'missions-progress';
const AUDIO_SETTINGS_KEY = 'audio-settings';

// Función para calcular el precio actual de un agente basado en cuántos tiene
const calculateAgentCost = (agent: Agent): number => {
  // Precio = baseCost * (costMultiplier ^ owned)
  return Math.floor(agent.baseCost * Math.pow(agent.costMultiplier, agent.owned));
};

// Helper function to get agent efficiency (krakenlings/second per krakenling invested)
const getAgentEfficiency = (agent: Agent): number => {
  const currentCost = calculateAgentCost(agent);
  return agent.collectionRate / currentCost;
};

export default function KrakenTreasure({ collectedOctopuses, onOctopusChange, onClose }: KrakenTreasureProps) {
  const { t } = useLanguage();
  const { playButtonClick } = useAudio();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<'helpers' | 'treasures' | 'upgrades' | 'therapies' | 'missions'>('therapies');
  const [displayOctopusCount, setDisplayOctopusCount] = useState(collectedOctopuses);
  const [pickedCount, setPickedCount] = useState(0);
  const [showMinigame, setShowMinigame] = useState<string | null>(null);
  const [totalPulpitosPerSecond, setTotalPulpitosPerSecond] = useState(0);
  const [floatingTexts, setFloatingTexts] = useState<Array<{ id: string; value: number; x: number; y: number }>>([]);
  const [missions, setMissions] = useState<Mission[]>(buildMissions());
  const [missionsLoaded, setMissionsLoaded] = useState(false);
  const [minigames, setMinigames] = useState<Minigame[]>(buildMinigames());

  const [agents, setAgents] = useState<Agent[]>(buildAgents());

  // State to update minigame cooldown in real time
  const [cooldownUpdate, setCooldownUpdate] = useState(0);
  
  // Synchronize krakenling counter every second
  useEffect(() => {
    setDisplayOctopusCount(collectedOctopuses);
  }, [collectedOctopuses]);

  // Actualizar el contador constantemente desde cookies para incremento suave
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const updateInterval = setInterval(() => {
      const savedCount = parseInt(cookieStorage.getItem('octopus-count') || '0', 10);
      setDisplayOctopusCount(savedCount);
      if (savedCount !== collectedOctopuses) {
        onOctopusChange(savedCount);
      }
      // Update picked count (manually collected)
      const picked = parseFloat(cookieStorage.getItem('octopus-picked-count') || '0');
      setPickedCount(picked);
    }, 100); // Actualizar cada 100ms para incremento suave y constante

    return () => clearInterval(updateInterval);
  }, [collectedOctopuses, onOctopusChange]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCooldownUpdate(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const [unlockables, setUnlockables] = useState<Unlockable[]>(buildUnlockables());

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const { state: agentState, shouldPersist: persistAgents } = deserializeAgents(
      cookieStorage.getItem(AGENTS_STORAGE_KEY)
    );
    setAgents(agentState);
    if (persistAgents) {
      persistAgentProgress(agentState);
    }

    const { state: unlockableState, shouldPersist: persistUnlockablesFlag } = deserializeUnlockables(
      cookieStorage.getItem(UNLOCKABLES_STORAGE_KEY)
    );
    setUnlockables(unlockableState);
    if (persistUnlockablesFlag) {
      persistUnlockableProgress(unlockableState);
    }

    const { state: minigameState, shouldPersist: persistMinigamesFlag } = deserializeMinigames(
      cookieStorage.getItem(MINIGAMES_STORAGE_KEY)
    );
    setMinigames(minigameState);
    if (persistMinigamesFlag) {
      persistMinigameProgress(minigameState);
    }

    const { state: missionState, shouldPersist: persistMissionFlag } = deserializeMissions(
      cookieStorage.getItem(MISSIONS_STORAGE_KEY)
    );
    setMissions(missionState);
    setMissionsLoaded(true);
    if (persistMissionFlag) {
      persistMissionProgress(missionState);
    }
  }, []);

  // Check and update mission completion status
  useEffect(() => {
    if (typeof window === 'undefined' || !missionsLoaded) return;
    
    setMissions(prevMissions => {
      let hasChanges = false;
      
      const updatedMissions = prevMissions.map(mission => {
        if (mission.completed) return mission;
        
        if (mission.dependsOn && mission.dependsOn.length > 0) {
          const prerequisitesMet = mission.dependsOn.every(depId => {
            const dependency = prevMissions.find(m => m.id === depId);
            return dependency?.claimed ? true : false;
          });
          if (!prerequisitesMet) {
            return mission;
          }
        }
        
        let isCompleted: boolean = mission.completed;
        
        switch (mission.type) {
          case 'visit-page': {
            if (mission.target && pathname === mission.target) {
              isCompleted = true;
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
            if (totalPulpitosPerSecond >= targetKps) {
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
            const targetMission = prevMissions.find(m => m.id === mission.target);
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
        persistMissionProgress(updatedMissions);
        // Dispatch event when missions change
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('missionChanged'));
        }
      }

      return updatedMissions;
    });
  }, [pathname, minigames, totalPulpitosPerSecond, missionsLoaded, unlockables, agents]);

  // Calculate total krakenlings per second (with multipliers)
  useEffect(() => {
    const activeAgents = agents.filter(a => a.owned > 0);
    
    // Calculate base krakenlings per second from all agents (with agent multipliers)
    const baseKrakenlingsPerSecond = activeAgents.reduce((sum, agent) => {
      return sum + (agent.owned * agent.collectionRate * agent.multiplier);
    }, 0);
    
    // Get passive collection upgrades
    let passiveMultiplier = 0;
    const passiveUpgrades = unlockables.filter(
      u => u.type === 'upgrade' && u.upgradeType === 'passive' && u.unlocked && u.multiplierValue !== undefined
    );
    passiveMultiplier = passiveUpgrades.reduce((sum, upgrade) => {
      return sum + (upgrade.multiplierValue || 0);
    }, 0);
    
    // Apply passive collection bonus (percentage of base rate)
    const passiveBonus = baseKrakenlingsPerSecond * passiveMultiplier;
    const totalKrakenlingsPerSecond = baseKrakenlingsPerSecond + passiveBonus;
    
    setTotalPulpitosPerSecond(totalKrakenlingsPerSecond);
  }, [agents, unlockables]);

  // Note: The automatic agent collection system is now in useOctopuses
  // so it works globally, even when the shop is not open

  const canPlayMinigame = (minigame: Minigame): boolean => {
    if (!minigame.unlocked) return false;
    if (minigame.lastPlayed === 0) return true;
    const timeSinceLastPlay = Date.now() - minigame.lastPlayed;
    return timeSinceLastPlay >= minigame.cooldown;
  };

  const getCooldownRemaining = (minigame: Minigame): number => {
    if (minigame.lastPlayed === 0) return 0;
    const timeSinceLastPlay = Date.now() - minigame.lastPlayed;
    const remaining = minigame.cooldown - timeSinceLastPlay;
    return Math.max(0, remaining);
  };

  const handleClaimMission = (missionId: string) => {
    if (!missionsLoaded) return;
    const missionToClaim = missions.find(m => m.id === missionId);
    if (!missionToClaim || !missionToClaim.completed || missionToClaim.claimed) {
      return;
    }
    const rewardAmount = missionToClaim.reward || 0;
    
    setMissions(prevMissions => {
      const updatedMissions = prevMissions.map(mission => {
        if (mission.id === missionId && mission.completed && !mission.claimed) {
          return { ...mission, claimed: true };
        }
        return mission;
      });
      persistMissionProgress(updatedMissions);
      // Dispatch event when missions change
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('missionChanged'));
      }
      return updatedMissions;
    });
    
    if (rewardAmount > 0) {
      const currentFractional = parseFloat(cookieStorage.getItem('octopus-count') || '0');
      const newFractional = currentFractional + rewardAmount;
      cookieStorage.setItem('octopus-count', newFractional.toString());
      const newCount = Math.floor(newFractional);
      setDisplayOctopusCount(newCount);
      onOctopusChange(newCount);
      setFloatingTexts(prev => [
        ...prev,
        {
          id: `mission-reward-${missionId}-${Date.now()}`,
          value: rewardAmount,
          x: 50,
          y: 10
        }
      ]);
    }
  };

  const persistAgentProgress = (state: Agent[]) => {
    const payload = serializeAgentProgress(state);
    if (payload.length === 0) {
      cookieStorage.removeItem(AGENTS_STORAGE_KEY);
    } else {
      cookieStorage.setItem(AGENTS_STORAGE_KEY, JSON.stringify(payload));
    }
  };

  const persistUnlockableProgress = (state: Unlockable[]) => {
    const payload = serializeUnlockableProgress(state);
    if (payload.length === 0) {
      cookieStorage.removeItem(UNLOCKABLES_STORAGE_KEY);
    } else {
      cookieStorage.setItem(UNLOCKABLES_STORAGE_KEY, JSON.stringify(payload));
    }
  };

  const persistMinigameProgress = (state: Minigame[]) => {
    const payload = serializeMinigameProgress(state);
    if (payload.length === 0) {
      cookieStorage.removeItem(MINIGAMES_STORAGE_KEY);
    } else {
      cookieStorage.setItem(MINIGAMES_STORAGE_KEY, JSON.stringify(payload));
    }
  };

  const isMissionCompleted = (missionId?: string): boolean => {
    if (!missionId) return true;
    if (!missionsLoaded) return false;
    const mission = missions.find(m => m.id === missionId);
    return mission?.claimed ? true : false;
  };

  const getMissionName = (missionId?: string): string => {
    if (!missionId) return '';
    if (!missionsLoaded) return '';
    const mission = missions.find(m => m.id === missionId);
    if (mission && t.gameData.missions[missionId]) {
      return t.gameData.missions[missionId].name;
    }
    return mission?.name || '';
  };

  const getAgentName = (agentId: string): string => {
    return t.gameData.agents[agentId]?.name || '';
  };

  const getAgentDescription = (agentId: string): string => {
    return t.gameData.agents[agentId]?.description || '';
  };

  const getUnlockableName = (unlockableId: string): string => {
    return t.gameData.unlockables[unlockableId]?.name || '';
  };

  const getUnlockableDescription = (unlockableId: string): string => {
    return t.gameData.unlockables[unlockableId]?.description || '';
  };

  const getMinigameName = (minigameId: string): string => {
    return t.gameData.minigames[minigameId]?.name || '';
  };

  const getMinigameDescription = (minigameId: string): string => {
    return t.gameData.minigames[minigameId]?.description || '';
  };

  const getUnclaimedCompletedMissionsCount = (): number => {
    if (!missionsLoaded) return 0;
    return missions.filter(m => m.completed && !m.claimed).length;
  };

  const handleMinigameComplete = (minigameId: string) => {
    const minigame = minigames.find(m => m.id === minigameId);
    if (!minigame) return;

    const now = Date.now();
    // Increase reward: baseReward * (timesCompleted + 1) * rewardMultiplier
    const newTimesCompleted = minigame.timesCompleted + 1;
    const newReward = Math.floor(minigame.baseReward * newTimesCompleted * (minigame.rewardMultiplier || 1.0));
    
    const updatedMinigames = minigames.map(m => 
      m.id === minigameId ? { 
        ...m, 
        lastPlayed: now,
        timesCompleted: newTimesCompleted,
        reward: newReward
      } : m
    );
    
    setMinigames(updatedMinigames);
    if (typeof window !== 'undefined') {
      persistMinigameProgress(updatedMinigames);
      
      // Show floating text for reward
      setFloatingTexts(prev => [...prev, {
        id: `floating-minigame-${minigameId}-${Date.now()}`,
        value: newReward,
        x: 50, // Center of screen
        y: 50
      }]);
      
      // Give krakenlings as reward
      // Get current fractional count from cookies to maintain precision
      const currentFractional = parseFloat(cookieStorage.getItem('octopus-count') || '0');
      const newFractionalCount = currentFractional + newReward;
      const newCount = Math.floor(newFractionalCount);
      onOctopusChange(newCount);
      // Save fractional count to maintain precision
      cookieStorage.setItem('octopus-count', newFractionalCount.toString());
      
      // Dispatch event to update mission badges when minigame is completed
      // This will trigger mission completion checks
      window.dispatchEvent(new CustomEvent('minigameCompleted', { detail: { minigameId } }));
    }
    
    setShowMinigame(null);
  };

  const removeFloatingText = (id: string) => {
    setFloatingTexts(prev => prev.filter(t => t.id !== id));
  };

  const handlePurchaseUnlockable = (unlockableId: string) => {
    if (typeof window === 'undefined') return;
    
    const unlockable = unlockables.find(u => u.id === unlockableId);
    if (!unlockable || unlockable.unlocked) return;
    
    // Get current fractional count from cookies to check if can afford
    let currentFractional = parseFloat(cookieStorage.getItem('octopus-count') || '0');
    if (currentFractional < unlockable.cost) return;

    // Get current fractional count from cookies to maintain precision
    const newFractionalCount = currentFractional - unlockable.cost;
    const newCount = Math.floor(newFractionalCount);
    
    const updatedUnlockables = unlockables.map(u => 
      u.id === unlockableId ? { ...u, unlocked: true } : u
    );
    
    setUnlockables(updatedUnlockables);
    onOctopusChange(newCount);
    
    if (typeof window !== 'undefined') {
      persistUnlockableProgress(updatedUnlockables);
      cookieStorage.setItem('octopus-count', newFractionalCount.toString());
    }
    
    // Handle upgrade purchases
    if (unlockable.type === 'upgrade') {
      if (unlockable.upgradeType === 'agent-multiplier' && unlockable.targetAgentId && unlockable.multiplierValue !== undefined) {
        // Apply multiplier to the target agent
        // Start from base multiplier (1.0) and apply all unlocked upgrades for this agent
        const baseMultiplier = 1.0;
        const allUnlockedUpgrades = unlockables.filter(
          u => u.type === 'upgrade' && 
               u.upgradeType === 'agent-multiplier' && 
               u.targetAgentId === unlockable.targetAgentId && 
               u.unlocked && 
               u.multiplierValue !== undefined
        );
        const finalMultiplier = allUnlockedUpgrades.reduce((mult, upgrade) => {
          return mult * (upgrade.multiplierValue || 1.0);
        }, baseMultiplier);
        
        const updatedAgents = agents.map(a => 
          a.id === unlockable.targetAgentId ? { ...a, multiplier: finalMultiplier } : a
        );
        setAgents(updatedAgents);
        if (typeof window !== 'undefined') {
          persistAgentProgress(updatedAgents);
        }
      } else if (unlockable.upgradeType === 'minigame-cooldown' && unlockable.targetMinigameId && unlockable.multiplierValue !== undefined) {
        // Apply cooldown reduction to the target minigame
        const updatedMinigames = minigames.map(m => {
          if (m.id === unlockable.targetMinigameId) {
            const newCooldownReduction = m.cooldownReduction + unlockable.multiplierValue!;
            const newCooldown = Math.floor(m.baseCooldown * (1 - newCooldownReduction));
            return { ...m, cooldownReduction: newCooldownReduction, cooldown: newCooldown };
          }
          return m;
        });
        setMinigames(updatedMinigames);
        if (typeof window !== 'undefined') {
          persistMinigameProgress(updatedMinigames);
        }
      } else if (unlockable.upgradeType === 'minigame-reward-multiplier' && unlockable.targetMinigameId && unlockable.multiplierValue !== undefined) {
        // Apply reward multiplier to minigames
        // If targetMinigameId is 'all', apply to all minigames
        // Otherwise, apply to specific minigame and multiply all existing multipliers
        const updatedMinigames = minigames.map(m => {
          if (unlockable.targetMinigameId === 'all' || m.id === unlockable.targetMinigameId) {
            // Multiply the existing rewardMultiplier by the new multiplier value
            const newRewardMultiplier = (m.rewardMultiplier || 1.0) * unlockable.multiplierValue!;
            // Recalculate current reward with new multiplier
            const newReward = Math.floor(m.baseReward * (m.timesCompleted + 1) * newRewardMultiplier);
            return { ...m, rewardMultiplier: newRewardMultiplier, reward: newReward };
          }
          return m;
        });
        setMinigames(updatedMinigames);
        if (typeof window !== 'undefined') {
          persistMinigameProgress(updatedMinigames);
        }
      } else if (unlockable.upgradeType === 'audio') {
        updateAudioSettingsForUnlockable(unlockable.id);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('unlockableChanged'));
        }
      }
      // Passive upgrades are handled in useOctopuses hook
    }
    
    // Si es el tesoro final, mostrar mensaje especial
    if (unlockableId === 'true-heart') {
      alert(t.treasure.finalTreasureMessage);
    }
    
    // If it's a page, update unlock status
    if (unlockable.type === 'page') {
      // Mapear unlockables a emociones para compatibilidad
      const emotionMap: { [key: string]: string } = {
        'home': 'hope',
        'games': 'courage',
        'team': 'connection',
        'contact': 'healing',
        'newsletter': 'healing'
      };
      
      const emotionId = emotionMap[unlockableId];
      if (emotionId && typeof window !== 'undefined') {
        const saved = cookieStorage.getItem(STORAGE_KEY);
        let progress: any = { emotions: [] };
        
        if (saved) {
          try {
            progress = JSON.parse(saved);
            progress.emotions = progress.emotions || [];
          } catch (e) {
            progress = { emotions: [] };
          }
        }
        
        // Search if emotion already exists, if not, create it
        const emotionIndex = progress.emotions.findIndex((e: any) => e.id === emotionId);
        if (emotionIndex >= 0) {
          progress.emotions[emotionIndex] = { ...progress.emotions[emotionIndex], unlocked: true };
        } else {
          progress.emotions.push({ id: emotionId, unlocked: true });
        }
        
        cookieStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
        window.dispatchEvent(new CustomEvent('emotionUnlocked'));
      }
    }
    
    // If it's a minigame, unlock it
    if (unlockable.type === 'feature' && unlockable.id.includes('minigame')) {
      // Extract emotionId from unlockable id (e.g., 'courage-minigame' -> 'courage')
      const emotionId = unlockable.id.split('-')[0];
      const updatedMinigames = minigames.map(m => {
        if (m.emotionId === emotionId) {
          return { ...m, unlocked: true };
        }
        return m;
      });
      setMinigames(updatedMinigames);
      if (typeof window !== 'undefined') {
        persistMinigameProgress(updatedMinigames);
        // Dispatch event to update UI
        window.dispatchEvent(new CustomEvent('unlockableChanged'));
        // Also dispatch emotionUnlocked for compatibility
        window.dispatchEvent(new CustomEvent('emotionUnlocked'));
      }
    }
  };

  const handlePurchaseAgent = (agentId: string) => {
    if (typeof window === 'undefined') return;
    
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return;
    
    const currentCost = calculateAgentCost(agent);
    if (displayOctopusCount < currentCost) return;

    // Get current fractional count from cookies to maintain precision
    const currentFractional = parseFloat(cookieStorage.getItem('octopus-count') || '0');
    const newFractionalCount = currentFractional - currentCost;
    const newCount = Math.floor(newFractionalCount);
    
    const updatedAgents = agents.map(a => 
      a.id === agentId ? { ...a, owned: a.owned + 1 } : a
    );
    
    setAgents(updatedAgents);
    onOctopusChange(newCount);
    
    persistAgentProgress(updatedAgents);
    // Save fractional count to maintain precision
    cookieStorage.setItem('octopus-count', newFractionalCount.toString());
  };

  return (
    <>
      {/* Floating texts for minigame rewards */}
      {floatingTexts.map(text => (
        <FloatingText
          key={text.id}
          value={text.value}
          x={text.x}
          y={text.y}
          onComplete={() => removeFloatingText(text.id)}
        />
      ))}
      
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-90 p-2 sm:p-4" style={{ overflow: 'visible' }}>
        <div className="relative bg-turquoise-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-12 w-full max-w-5xl mx-2 sm:mx-4 border-2 border-turquoise-400 flex flex-col h-[90vh] max-h-[90vh]" style={{ overflow: 'visible' }}>
          <button
            onClick={() => {
              playButtonClick();
              onClose();
            }}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 text-white text-2xl sm:text-3xl font-bold opacity-60 hover:opacity-100 transition-opacity w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-10"
            aria-label="Close"
          >
            ×
          </button>

          <div className="text-center mb-4 sm:mb-6 flex-shrink-0">
            <h2 className="font-lora text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-turquoise-400 mb-2 sm:mb-4">
              {t.treasure.title}
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm md:text-base text-center mb-2 sm:mb-4 px-2">
              {t.treasure.description}
            </p>
            <div className="flex flex-col items-center gap-2 min-w-0 w-full">
              <div className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg md:text-xl lg:text-2xl min-w-0 w-full justify-center px-2">
                <RiEmotionLine className="text-turquoise-400 flex-shrink-0 text-sm sm:text-base md:text-lg" />
                <span className="text-white font-bold truncate min-w-0">{formatNumber(Math.floor(displayOctopusCount))}</span>
                <span className="text-gray-200 flex-shrink-0 text-xs sm:text-sm md:text-base">{t.treasure.krakenlings}</span>
                {pickedCount > 0 && (
                  <span className="text-gray-400 flex-shrink-0 text-xs sm:text-sm md:text-base">
                    ({formatNumber(Math.floor(pickedCount))} {t.treasure.saved})
                  </span>
                )}
              </div>
              {totalPulpitosPerSecond > 0 && (
                <div className="text-turquoise-300 text-xs sm:text-sm whitespace-nowrap">
                  +{formatKrakenValue(totalPulpitosPerSecond)} {t.treasure.perSecond}
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6 border-b border-turquoise-400 flex-shrink-0 overflow-x-auto scrollbar-hide" style={{ paddingTop: '12px', marginTop: '-12px', overflowY: 'visible' }}>
            <button
              onClick={() => {
                playButtonClick();
                setActiveTab('missions');
              }}
              className={`px-3 sm:px-6 py-2 sm:py-3 font-lora text-sm sm:text-lg md:text-xl font-bold transition-all relative whitespace-nowrap ${
                activeTab === 'missions'
                  ? 'text-turquoise-400'
                  : 'text-gray-300 hover:text-white'
              } ${getUnclaimedCompletedMissionsCount() > 0 ? 'pr-6 sm:pr-8' : ''}`}
              style={{ borderBottom: '2px solid', borderBottomColor: activeTab === 'missions' ? 'rgb(94 234 212)' : 'transparent' }}
            >
              {t.treasure.missions}
              {getUnclaimedCompletedMissionsCount() > 0 && (
                <span className="absolute top-0 right-0 bg-turquoise-400 text-black text-[10px] sm:text-xs font-bold rounded-full min-w-[1.25rem] h-5 px-1.5 flex items-center justify-center z-50 transform translate-x-1/2 -translate-y-1/2">
                  {getUnclaimedCompletedMissionsCount()}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                playButtonClick();
                setActiveTab('therapies');
              }}
              className={`px-3 sm:px-6 py-2 sm:py-3 font-lora text-sm sm:text-lg md:text-xl font-bold transition-all relative whitespace-nowrap ${
                activeTab === 'therapies'
                  ? 'text-turquoise-400'
                  : 'text-gray-300 hover:text-white'
              }`}
              style={{ borderBottom: activeTab === 'therapies' ? '2px solid rgb(94 234 212)' : '2px solid transparent', borderBottomColor: activeTab === 'therapies' ? 'rgb(94 234 212)' : 'transparent' }}
            >
              <RiGamepadLine className="inline mr-1 sm:mr-2 text-base sm:text-lg md:text-xl" />
              {t.treasure.therapies}
            </button>
            <button
              onClick={() => {
                playButtonClick();
                setActiveTab('treasures');
              }}
              className={`px-3 sm:px-6 py-2 sm:py-3 font-lora text-sm sm:text-lg md:text-xl font-bold transition-all relative whitespace-nowrap ${
                activeTab === 'treasures'
                  ? 'text-turquoise-400'
                  : 'text-gray-300 hover:text-white'
              }`}
              style={{ borderBottom: activeTab === 'treasures' ? '2px solid rgb(94 234 212)' : '2px solid transparent', borderBottomColor: activeTab === 'treasures' ? 'rgb(94 234 212)' : 'transparent' }}
            >
              <RiShoppingBagLine className="inline mr-1 sm:mr-2 text-base sm:text-lg md:text-xl" />
              {t.treasure.treasures}
            </button>
            <button
              onClick={() => {
                playButtonClick();
                setActiveTab('upgrades');
              }}
              className={`px-3 sm:px-6 py-2 sm:py-3 font-lora text-sm sm:text-lg md:text-xl font-bold transition-all relative whitespace-nowrap ${
                activeTab === 'upgrades'
                  ? 'text-turquoise-400'
                  : 'text-gray-300 hover:text-white'
              }`}
              style={{ borderBottom: activeTab === 'upgrades' ? '2px solid rgb(94 234 212)' : '2px solid transparent', borderBottomColor: activeTab === 'upgrades' ? 'rgb(94 234 212)' : 'transparent' }}
            >
              <RiLockLine className="inline mr-1 sm:mr-2 text-base sm:text-lg md:text-xl" />
              {t.treasure.upgrades}
            </button>
            <button
              onClick={() => {
                playButtonClick();
                setActiveTab('helpers');
              }}
              className={`px-3 sm:px-6 py-2 sm:py-3 font-lora text-sm sm:text-lg md:text-xl font-bold transition-all relative whitespace-nowrap ${
                activeTab === 'helpers'
                  ? 'text-turquoise-400'
                  : 'text-gray-300 hover:text-white'
              }`}
              style={{ borderBottom: '2px solid', borderBottomColor: activeTab === 'helpers' ? 'rgb(94 234 212)' : 'transparent' }}
            >
              <RiEmotionLine className="inline mr-1 sm:mr-2 text-base sm:text-lg md:text-xl" />
              {t.treasure.helpers}
            </button>
          </div>

          {/* Contenido scrolleable */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 scrollbar-gutter-stable -mx-4 sm:-mx-6 md:-mx-12 px-4 sm:px-6 md:px-12">
          {/* Missions Section */}
          {activeTab === 'missions' && (
            <div className="pb-2" style={{ minHeight: '100%' }}>
              <div className="flex items-center justify-between mb-4 px-2">
                <p className="text-gray-300 text-sm">
                  {t.treasure.missionsDescription || 'Complete missions to unlock new helpers, treasures, and upgrades.'}
                </p>
                {getUnclaimedCompletedMissionsCount() > 0 && (
                  <div className="bg-turquoise-400 bg-opacity-20 border border-turquoise-400 rounded-lg px-3 py-1.5 flex items-center gap-2">
                    <span className="text-turquoise-300 text-xs sm:text-sm font-semibold">
                      {getUnclaimedCompletedMissionsCount()} {t.treasure.readyToClaim}
                    </span>
                  </div>
                )}
              </div>
              {!missionsLoaded ? (
                <div className="text-center text-gray-300 text-sm py-8">
                  {t.common.loading}
                </div>
              ) : (
              <div className="space-y-2">
                {missions
                  .filter(mission => {
                    if (!mission.dependsOn || mission.dependsOn.length === 0) return true;
                    return mission.dependsOn.every(dep => isMissionCompleted(dep));
                  })
                  .map((mission) => (
                  <div
                    key={mission.id}
                    className={`flex items-center justify-between gap-2 sm:gap-4 p-3 sm:p-4 rounded-lg border-2 transition-all overflow-hidden ${
                      mission.claimed
                        ? 'bg-green-800 bg-opacity-30 border-green-400'
                        : mission.completed
                        ? 'bg-turquoise-800 border-turquoise-400 hover:border-turquoise-300'
                        : 'bg-gray-800 border-gray-600 opacity-60'
                    }`}
                  >
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-lora text-base sm:text-lg font-bold text-white">{t.gameData.missions[mission.id]?.name || mission.name}</h3>
                        {mission.claimed && (
                          <span className="text-green-400 text-sm">✓ {t.treasure.claim}ed</span>
                        )}
                        {mission.completed && !mission.claimed && (
                          <span className="text-turquoise-400 text-sm">{t.treasure.readyToClaim}!</span>
                        )}
                      </div>
                      <p className="text-white opacity-70 text-xs">{t.gameData.missions[mission.id]?.description || mission.description}</p>
                      {mission.reward && (
                        <p className="text-turquoise-300 text-[11px] sm:text-xs mt-1">
                          {t.treasure.reward} +{formatKrakenValue(mission.reward)} {t.treasure.krakenlings}
                        </p>
                      )}
                    </div>
                    
                    {mission.completed && !mission.claimed && (
                      <button
                        onClick={() => {
                          playButtonClick();
                          handleClaimMission(mission.id);
                        }}
                        className="ml-4 bg-turquoise-400 hover:bg-turquoise-300 rounded-xl px-4 sm:px-6 py-2 sm:py-3 font-lora font-bold text-black text-sm sm:text-base transition-all"
                      >
                        {t.treasure.claim.toUpperCase()}
                      </button>
                    )}
                  </div>
                ))}
              </div>
              )}
            </div>
          )}

          {/* Therapies Section */}
          {activeTab === 'therapies' && (
            <div className="pb-2" style={{ minHeight: '100%' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {minigames.map((minigame) => {
                const canPlay = canPlayMinigame(minigame);
                const cooldownRemaining = getCooldownRemaining(minigame);
                const cooldownSeconds = Math.ceil(cooldownRemaining / 1000);
                
                // Extract only the emotion name (e.g., "Hope" from "Hope – Follow the Light")
                const getEmotionName = (name: string) => {
                  const dashIndex = name.indexOf(' – ');
                  return dashIndex !== -1 ? name.substring(0, dashIndex) : name;
                };
                const minigameTranslatedName = getMinigameName(minigame.id) || minigame.name;
                const emotionName = getEmotionName(minigameTranslatedName);

                return (
                  <div
                    key={minigame.id}
                    className={`relative p-4 sm:p-6 rounded-xl border-2 transition-all overflow-hidden ${
                      minigame.unlocked
                        ? canPlay
                          ? 'bg-turquoise-800 border-turquoise-400 hover:border-turquoise-300 cursor-pointer'
                          : 'bg-gray-800 border-gray-600 opacity-70'
                        : 'bg-gray-800 border-gray-600 opacity-60'
                    }`}
                    onClick={() => {
                      if (minigame.unlocked && canPlay) {
                        playButtonClick();
                        setShowMinigame(minigame.id);
                      }
                    }}
                  >
                    {minigame.unlocked ? (
                      <>
                    <div className="flex items-center justify-between mb-2 gap-2 overflow-hidden">
                      <h3 className="font-lora text-base sm:text-lg md:text-xl font-bold text-white flex items-center gap-2 truncate min-w-0">
                        {emotionName}
                      </h3>
                      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                        <RiEmotionLine className="text-turquoise-400 flex-shrink-0" />
                        <span className="text-white font-bold text-xs sm:text-sm md:text-base whitespace-nowrap">+{formatKrakenValue(minigame.reward)}</span>
                        {minigame.timesCompleted > 0 && (
                          <span className="text-gray-400 text-xs whitespace-nowrap">({minigame.timesCompleted}x)</span>
                        )}
                      </div>
                    </div>

                        {canPlay && (
                          <div className="text-left">
                            <Button label="PLAY" />
                          </div>
                        )}
                        
                        {!canPlay && (
                          <div className="text-left">
                            <p className="text-gray-300 text-xs sm:text-sm mb-2">
                              The therapy needs time to settle. Return in {cooldownSeconds}s
                            </p>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-turquoise-400 h-2 rounded-full transition-all"
                                style={{ width: `${((minigame.cooldown - cooldownRemaining) / minigame.cooldown) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </>
                    ) : (() => {
                      const unlockable = unlockables.find(u => u.type === 'feature' && u.id.includes(minigame.emotionId));
                      const missionRequirementId = unlockable?.missionRequirement || minigame.missionRequirement;
                      const missionName = getMissionName(missionRequirementId);
                      const missionCompleted = missionRequirementId ? isMissionCompleted(missionRequirementId) : false;
                      
                      if (!unlockable) {
                        // Show locked minigame with only mission requirement
                        return (
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between gap-2 overflow-hidden">
                              <h3 className="font-lora text-base sm:text-lg md:text-xl font-bold text-white flex items-center gap-2 truncate min-w-0">
                                {emotionName}
                              </h3>
                              <RiLockLine className="text-gray-400 flex-shrink-0 text-lg sm:text-xl" />
                            </div>
                            {missionName && (
                              <div className="bg-gray-700 bg-opacity-50 rounded-lg p-3 sm:p-4 border border-gray-600">
                                <p className="text-gray-400 text-xs sm:text-sm mb-1.5 sm:mb-2 font-semibold">Mission Required:</p>
                                <p className={`text-sm sm:text-base font-bold ${missionCompleted ? 'text-green-400' : 'text-yellow-400'}`}>
                                  {missionName}
                                </p>
                                {!missionCompleted && (
                                  <p className="text-gray-500 text-xs sm:text-sm mt-1.5 sm:mt-2">
                                    Complete this mission to unlock
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      }
                      
                      const canAfford = displayOctopusCount >= unlockable.cost;
                      const canUnlock = canAfford && (missionCompleted || !missionRequirementId);
                      
                      return (
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center justify-between gap-2 overflow-hidden">
                            <h3 className="font-lora text-base sm:text-lg md:text-xl font-bold text-white flex items-center gap-2 truncate min-w-0">
                              {emotionName}
                            </h3>
                          </div>
                          {missionName && (
                            <div className="bg-gray-700 bg-opacity-50 rounded-lg p-3 sm:p-4 border border-gray-600">
                              <p className="text-gray-400 text-xs sm:text-sm mb-1.5 sm:mb-2 font-semibold">Mission Required:</p>
                              <p className={`text-sm sm:text-base font-bold ${missionCompleted ? 'text-green-400' : 'text-yellow-400'}`}>
                                {missionName}
                              </p>
                              {!missionCompleted && (
                                <p className="text-gray-500 text-xs sm:text-sm mt-1.5 sm:mt-2">
                                  Complete this mission to unlock
                                </p>
                              )}
                            </div>
                          )}
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                              <RiEmotionLine className="text-turquoise-400 flex-shrink-0" />
                              <span className="text-white font-bold text-xs sm:text-sm md:text-base whitespace-nowrap">{formatNumber(unlockable.cost)}</span>
                            </div>
                            <button
                              disabled={!canUnlock}
                              onClick={(e) => {
                                e.stopPropagation();
                                playButtonClick();
                                if (canUnlock) {
                                  handlePurchaseUnlockable(unlockable.id);
                                }
                              }}
                              className={`relative w-20 sm:w-24 md:w-32 lg:w-40 xl:w-56 py-2 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4 lg:px-6 border-none select-none flex items-center justify-center h-fit outline-none rounded-xl sm:rounded-2xl transition-all flex-shrink-0 ${
                                canUnlock
                                  ? 'bg-turquoise-400 hover:bg-turquoise-300 cursor-pointer'
                                  : 'bg-gray-600 opacity-40 pointer-events-none cursor-not-allowed'
                              }`}
                            >
                              <p className="whitespace-nowrap text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-lora font-bold text-black">UNLOCK</p>
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                );
              })}
              </div>
            </div>
          )}

          {/* Helpers Section */}
          {activeTab === 'helpers' && (
            <div className="pb-2" style={{ minHeight: '100%' }}>
              <p className="text-gray-300 text-sm mb-4 px-2">
                {t.treasure.helpersDescription || 'Hire helpers that automatically collect Krakenlings for you. The more you have, the more they gather.'}
              </p>
              <div className="space-y-2">
                {agents.map((agent) => {
                  const currentCost = calculateAgentCost(agent);
                  const canAfford = displayOctopusCount >= currentCost;
                  
                  // Check if previous agent is owned (except for first agent)
                  const agentIndex = agents.findIndex(a => a.id === agent.id);
                  const previousAgentOwned = agentIndex === 0 || (agentIndex > 0 && agents[agentIndex - 1].owned > 0);
                  const previousAgent = agentIndex > 0 ? agents[agentIndex - 1] : null;

                  const missionName = getMissionName(agent.missionRequirement);
                  const missionCompleted = isMissionCompleted(agent.missionRequirement);
                  
                  const canPurchase = previousAgentOwned && missionCompleted && canAfford;
                  const isAvailable = previousAgentOwned && missionCompleted;

                  // Extract only the main name (before the dash)
                  const getMainName = (fullName: string) => {
                    const dashIndex = fullName.indexOf(' – ');
                    return dashIndex !== -1 ? fullName.substring(0, dashIndex) : fullName;
                  };
                  
                  const agentTranslatedName = getAgentName(agent.id) || agent.name;
                  const agentMainName = getMainName(agentTranslatedName);
                  const previousAgentTranslatedName = previousAgent ? (getAgentName(previousAgent.id) || previousAgent.name) : null;
                  const previousAgentMainName = previousAgentTranslatedName ? getMainName(previousAgentTranslatedName) : null;

                  return (
                    <div
                      key={agent.id}
                      className={`flex items-center justify-between gap-2 sm:gap-4 p-3 sm:p-4 rounded-lg border-2 transition-all overflow-hidden ${
                        canPurchase
                          ? 'bg-turquoise-800 border-turquoise-400 hover:border-turquoise-300'
                          : 'bg-gray-800 border-gray-600 opacity-60'
                      }`}
                    >
                      <div className="flex-1 min-w-0 overflow-hidden">
                        {isAvailable ? (
                          <>
                            <div className="flex items-center gap-2">
                              <h3 className="font-lora text-base sm:text-lg font-bold text-white">
                                {agentMainName}
                                {agent.owned > 0 && (
                                  <span className="text-gray-400 font-normal ml-1">({formatNumber(agent.owned)})</span>
                                )}
                              </h3>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <RiEmotionLine className="text-turquoise-400 text-sm sm:text-base" />
                              <span className="text-white text-xs sm:text-sm">+{formatKrakenValue(agent.collectionRate * (agent.multiplier || 1.0))}/s</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <h3 className="font-lora text-base sm:text-lg font-bold text-white">???</h3>
                          </>
                        )}
                      </div>
                      
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        {/* Show requirements only if not all conditions are met */}
                        {(!previousAgentOwned || !missionCompleted) && (
                          <div className="text-right">
                            <p className="text-gray-400 text-xs mb-1">{t.treasure.requires}</p>
                            <div className="flex flex-col gap-1">
                              {agentIndex > 0 && previousAgent && previousAgentMainName && !previousAgentOwned && (
                                <p className="text-xs font-bold text-yellow-400 whitespace-nowrap">
                                  {t.treasure.buy || 'Buy'} {previousAgentMainName}
                                </p>
                              )}
                              {missionName && !missionCompleted && (
                                <p className="text-xs font-bold text-yellow-400 whitespace-nowrap">
                                  {missionName}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                        {isAvailable && (
                          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                            <div className="flex items-center gap-1 sm:gap-2">
                              <RiEmotionLine className="text-turquoise-400 text-sm sm:text-base flex-shrink-0" />
                              <span className="text-white font-bold text-xs sm:text-sm md:text-base whitespace-nowrap">{formatNumber(currentCost)}</span>
                            </div>
                            <button
                              disabled={!canAfford}
                              onClick={() => {
                                playButtonClick();
                                handlePurchaseAgent(agent.id);
                              }}
                              className={`relative w-16 sm:w-24 md:w-32 lg:w-40 xl:w-56 py-2 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4 lg:px-6 border-none select-none flex items-center justify-center h-fit outline-none rounded-xl sm:rounded-2xl transition-all flex-shrink-0 ${
                                canAfford
                                  ? 'bg-turquoise-400 hover:bg-turquoise-300 cursor-pointer'
                                  : 'bg-gray-600 opacity-40 pointer-events-none cursor-not-allowed'
                              }`}
                            >
                              <p className="whitespace-nowrap text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-lora font-bold text-black">{t.treasure.get}</p>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Treasures Section */}
          {activeTab === 'treasures' && (
            <div className="pb-2" style={{ minHeight: '100%' }}>
              <div className="space-y-2">
                {unlockables.filter(u => {
                  // Only show treasures and pages
                  if (u.type !== 'treasure' && u.type !== 'page') return false;
                  // Newsletter only appears if Contact is unlocked
                  if (u.id === 'newsletter') {
                    const contactUnlockable = unlockables.find(ul => ul.id === 'contact');
                    return contactUnlockable?.unlocked || false;
                  }
                  // True Heart only appears when all other treasures and pages are unlocked
                  if (u.id === 'true-heart') {
                    const allOtherUnlockables = unlockables.filter(
                      ul => (ul.type === 'page' || ul.type === 'treasure') && ul.id !== 'true-heart'
                    );
                    return allOtherUnlockables.every(ul => ul.unlocked);
                  }
                  return true;
                }).map((unlockable) => {
                  const missionName = getMissionName(unlockable.missionRequirement);
                  const missionCompleted = isMissionCompleted(unlockable.missionRequirement);
                  
                  return (
                  <div
                    key={unlockable.id}
                    className={`flex items-center justify-between gap-2 sm:gap-4 p-3 sm:p-4 rounded-lg border-2 transition-all overflow-hidden ${
                      unlockable.unlocked
                        ? 'bg-turquoise-400 bg-opacity-20 border-turquoise-400'
                        : displayOctopusCount >= unlockable.cost
                        ? 'bg-turquoise-800 border-turquoise-400 hover:border-turquoise-300'
                        : 'bg-gray-800 border-gray-600 opacity-60'
                    }`}
                  >
                    <div className="flex-1 min-w-0 overflow-hidden">
                      {unlockable.unlocked ? (
                        <div className="flex items-center gap-1 sm:gap-2">
                          <span className="text-green-400 text-sm sm:text-base md:text-lg flex-shrink-0">✓</span>
                          <div className="min-w-0">
                            <h3 className="font-lora text-sm sm:text-base md:text-lg font-bold text-white truncate">{getUnlockableName(unlockable.id) || unlockable.name}</h3>
                            <p className="text-gray-200 text-[10px] sm:text-xs mt-0.5 sm:mt-1 line-clamp-1">{getUnlockableDescription(unlockable.id) || unlockable.description}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="min-w-0">
                          {missionName && !missionCompleted ? (
                            <>
                              <h3 className="font-lora text-sm sm:text-base md:text-lg font-bold text-white truncate">???</h3>
                              <p className="text-white opacity-70 text-[10px] sm:text-xs mt-0.5 sm:mt-1 line-clamp-1">???</p>
                            </>
                          ) : (
                            <>
                              <h3 className="font-lora text-sm sm:text-base md:text-lg font-bold text-white truncate">{getUnlockableName(unlockable.id) || unlockable.name}</h3>
                              <p className="text-white opacity-70 text-[10px] sm:text-xs mt-0.5 sm:mt-1 line-clamp-1">{getUnlockableDescription(unlockable.id) || unlockable.description}</p>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      {missionName && !missionCompleted && (
                        <div className="text-right">
                          <p className="text-gray-400 text-xs">{t.treasure.requires}</p>
                          <p className={`text-xs font-bold text-yellow-400 whitespace-nowrap`}>
                            {missionName}
                          </p>
                        </div>
                      )}
                      {unlockable.unlocked ? (
                        unlockable.route ? (
                          <Link href={unlockable.route} onClick={() => onClose()}>
                            <Button label={t.treasure.go || 'GO'} />
                          </Link>
                        ) : (
                          <span className="text-green-400 text-xs sm:text-sm font-bold whitespace-nowrap">{t.treasure.unlocked}</span>
                        )
                      ) : (
                        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <RiEmotionLine className="text-turquoise-400 flex-shrink-0" />
                            <span className="text-white font-bold text-xs sm:text-sm md:text-base whitespace-nowrap">{formatNumber(unlockable.cost)}</span>
                          </div>
                          {(() => {
                            const canAfford = displayOctopusCount >= unlockable.cost;
                            return (
                              <button
                                disabled={!canAfford || !missionCompleted}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  playButtonClick();
                                  if (canAfford && missionCompleted) {
                                    handlePurchaseUnlockable(unlockable.id);
                                  }
                                }}
                                className={`relative w-16 sm:w-24 md:w-32 lg:w-40 xl:w-56 py-2 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4 lg:px-6 border-none select-none flex items-center justify-center h-fit outline-none rounded-xl sm:rounded-2xl transition-all flex-shrink-0 ${
                                  canAfford && missionCompleted
                                    ? 'bg-turquoise-400 hover:bg-turquoise-300 cursor-pointer'
                                    : 'bg-gray-600 opacity-40 pointer-events-none cursor-not-allowed'
                                }`}
                              >
                                <p className="whitespace-nowrap text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-lora font-bold text-black">{t.treasure.get}</p>
                              </button>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Upgrades Section */}
          {activeTab === 'upgrades' && (
            <div className="pb-2" style={{ minHeight: '100%' }}>
              <div className="space-y-2">
                {unlockables.filter(u => u.type === 'upgrade').sort((a, b) => {
                  const aMissionCompleted = isMissionCompleted(a.missionRequirement);
                  const aCanAfford = displayOctopusCount >= a.cost;
                  const aCanPurchase = !a.unlocked && aCanAfford && aMissionCompleted;
                  const aIsLocked = !a.unlocked && !aCanPurchase;
                  
                  const bMissionCompleted = isMissionCompleted(b.missionRequirement);
                  const bCanAfford = displayOctopusCount >= b.cost;
                  const bCanPurchase = !b.unlocked && bCanAfford && bMissionCompleted;
                  const bIsLocked = !b.unlocked && !bCanPurchase;
                  
                  // Priority order: 1. Available to purchase, 2. Locked, 3. Unlocked
                  if (aCanPurchase && !bCanPurchase) return -1;
                  if (!aCanPurchase && bCanPurchase) return 1;
                  
                  if (aIsLocked && !bIsLocked && !b.unlocked) return -1;
                  if (!aIsLocked && !a.unlocked && bIsLocked) return 1;
                  
                  if (a.unlocked && !b.unlocked) return 1;
                  if (!a.unlocked && b.unlocked) return -1;
                  
                  // Within same group, sort by cost
                  return a.cost - b.cost;
                }).map((unlockable) => {
                  const missionName = getMissionName(unlockable.missionRequirement);
                  const missionCompleted = isMissionCompleted(unlockable.missionRequirement);
                  const canAfford = displayOctopusCount >= unlockable.cost;
                  const canPurchase = canAfford && missionCompleted;
                  
                  return (
                  <div
                    key={unlockable.id}
                    className={`flex items-center justify-between gap-2 sm:gap-4 p-3 sm:p-4 rounded-lg border-2 transition-all overflow-hidden ${
                      unlockable.unlocked
                        ? 'bg-turquoise-400 bg-opacity-20 border-turquoise-400'
                        : canPurchase
                        ? 'bg-turquoise-800 border-turquoise-400 hover:border-turquoise-300'
                        : 'bg-gray-800 border-gray-600 opacity-60'
                    }`}
                  >
                    <div className="flex-1 min-w-0 overflow-hidden">
                      {unlockable.unlocked ? (
                        <div className="flex items-center gap-1 sm:gap-2">
                          <span className="text-green-400 text-sm sm:text-base md:text-lg flex-shrink-0">✓</span>
                          <div className="min-w-0">
                            <h3 className="font-lora text-sm sm:text-base md:text-lg font-bold text-white truncate">{getUnlockableName(unlockable.id) || unlockable.name}</h3>
                            <p className="text-gray-200 text-[10px] sm:text-xs mt-0.5 sm:mt-1 line-clamp-1">{getUnlockableDescription(unlockable.id) || unlockable.description}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="min-w-0">
                          {missionName && !missionCompleted ? (
                            <>
                              <h3 className="font-lora text-sm sm:text-base md:text-lg font-bold text-white truncate">???</h3>
                              <p className="text-white opacity-70 text-[10px] sm:text-xs mt-0.5 sm:mt-1 line-clamp-1">???</p>
                            </>
                          ) : (
                            <>
                              <h3 className="font-lora text-sm sm:text-base md:text-lg font-bold text-white truncate">{getUnlockableName(unlockable.id) || unlockable.name}</h3>
                              <p className="text-white opacity-70 text-[10px] sm:text-xs mt-0.5 sm:mt-1 line-clamp-1">{getUnlockableDescription(unlockable.id) || unlockable.description}</p>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      {missionName && !missionCompleted && (
                        <div className="text-right">
                          <p className="text-gray-400 text-xs">{t.treasure.requires}</p>
                          <p className={`text-xs font-bold text-yellow-400 whitespace-nowrap`}>
                            {missionName}
                          </p>
                        </div>
                      )}
                      {unlockable.unlocked ? (
                        <span className="text-green-400 text-xs sm:text-sm font-bold whitespace-nowrap">{t.treasure.unlocked}</span>
                      ) : (
                        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <RiEmotionLine className="text-turquoise-400 flex-shrink-0" />
                            <span className="text-white font-bold text-xs sm:text-sm md:text-base whitespace-nowrap">{formatNumber(unlockable.cost)}</span>
                          </div>
                          {(() => {
                            const canAfford = displayOctopusCount >= unlockable.cost;
                            return (
                              <button
                                disabled={!canAfford || !missionCompleted}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  playButtonClick();
                                  if (canAfford && missionCompleted) {
                                    handlePurchaseUnlockable(unlockable.id);
                                  }
                                }}
                                className={`relative w-16 sm:w-24 md:w-32 lg:w-40 xl:w-56 py-2 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4 lg:px-6 border-none select-none flex items-center justify-center h-fit outline-none rounded-xl sm:rounded-2xl transition-all flex-shrink-0 ${
                                  canAfford && missionCompleted
                                    ? 'bg-turquoise-400 hover:bg-turquoise-300 cursor-pointer'
                                    : 'bg-gray-600 opacity-40 pointer-events-none cursor-not-allowed'
                                }`}
                              >
                                <p className="whitespace-nowrap text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-lora font-bold text-black">{t.treasure.get}</p>
                              </button>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Minijuegos modales */}
      {showMinigame === 'hope' && (
        <HopeMinigame
          onComplete={() => handleMinigameComplete('hope')}
          onClose={() => setShowMinigame(null)}
        />
      )}
      {showMinigame === 'courage' && (
        <CourageMinigame
          onComplete={() => handleMinigameComplete('courage')}
          onClose={() => setShowMinigame(null)}
        />
      )}
      {showMinigame === 'connection' && (
        <ConnectionMinigame
          onComplete={() => handleMinigameComplete('connection')}
          onClose={() => setShowMinigame(null)}
        />
      )}
      {showMinigame === 'healing' && (
        <HealingMinigame
          onComplete={() => handleMinigameComplete('healing')}
          onClose={() => setShowMinigame(null)}
        />
      )}
    </>
  );
}

