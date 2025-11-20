'use client';

import { useState, useEffect } from 'react';
import Button from './Button';
import { RiLockLine, RiEmotionLine, RiGamepadLine, RiShoppingBagLine } from 'react-icons/ri';
import { formatNumber } from '@/utils/formatNumber';
import HopeMinigame from './Minigames/HopeMinigame';
import CourageMinigame from './Minigames/CourageMinigame';
import ConnectionMinigame from './Minigames/ConnectionMinigame';
import HealingMinigame from './Minigames/HealingMinigame';
import { Route } from '@/shared/Route';
import Link from 'next/link';

interface Minigame {
  id: string;
  name: string;
  description: string;
  emotionId: string;
  baseReward: number; // Base krakenlings given upon completion
  reward: number; // Current reward (increases with each completion)
  unlocked: boolean;
  completed: boolean;
  timesCompleted: number; // Number of times this minigame has been completed
  lastPlayed: number; // Timestamp of last time played
  baseCooldown: number; // Base cooldown in ms
  cooldown: number; // Current cooldown in ms (reduced by upgrades)
  cooldownReduction: number; // Percentage reduction (0-1)
}

interface Unlockable {
  id: string;
  name: string;
  description: string;
  cost: number;
  unlocked: boolean;
  route?: string;
  type: 'page' | 'feature' | 'treasure' | 'upgrade';
  upgradeType?: 'passive' | 'agent-multiplier' | 'minigame-cooldown'; // Para mejoras
  targetAgentId?: string; // Para multiplicadores de agentes específicos
  targetMinigameId?: string; // Para mejoras de minijuegos específicos
  multiplierValue?: number; // Valor del multiplicador
  thresholdKps?: number; // Krakenlings por segundo requeridos para mostrar esta mejora
}

interface KrakenTreasureProps {
  collectedOctopuses: number;
  onOctopusChange: (newCount: number) => void;
  onClose: () => void;
}

const STORAGE_KEY = 'emotion-journey-progress';
const MINIGAMES_STORAGE_KEY = 'minigames-progress';
const UNLOCKABLES_STORAGE_KEY = 'unlockables-progress';
const AGENTS_STORAGE_KEY = 'agents-progress';

interface Agent {
  id: string;
  name: string;
  description: string;
  baseCost: number; // Costo base
  owned: number;
  collectionRate: number; // Krakenlings per second
  collectionInterval: number; // Intervalo en ms
  costMultiplier: number; // Multiplicador exponencial para el precio
  multiplier: number; // Multiplicador de eficiencia (starts at 1.0)
  unlockRequirement?: string; // ID del agente que debe estar desbloqueado (owned > 0) para que este aparezca
}

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
  const [activeTab, setActiveTab] = useState<'minigames' | 'unlock-pages' | 'agents'>('minigames');
  const [displayOctopusCount, setDisplayOctopusCount] = useState(collectedOctopuses);
  const [showMinigame, setShowMinigame] = useState<string | null>(null);
  const [totalPulpitosPerSecond, setTotalPulpitosPerSecond] = useState(0);
  const [minigames, setMinigames] = useState<Minigame[]>([
    {
      id: 'hope',
      name: 'Hope – Follow the Light',
      description: 'A gentle sequence game where you practice focusing on one small step at a time. Perfect for moments when everything feels blurry or overwhelming.',
      emotionId: 'hope',
      baseReward: 10,
      reward: 10,
      unlocked: true,
      completed: false,
      timesCompleted: 0,
      lastPlayed: 0,
      baseCooldown: 30000, // 30 segundos
      cooldown: 30000,
      cooldownReduction: 0
    },
    {
      id: 'courage',
      name: 'Courage – Hold the Pressure',
      description: 'Hold the button and feel the tension rise… then release. A tiny practice of staying with discomfort just a little longer than usual.',
      emotionId: 'courage',
      baseReward: 15,
      reward: 15,
      unlocked: false,
      completed: false,
      timesCompleted: 0,
      lastPlayed: 0,
      baseCooldown: 45000, // 45 segundos
      cooldown: 45000,
      cooldownReduction: 0
    },
    {
      id: 'connection',
      name: 'Connection – Connect the Dots',
      description: 'Click the letters in order and rebuild the word. A reminder that connection often grows from small, intentional actions.',
      emotionId: 'connection',
      baseReward: 20,
      reward: 20,
      unlocked: false,
      completed: false,
      timesCompleted: 0,
      lastPlayed: 0,
      baseCooldown: 60000, // 60 segundos
      cooldown: 60000,
      cooldownReduction: 0
    },
    {
      id: 'healing',
      name: 'Healing – Breathing Rhythm',
      description: 'Tap in sync with the expanding circle. A playful way to notice your breath, reset your pace, and come back to yourself.',
      emotionId: 'healing',
      baseReward: 25,
      reward: 25,
      unlocked: false,
      completed: false,
      timesCompleted: 0,
      lastPlayed: 0,
      baseCooldown: 75000, // 75 segundos
      cooldown: 75000,
      cooldownReduction: 0
    }
  ]);

  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 'baby-kraken',
      name: 'Baby Kraken – Tiny Scout',
      description: 'A small, curious Krakenling that wanders the den and brings you 1 Krakenling per second. Perfect for starting your journey.',
      baseCost: 20,
      owned: 0,
      collectionRate: 1, // 1 krakenling per second
      collectionInterval: 1000,
      costMultiplier: 1.5, // Price increases 50% each time
      multiplier: 1.0
    },
    {
      id: 'young-kraken',
      name: 'Young Kraken – Steady Guardian',
      description: 'A focused helper that keeps an eye on drifting Krakenlings and gathers 5 per second. Best when you\'re ready to commit to longer sessions.',
      baseCost: 100,
      owned: 0,
      collectionRate: 5, // 5 krakenlings per second (more efficient: 0.05 krakenlings per krakenling invested vs 0.033 for baby)
      collectionInterval: 1000,
      costMultiplier: 1.4, // Price increases 40% each time
      multiplier: 1.0,
      unlockRequirement: 'baby-kraken'
    },
    {
      id: 'adult-kraken',
      name: 'Adult Kraken – Deep Tide Keeper',
      description: 'A powerful ally that channels the deep currents of the den, bringing 20 Krakenlings per second. Ideal for players who want the ocean to work quietly in the background.',
      baseCost: 500,
      owned: 0,
      collectionRate: 20, // 20 krakenlings per second (more efficient: 0.04 krakenlings per krakenling invested)
      collectionInterval: 1000,
      costMultiplier: 1.3, // Price increases 30% each time
      multiplier: 1.0,
      unlockRequirement: 'young-kraken'
    },
    {
      id: 'elder-kraken',
      name: 'Elder Kraken – Ancient Current',
      description: 'A wise, ancient presence that draws 50 Krakenlings per second from the deepest parts of the den. Their knowledge flows like the oldest tides.',
      baseCost: 2000,
      owned: 0,
      collectionRate: 50,
      collectionInterval: 1000,
      costMultiplier: 1.25,
      multiplier: 1.0,
      unlockRequirement: 'adult-kraken'
    },
    {
      id: 'guardian-kraken',
      name: 'Guardian Kraken – Protector of Depths',
      description: 'A vigilant guardian that watches over the den, collecting 100 Krakenlings per second. They ensure the den remains a safe space for all emotions.',
      baseCost: 5000,
      owned: 0,
      collectionRate: 100,
      collectionInterval: 1000,
      costMultiplier: 1.2,
      multiplier: 1.0,
      unlockRequirement: 'elder-kraken'
    },
    {
      id: 'tide-master',
      name: 'Tide Master – Keeper of Flow',
      description: 'A master of the ocean\'s rhythm, channeling 200 Krakenlings per second. They understand that healing comes in waves, not all at once.',
      baseCost: 10000,
      owned: 0,
      collectionRate: 200,
      collectionInterval: 1000,
      costMultiplier: 1.15,
      multiplier: 1.0,
      unlockRequirement: 'guardian-kraken'
    },
    {
      id: 'den-keeper',
      name: 'Den Keeper – Heart of the Abyss',
      description: 'The keeper of the den\'s deepest secrets, gathering 500 Krakenlings per second. They know that the most valuable treasures are the ones you find within yourself.',
      baseCost: 25000,
      owned: 0,
      collectionRate: 500,
      collectionInterval: 1000,
      costMultiplier: 1.1,
      multiplier: 1.0,
      unlockRequirement: 'tide-master'
    },
    {
      id: 'the-player',
      name: 'You – The True Treasure',
      description: 'You were the treasure all along. Your presence, your courage to show up and feel, generates 1000 Krakenlings per second. This isn\'t about the numbers – it\'s about recognizing your own worth.',
      baseCost: 50000,
      owned: 0,
      collectionRate: 1000,
      collectionInterval: 1000,
      costMultiplier: 1.05,
      multiplier: 1.0,
      unlockRequirement: 'den-keeper'
    }
  ]);

  // State to update minigame cooldown in real time
  const [cooldownUpdate, setCooldownUpdate] = useState(0);
  
  // Synchronize krakenling counter every second
  useEffect(() => {
    setDisplayOctopusCount(collectedOctopuses);
  }, [collectedOctopuses]);

  // Actualizar el contador constantemente desde localStorage para incremento suave
  useEffect(() => {
    const updateInterval = setInterval(() => {
      const savedCount = parseInt(localStorage.getItem('octopus-count') || '0', 10);
      setDisplayOctopusCount(savedCount);
      if (savedCount !== collectedOctopuses) {
        onOctopusChange(savedCount);
      }
    }, 100); // Actualizar cada 100ms para incremento suave y constante

    return () => clearInterval(updateInterval);
  }, [collectedOctopuses, onOctopusChange]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCooldownUpdate(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const [unlockables, setUnlockables] = useState<Unlockable[]>([
    {
      id: 'home',
      name: 'Home Page – "The First Light"',
      description: 'Unlock the main page of the den and see how the Kraken\'s story truly begins.',
      cost: 200,
      unlocked: false,
      route: Route.HOME,
      type: 'page'
    },
    {
      id: 'games',
      name: 'Games Page – "The Echo of Play"',
      description: 'Unlock a dedicated space for our games – a playground for your courage and curiosity.',
      cost: 500,
      unlocked: false,
      route: Route.HEART_WEAVER,
      type: 'page'
    },
    {
      id: 'team',
      name: 'About Us – "Faces Behind the Tentacles"',
      description: 'Unlock the team page and meet the people weaving stories, worlds, and mechanics behind the scenes.',
      cost: 1000,
      unlocked: false,
      route: Route.TEAM,
      type: 'page'
    },
    {
      id: 'contact',
      name: 'Contact & Newsletter – "Message in a Bottle"',
      description: 'Unlock a way to reach us and receive gentle updates, stories, and reflections from the den.',
      cost: 2000,
      unlocked: false,
      route: Route.HOME,
      type: 'page'
    },
    {
      id: 'newsletter',
      name: 'Newsletter',
      description: 'Subscribe to receive soft, story-driven updates from the den.',
      cost: 2000,
      unlocked: false,
      type: 'page'
    },
    {
      id: 'courage-minigame',
      name: 'Therapy: Courage',
      description: 'Unlock the Courage therapy – a practice of staying with discomfort.',
      cost: 300,
      unlocked: false,
      type: 'feature'
    },
    {
      id: 'connection-minigame',
      name: 'Therapy: Connection',
      description: 'Unlock the Connection therapy – a reminder that connection grows from small actions.',
      cost: 800,
      unlocked: false,
      type: 'feature'
    },
    {
      id: 'healing-minigame',
      name: 'Therapy: Healing',
      description: 'Unlock the Healing therapy – a playful way to notice your breath and reset your pace.',
      cost: 1500,
      unlocked: false,
      type: 'feature'
    },
    {
      id: 'true-heart',
      name: 'True Heart of the Den',
      description: 'This is the final treasure of the Kraken\'s Den. It doesn\'t unlock a new page, power-up, or helper. Instead, it unlocks a reminder: you were the treasure all along.',
      cost: 100000,
      unlocked: false,
      type: 'treasure'
    },
    {
      id: 'passive-collection-1',
      name: 'Gentle Currents – Passive Collection I',
      description: 'Increases passive collection by 10% of your current krakenlings per second. The den learns to work with you, not just for you.',
      cost: 1000,
      unlocked: false,
      type: 'upgrade',
      upgradeType: 'passive',
      multiplierValue: 0.1
    },
    {
      id: 'passive-collection-2',
      name: 'Flowing Tides – Passive Collection II',
      description: 'Increases passive collection by 25% of your current krakenlings per second. The ocean remembers your presence.',
      cost: 5000,
      unlocked: false,
      type: 'upgrade',
      upgradeType: 'passive',
      multiplierValue: 0.25,
      thresholdKps: 10
    },
    {
      id: 'passive-collection-3',
      name: 'Deep Resonance – Passive Collection III',
      description: 'Increases passive collection by 50% of your current krakenlings per second. The den echoes your journey.',
      cost: 20000,
      unlocked: false,
      type: 'upgrade',
      upgradeType: 'passive',
      multiplierValue: 0.5,
      thresholdKps: 50
    },
    {
      id: 'baby-multiplier-1',
      name: 'Baby Kraken Boost I',
      description: 'Doubles the collection rate of Baby Krakens. They grow stronger with your attention.',
      cost: 500,
      unlocked: false,
      type: 'upgrade',
      upgradeType: 'agent-multiplier',
      targetAgentId: 'baby-kraken',
      multiplierValue: 2.0,
      thresholdKps: 5
    },
    {
      id: 'young-multiplier-1',
      name: 'Young Kraken Boost I',
      description: 'Doubles the collection rate of Young Krakens. They learn from your patience.',
      cost: 2000,
      unlocked: false,
      type: 'upgrade',
      upgradeType: 'agent-multiplier',
      targetAgentId: 'young-kraken',
      multiplierValue: 2.0,
      thresholdKps: 20
    },
    {
      id: 'adult-multiplier-1',
      name: 'Adult Kraken Boost I',
      description: 'Doubles the collection rate of Adult Krakens. They channel deeper currents.',
      cost: 5000,
      unlocked: false,
      type: 'upgrade',
      upgradeType: 'agent-multiplier',
      targetAgentId: 'adult-kraken',
      multiplierValue: 2.0,
      thresholdKps: 50
    },
    {
      id: 'elder-multiplier-1',
      name: 'Elder Kraken Boost I',
      description: 'Doubles the collection rate of Elder Krakens. Ancient wisdom flows stronger.',
      cost: 15000,
      unlocked: false,
      type: 'upgrade',
      upgradeType: 'agent-multiplier',
      targetAgentId: 'elder-kraken',
      multiplierValue: 2.0,
      thresholdKps: 100
    },
    {
      id: 'guardian-multiplier-1',
      name: 'Guardian Kraken Boost I',
      description: 'Doubles the collection rate of Guardian Krakens. Protection becomes more powerful.',
      cost: 30000,
      unlocked: false,
      type: 'upgrade',
      upgradeType: 'agent-multiplier',
      targetAgentId: 'guardian-kraken',
      multiplierValue: 2.0,
      thresholdKps: 200
    },
    {
      id: 'tide-multiplier-1',
      name: 'Tide Master Boost I',
      description: 'Doubles the collection rate of Tide Masters. The rhythm becomes more profound.',
      cost: 60000,
      unlocked: false,
      type: 'upgrade',
      upgradeType: 'agent-multiplier',
      targetAgentId: 'tide-master',
      multiplierValue: 2.0,
      thresholdKps: 500
    },
    {
      id: 'den-multiplier-1',
      name: 'Den Keeper Boost I',
      description: 'Doubles the collection rate of Den Keepers. The abyss shares more of its secrets.',
      cost: 100000,
      unlocked: false,
      type: 'upgrade',
      upgradeType: 'agent-multiplier',
      targetAgentId: 'den-keeper',
      multiplierValue: 2.0,
      thresholdKps: 1000
    },
    {
      id: 'player-multiplier-1',
      name: 'Your Light Shines Brighter I',
      description: 'Doubles your own collection rate. You recognize your worth more deeply.',
      cost: 200000,
      unlocked: false,
      type: 'upgrade',
      upgradeType: 'agent-multiplier',
      targetAgentId: 'the-player',
      multiplierValue: 2.0,
      thresholdKps: 2000
    },
    {
      id: 'hope-cooldown-1',
      name: 'Hope: Quicker Return',
      description: 'Reduces Hope therapy cooldown by 25%. The light returns to you faster.',
      cost: 500,
      unlocked: false,
      type: 'upgrade',
      upgradeType: 'minigame-cooldown',
      targetMinigameId: 'hope',
      multiplierValue: 0.25,
      thresholdKps: 5
    },
    {
      id: 'courage-cooldown-1',
      name: 'Courage: Faster Recovery',
      description: 'Reduces Courage therapy cooldown by 25%. You can face discomfort more often.',
      cost: 1000,
      unlocked: false,
      type: 'upgrade',
      upgradeType: 'minigame-cooldown',
      targetMinigameId: 'courage',
      multiplierValue: 0.25,
      thresholdKps: 10
    },
    {
      id: 'connection-cooldown-1',
      name: 'Connection: Closer Bonds',
      description: 'Reduces Connection therapy cooldown by 25%. Reconnect with yourself sooner.',
      cost: 2000,
      unlocked: false,
      type: 'upgrade',
      upgradeType: 'minigame-cooldown',
      targetMinigameId: 'connection',
      multiplierValue: 0.25,
      thresholdKps: 20
    },
    {
      id: 'healing-cooldown-1',
      name: 'Healing: Quicker Breath',
      description: 'Reduces Healing therapy cooldown by 25%. Your breath returns to you faster.',
      cost: 3000,
      unlocked: false,
      type: 'upgrade',
      upgradeType: 'minigame-cooldown',
      targetMinigameId: 'healing',
      multiplierValue: 0.25,
      thresholdKps: 30
    }
  ]);

  useEffect(() => {
    // Load saved progress
    const savedMinigames = localStorage.getItem(MINIGAMES_STORAGE_KEY);
    const savedUnlockables = localStorage.getItem(UNLOCKABLES_STORAGE_KEY);
    const savedAgents = localStorage.getItem(AGENTS_STORAGE_KEY);
    
    if (savedMinigames) {
      try {
        const loaded = JSON.parse(savedMinigames);
        setMinigames(loaded.map((m: any) => {
          const baseMinigame = minigames.find(mg => mg.id === m.id);
          return {
            ...m,
            baseReward: m.baseReward || baseMinigame?.baseReward || 10,
            reward: m.reward || m.baseReward || baseMinigame?.baseReward || 10,
            timesCompleted: m.timesCompleted || 0,
            lastPlayed: m.lastPlayed || 0,
            baseCooldown: m.baseCooldown || baseMinigame?.baseCooldown || 30000,
            cooldown: m.cooldown || m.baseCooldown || baseMinigame?.baseCooldown || 30000,
            cooldownReduction: m.cooldownReduction || 0
          };
        }));
      } catch (e) {}
    }
    
    if (savedUnlockables) {
      try {
        setUnlockables(JSON.parse(savedUnlockables));
      } catch (e) {}
    }
    
    if (savedAgents) {
      try {
        const loadedAgents = JSON.parse(savedAgents);
        // Apply any unlocked agent multipliers from unlockables
        const savedUnlockables = localStorage.getItem(UNLOCKABLES_STORAGE_KEY);
        if (savedUnlockables) {
          try {
            const unlockables: Unlockable[] = JSON.parse(savedUnlockables);
            const agentMultiplierUpgrades = unlockables.filter(
              u => u.type === 'upgrade' && u.upgradeType === 'agent-multiplier' && u.unlocked && u.targetAgentId && u.multiplierValue !== undefined
            );
            
            // Apply multipliers to agents
            const agentsWithMultipliers = loadedAgents.map((agent: Agent) => {
              let finalMultiplier = agent.multiplier || 1.0;
              // Find all upgrades for this agent
              const upgradesForAgent = agentMultiplierUpgrades.filter(u => u.targetAgentId === agent.id);
              // Apply each upgrade (they should stack multiplicatively)
              upgradesForAgent.forEach(upgrade => {
                if (upgrade.multiplierValue) {
                  finalMultiplier = finalMultiplier * upgrade.multiplierValue;
                }
              });
              return { ...agent, multiplier: finalMultiplier };
            });
            setAgents(agentsWithMultipliers);
            // Save the updated agents with multipliers
            localStorage.setItem(AGENTS_STORAGE_KEY, JSON.stringify(agentsWithMultipliers));
          } catch (e) {
            // If there's an error applying multipliers, just use the loaded agents
            setAgents(loadedAgents);
          }
        } else {
          setAgents(loadedAgents);
        }
      } catch (e) {}
    }
  }, []);

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

  const handleMinigameComplete = (minigameId: string) => {
    const minigame = minigames.find(m => m.id === minigameId);
    if (!minigame) return;

    const now = Date.now();
    // Increase reward: baseReward * (1 + timesCompleted * 0.1) - increases by 10% each time
    const newTimesCompleted = minigame.timesCompleted + 1;
    const newReward = Math.floor(minigame.baseReward * (1 + newTimesCompleted * 0.1));
    
    const updatedMinigames = minigames.map(m => 
      m.id === minigameId ? { 
        ...m, 
        lastPlayed: now,
        timesCompleted: newTimesCompleted,
        reward: newReward
      } : m
    );
    
    setMinigames(updatedMinigames);
    localStorage.setItem(MINIGAMES_STORAGE_KEY, JSON.stringify(updatedMinigames));
    
    // Give krakenlings as reward
    // Get current fractional count from localStorage to maintain precision
    const currentFractional = parseFloat(localStorage.getItem('octopus-count') || '0');
    const newFractionalCount = currentFractional + newReward;
    const newCount = Math.floor(newFractionalCount);
    onOctopusChange(newCount);
    // Save fractional count to maintain precision
    localStorage.setItem('octopus-count', newFractionalCount.toString());
    
    setShowMinigame(null);
  };

  const handlePurchaseUnlockable = (unlockableId: string) => {
    const unlockable = unlockables.find(u => u.id === unlockableId);
    if (!unlockable || unlockable.unlocked || displayOctopusCount < unlockable.cost) return;

    // Get current fractional count from localStorage to maintain precision
    const currentFractional = parseFloat(localStorage.getItem('octopus-count') || '0');
    const newFractionalCount = currentFractional - unlockable.cost;
    const newCount = Math.floor(newFractionalCount);
    
    const updatedUnlockables = unlockables.map(u => 
      u.id === unlockableId ? { ...u, unlocked: true } : u
    );
    
    setUnlockables(updatedUnlockables);
    onOctopusChange(newCount);
    
    localStorage.setItem(UNLOCKABLES_STORAGE_KEY, JSON.stringify(updatedUnlockables));
    // Save fractional count to maintain precision
    localStorage.setItem('octopus-count', newFractionalCount.toString());
    
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
        localStorage.setItem(AGENTS_STORAGE_KEY, JSON.stringify(updatedAgents));
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
        localStorage.setItem(MINIGAMES_STORAGE_KEY, JSON.stringify(updatedMinigames));
      }
      // Passive upgrades are handled in useOctopuses hook
    }
    
    // Si es el tesoro final, mostrar mensaje especial
    if (unlockableId === 'true-heart') {
      alert(`You've reached the deepest part of the den.\n\nYou've collected Krakenlings, unlocked pages, and completed therapies – but none of that matters more than this:\n\nYou showed up. You played. You felt.\n\nThe Kraken's Den was never about finding something outside of you.\nIt was about noticing the courage, tenderness, and resilience you already carry.\n\nThank you for giving your emotions a place to breathe.`);
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
      if (emotionId) {
        const saved = localStorage.getItem(STORAGE_KEY);
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
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
        window.dispatchEvent(new CustomEvent('emotionUnlocked'));
      }
    }
    
    // If it's a minigame, unlock it
    if (unlockable.type === 'feature' && unlockable.id.includes('minigame')) {
      const emotionId = unlockable.id.split('-')[0];
      const updatedMinigames = minigames.map(m => 
        m.emotionId === emotionId ? { ...m, unlocked: true } : m
      );
      setMinigames(updatedMinigames);
      localStorage.setItem(MINIGAMES_STORAGE_KEY, JSON.stringify(updatedMinigames));
    }
  };

  const handlePurchaseAgent = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return;
    
    const currentCost = calculateAgentCost(agent);
    if (displayOctopusCount < currentCost) return;

    // Get current fractional count from localStorage to maintain precision
    const currentFractional = parseFloat(localStorage.getItem('octopus-count') || '0');
    const newFractionalCount = currentFractional - currentCost;
    const newCount = Math.floor(newFractionalCount);
    
    const updatedAgents = agents.map(a => 
      a.id === agentId ? { ...a, owned: a.owned + 1 } : a
    );
    
    setAgents(updatedAgents);
    onOctopusChange(newCount);
    
    localStorage.setItem(AGENTS_STORAGE_KEY, JSON.stringify(updatedAgents));
    // Save fractional count to maintain precision
    localStorage.setItem('octopus-count', newFractionalCount.toString());
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-90">
        <div className="relative bg-turquoise-800 rounded-2xl p-8 md:p-12 w-full max-w-5xl mx-4 border-2 border-turquoise-400 flex flex-col overflow-hidden" style={{ height: '85vh', minHeight: '85vh', maxHeight: '85vh' }}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-white text-3xl font-bold opacity-60 hover:opacity-100 transition-opacity w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-10"
          >
            ×
          </button>

          <div className="text-center mb-6 flex-shrink-0">
            <h2 className="font-lora text-4xl md:text-5xl font-bold text-turquoise-400 mb-4">
              The Kraken's Treasure
            </h2>
            <p className="text-gray-300 text-sm md:text-base text-center mb-4">
              A cozy corner where you trade your Krakenlings for tools, stories, and small shifts that make your emotional journey lighter.
            </p>
            <div className="flex flex-col items-center gap-2 min-w-0 w-full">
              <div className="flex items-center gap-3 text-2xl min-w-0 w-full justify-center">
                <RiEmotionLine className="text-turquoise-400 flex-shrink-0" />
                <span className="text-white font-bold truncate min-w-0">{formatNumber(Math.floor(displayOctopusCount))}</span>
                <span className="text-gray-200 flex-shrink-0">krakenlings</span>
              </div>
              {totalPulpitosPerSecond > 0 && (
                <div className="text-turquoise-300 text-sm whitespace-nowrap">
                  +{formatNumber(Math.floor(totalPulpitosPerSecond))} krakenlings/second
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-turquoise-400 flex-shrink-0">
            <button
              onClick={() => setActiveTab('minigames')}
              className={`px-6 py-3 font-lora text-xl font-bold transition-all relative ${
                activeTab === 'minigames'
                  ? 'text-turquoise-400'
                  : 'text-gray-300 hover:text-white'
              }`}
              style={{ borderBottom: '2px solid', borderBottomColor: activeTab === 'minigames' ? 'rgb(94 234 212)' : 'transparent' }}
            >
              <RiGamepadLine className="inline mr-2" />
              Therapies
            </button>
            <button
              onClick={() => setActiveTab('unlock-pages')}
              className={`px-6 py-3 font-lora text-xl font-bold transition-all relative ${
                activeTab === 'unlock-pages'
                  ? 'text-turquoise-400'
                  : 'text-gray-300 hover:text-white'
              }`}
              style={{ borderBottom: activeTab === 'unlock-pages' ? '2px solid rgb(94 234 212)' : '2px solid transparent', borderBottomColor: activeTab === 'unlock-pages' ? 'rgb(94 234 212)' : 'transparent' }}
            >
              <RiShoppingBagLine className="inline mr-2" />
              Treasures
            </button>
            <button
              onClick={() => setActiveTab('agents')}
              className={`px-6 py-3 font-lora text-xl font-bold transition-all relative ${
                activeTab === 'agents'
                  ? 'text-turquoise-400'
                  : 'text-gray-300 hover:text-white'
              }`}
              style={{ borderBottom: activeTab === 'agents' ? '2px solid rgb(94 234 212)' : '2px solid transparent', borderBottomColor: activeTab === 'agents' ? 'rgb(94 234 212)' : 'transparent' }}
            >
              <RiEmotionLine className="inline mr-2" />
              Helpers
            </button>
          </div>

          {/* Contenido scrolleable */}
          <div className="flex-1 overflow-y-scroll min-h-0 scrollbar-gutter-stable" style={{ minHeight: 0, maxHeight: '100%', contain: 'layout style paint' }}>
          {activeTab === 'minigames' && (
            <div className="pb-2" style={{ minHeight: '100%' }}>
              <p className="text-gray-300 text-sm mb-4 px-2">
                Short, replayable experiences inspired by hope, courage, connection, and healing.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {minigames.map((minigame) => {
                const canPlay = canPlayMinigame(minigame);
                const cooldownRemaining = getCooldownRemaining(minigame);
                const cooldownSeconds = Math.ceil(cooldownRemaining / 1000);

                return (
                  <div
                    key={minigame.id}
                    className={`relative p-6 rounded-xl border-2 transition-all ${
                      minigame.unlocked
                        ? canPlay
                          ? 'bg-turquoise-800 border-turquoise-400 hover:border-turquoise-300 cursor-pointer'
                          : 'bg-gray-800 border-gray-600 opacity-70'
                        : 'bg-transparent border-transparent'
                    }`}
                    onClick={() => {
                      if (minigame.unlocked && canPlay) {
                        setShowMinigame(minigame.id);
                      }
                    }}
                  >
                    {minigame.unlocked ? (
                      <>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-lora text-xl font-bold text-white flex items-center gap-2">
                        {minigame.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <RiEmotionLine className="text-turquoise-400" />
                        <span className="text-white font-bold">+{minigame.reward}</span>
                        {minigame.timesCompleted > 0 && (
                          <span className="text-gray-400 text-xs">({minigame.timesCompleted}x)</span>
                        )}
                      </div>
                    </div>

                        <p className="text-gray-200 text-sm mb-4">{minigame.description}</p>

                        {canPlay && (
                          <div className="text-center">
                            <Button label="PLAY" />
                          </div>
                        )}
                        
                        {!canPlay && (
                          <div className="text-center">
                            <p className="text-gray-300 text-sm mb-2">
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
                      if (!unlockable) return null;
                      
                      const canAfford = displayOctopusCount >= unlockable.cost;
                      return (
                        <div className="flex items-center justify-center">
                          <div className="bg-gray-800 bg-opacity-90 rounded-xl p-4 border-2 border-gray-600 flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <RiEmotionLine className="text-turquoise-400" />
                              <span className="text-white font-bold">{unlockable.cost}</span>
                            </div>
                            <button
                              disabled={!canAfford}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (canAfford) {
                                  handlePurchaseUnlockable(unlockable.id);
                                }
                              }}
                              className={`relative w-56 py-4 px-6 border-none select-none flex items-center justify-center h-fit outline-none rounded-2xl transition-all ${
                                canAfford
                                  ? 'bg-turquoise-400 hover:bg-turquoise-300 cursor-pointer'
                                  : 'bg-gray-600 opacity-40 pointer-events-none cursor-not-allowed'
                              }`}
                            >
                              <p className="whitespace-nowrap text-xl font-lora font-bold text-black">UNLOCK</p>
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

          {/* Contenido de Tesoros */}
          {activeTab === 'unlock-pages' && (
            <div className="pb-2" style={{ minHeight: '100%' }}>
              <p className="text-gray-300 text-sm mb-4 px-2">
                Upgrades that reveal more of the den: new pages, hidden details, and gentle surprises.
              </p>
              <div className="space-y-2">
                {unlockables.filter(u => {
                  // Exclude unlocked items (they disappear when purchased)
                  if (u.unlocked) return false;
                  // Filter normal pages, treasures, and upgrades
                  if (u.type !== 'page' && u.type !== 'treasure' && u.type !== 'upgrade') return false;
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
                  // Upgrades only appear when threshold is met
                  if (u.type === 'upgrade' && u.thresholdKps !== undefined) {
                    return totalPulpitosPerSecond >= u.thresholdKps;
                  }
                  return true;
                }).sort((a, b) => a.cost - b.cost).map((unlockable) => (
                  <div
                    key={unlockable.id}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                      unlockable.unlocked
                        ? 'bg-turquoise-400 bg-opacity-20 border-turquoise-400'
                        : displayOctopusCount >= unlockable.cost
                        ? 'bg-turquoise-800 border-turquoise-400 hover:border-turquoise-300'
                        : 'bg-gray-800 border-gray-600 opacity-60'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      {unlockable.unlocked ? (
                        <div className="flex items-center gap-2">
                          <span className="text-green-400 text-lg">✓</span>
                          <div>
                            <h3 className="font-lora text-lg font-bold text-white">{unlockable.name}</h3>
                            <p className="text-gray-200 text-xs mt-1">{unlockable.description}</p>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h3 className="font-lora text-lg font-bold text-white">{unlockable.name}</h3>
                          <p className="text-white opacity-70 text-xs mt-1">{unlockable.description}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 ml-4">
                      {unlockable.unlocked ? (
                        unlockable.route ? (
                          <Link href={unlockable.route} onClick={() => onClose()}>
                            <Button label="GO" />
                          </Link>
                        ) : (
                          <span className="text-green-400 text-sm font-bold">UNLOCKED</span>
                        )
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <RiEmotionLine className="text-turquoise-400" />
                            <span className="text-white font-bold">{unlockable.cost}</span>
                          </div>
                          {(() => {
                            const canAfford = displayOctopusCount >= unlockable.cost;
                            return (
                              <button
                                disabled={!canAfford}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (canAfford) {
                                    handlePurchaseUnlockable(unlockable.id);
                                  }
                                }}
                                className={`relative w-56 py-4 px-6 border-none select-none flex items-center justify-center h-fit outline-none rounded-2xl transition-all ${
                                  canAfford
                                    ? 'bg-turquoise-400 hover:bg-turquoise-300 cursor-pointer'
                                    : 'bg-gray-600 opacity-40 pointer-events-none cursor-not-allowed'
                                }`}
                              >
                                <p className="whitespace-nowrap text-xl font-lora font-bold text-black">GET</p>
                              </button>
                            );
                          })()}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}


          {/* Contenido de Ayudantes */}
          {activeTab === 'agents' && (
            <div className="pb-2" style={{ minHeight: '100%' }}>
              <div className="space-y-2">
                {agents.filter(agent => {
                  // First agent (baby-kraken) has no requirement
                  if (!agent.unlockRequirement) return true;
                  // Check if the required agent is owned
                  const requiredAgent = agents.find(a => a.id === agent.unlockRequirement);
                  return requiredAgent ? requiredAgent.owned > 0 : false;
                }).map((agent) => (
                  <div
                    key={agent.id}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                      displayOctopusCount >= calculateAgentCost(agent)
                        ? 'bg-turquoise-800 border-turquoise-400 hover:border-turquoise-300'
                        : 'bg-gray-800 border-gray-600 opacity-60'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-lora text-lg font-bold text-white">{agent.name}</h3>
                        {agent.owned > 0 && (
                          <span className="text-green-400 text-xs font-bold">
                            (x{agent.owned})
                          </span>
                        )}
                        {agent.multiplier > 1.0 && (
                          <span className="text-yellow-400 text-xs font-bold">
                            ({agent.multiplier.toFixed(1)}x)
                          </span>
                        )}
                      </div>
                      <p className="text-gray-200 text-xs mt-1">{agent.description}</p>
                      {agent.owned > 0 && (
                        <p className="text-turquoise-400 text-xs mt-1">
                          Collecting: {formatNumber(Math.floor(agent.owned * agent.collectionRate * agent.multiplier))} krakenlings/second
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 ml-4">
                      <div className="flex items-center gap-2">
                        <RiEmotionLine className="text-turquoise-400" />
                        <span className="text-white font-bold">{calculateAgentCost(agent)}</span>
                      </div>
                      {(() => {
                        const canAfford = displayOctopusCount >= calculateAgentCost(agent);
                        return (
                          <button
                            disabled={!canAfford}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (canAfford) {
                                handlePurchaseAgent(agent.id);
                              }
                            }}
                            className={`relative w-56 py-4 px-6 border-none select-none flex items-center justify-center h-fit outline-none rounded-2xl transition-all ${
                              canAfford
                                ? 'bg-turquoise-400 hover:bg-turquoise-300 cursor-pointer'
                                : 'bg-gray-100 opacity-40 pointer-events-none cursor-not-allowed'
                            }`}
                          >
                            <p className="whitespace-nowrap text-xl font-lora font-bold text-black">GET</p>
                          </button>
                        );
                      })()}
                    </div>
                  </div>
                ))}
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

