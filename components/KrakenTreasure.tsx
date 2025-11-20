'use client';

import { useState, useEffect } from 'react';
import Button from './Button';
import { RiLockLine, RiEmotionLine, RiGamepadLine, RiShoppingBagLine } from 'react-icons/ri';
import { formatNumber } from '@/utils/formatNumber';
import HopeMinigame from './Minigames/HopeMinigame';
import CourageMinigame from './Minigames/CourageMinigame';
import ConnectionMinigame from './Minigames/ConnectionMinigame';
import HealingMinigame from './Minigames/HealingMinigame';
import FloatingText from './FloatingText';
import { Route } from '@/shared/Route';
import Link from 'next/link';
import { useAudio } from '@/hooks/useAudio';

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
  rewardMultiplier: number; // Multiplier for rewards (starts at 1.0)
}

interface Unlockable {
  id: string;
  name: string;
  description: string;
  cost: number;
  unlocked: boolean;
  route?: string;
  type: 'page' | 'feature' | 'treasure' | 'upgrade';
  upgradeType?: 'passive' | 'agent-multiplier' | 'minigame-cooldown' | 'minigame-reward-multiplier' | 'audio' | 'collection-multiplier'; // Para mejoras
  targetAgentId?: string; // Para multiplicadores de agentes específicos
  targetMinigameId?: string; // Para mejoras de minijuegos específicos
  multiplierValue?: number; // Valor del multiplicador (para agentes y otros)
  multiplierManualValue?: number; // Multiplicador para recolección manual
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
  const { playButtonClick } = useAudio();
  const [activeTab, setActiveTab] = useState<'helpers' | 'treasures' | 'upgrades' | 'therapies'>('helpers');
  const [displayOctopusCount, setDisplayOctopusCount] = useState(collectedOctopuses);
  const [showMinigame, setShowMinigame] = useState<string | null>(null);
  const [totalPulpitosPerSecond, setTotalPulpitosPerSecond] = useState(0);
  const [floatingTexts, setFloatingTexts] = useState<Array<{ id: string; value: number; x: number; y: number }>>([]);
  const [minigames, setMinigames] = useState<Minigame[]>([
    {
      id: 'hope',
      name: 'Hope – Follow the Light',
      description: 'Follow the light. Focus on one step at a time.',
      emotionId: 'hope',
      baseReward: 10,
      reward: 10,
      unlocked: true,
      completed: false,
      timesCompleted: 0,
      lastPlayed: 0,
      baseCooldown: 30000, // 30 segundos
      cooldown: 30000,
      cooldownReduction: 0,
      rewardMultiplier: 1.0
    },
    {
      id: 'courage',
      name: 'Courage – Hold the Pressure',
      description: 'Hold the button. Stay with discomfort a little longer.',
      emotionId: 'courage',
      baseReward: 15,
      reward: 15,
      unlocked: false,
      completed: false,
      timesCompleted: 0,
      lastPlayed: 0,
      baseCooldown: 45000, // 45 segundos
      cooldown: 45000,
      cooldownReduction: 0,
      rewardMultiplier: 1.0
    },
    {
      id: 'connection',
      name: 'Connection – Connect the Dots',
      description: 'Connect the letters. Build the word.',
      emotionId: 'connection',
      baseReward: 20,
      reward: 20,
      unlocked: false,
      completed: false,
      timesCompleted: 0,
      lastPlayed: 0,
      baseCooldown: 60000, // 60 segundos
      cooldown: 60000,
      cooldownReduction: 0,
      rewardMultiplier: 1.0
    },
    {
      id: 'healing',
      name: 'Healing – Breathing Rhythm',
      description: 'Tap with the rhythm. Notice your breath.',
      emotionId: 'healing',
      baseReward: 25,
      reward: 25,
      unlocked: false,
      completed: false,
      timesCompleted: 0,
      lastPlayed: 0,
      baseCooldown: 75000, // 75 segundos
      cooldown: 75000,
      cooldownReduction: 0,
      rewardMultiplier: 1.0
    }
  ]);

  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 'baby-kraken',
      name: 'Baby Kraken – Tiny Scout',
      description: 'Collects 1 Krakenling per second.',
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
      description: 'Collects 5 Krakenlings per second.',
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
      description: 'Collects 20 Krakenlings per second.',
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
      description: 'Collects 50 Krakenlings per second.',
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
      description: 'Collects 100 Krakenlings per second.',
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
      description: 'Collects 200 Krakenlings per second.',
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
      description: 'Collects 500 Krakenlings per second.',
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
      description: 'Collects 1000 Krakenlings per second. You are the treasure.',
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
    if (typeof window === 'undefined') return;
    
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
      description: 'Unlock the main page. More Krakenlings appear here.',
      cost: 200,
      unlocked: false,
      route: Route.HOME,
      type: 'page'
    },
    {
      id: 'games',
      name: 'Games Page – "The Echo of Play"',
      description: 'Unlock the games page. More Krakenlings appear here.',
      cost: 500,
      unlocked: false,
      route: Route.HEART_WEAVER,
      type: 'page'
    },
    {
      id: 'team',
      name: 'About Us – "Faces Behind the Tentacles"',
      description: 'Unlock the team page. More Krakenlings appear here.',
      cost: 1000,
      unlocked: false,
      route: Route.TEAM,
      type: 'page'
    },
    {
      id: 'contact',
      name: 'Contact & Newsletter – "Message in a Bottle"',
      description: 'Unlock contact. More Krakenlings appear.',
      cost: 2000,
      unlocked: false,
      route: Route.HOME,
      type: 'page'
    },
    {
      id: 'newsletter',
      name: 'Newsletter',
      description: 'Unlock newsletter. More Krakenlings appear.',
      cost: 2000,
      unlocked: false,
      type: 'page'
    },
    {
      id: 'courage-minigame',
      name: 'Therapy: Courage',
      description: 'Unlock Courage therapy.',
      cost: 300,
      unlocked: false,
      type: 'feature'
    },
    {
      id: 'connection-minigame',
      name: 'Therapy: Connection',
      description: 'Unlock Connection therapy.',
      cost: 800,
      unlocked: false,
      type: 'feature'
    },
    {
      id: 'healing-minigame',
      name: 'Therapy: Healing',
      description: 'Unlock Healing therapy.',
      cost: 1500,
      unlocked: false,
      type: 'feature'
    },
    {
      id: 'true-heart',
      name: 'True Heart of the Den',
      description: 'The final treasure. You were the treasure all along.',
      cost: 100000,
      unlocked: false,
      type: 'treasure'
    },
    {
      id: 'passive-collection-1',
      name: 'Gentle Currents – Passive Collection I',
      description: '+10% passive collection rate.',
      cost: 1000,
      unlocked: false,
      type: 'upgrade',
      upgradeType: 'passive',
      multiplierValue: 0.1
    },
    {
      id: 'passive-collection-2',
      name: 'Flowing Tides – Passive Collection II',
      description: '+25% passive collection rate.',
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
      description: '+50% passive collection rate.',
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
      description: 'Doubles Baby Kraken collection rate.',
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
      description: 'Doubles Young Kraken collection rate.',
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
      description: 'Doubles Adult Kraken collection rate.',
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
      description: 'Doubles Elder Kraken collection rate.',
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
      description: 'Doubles Guardian Kraken collection rate.',
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
      description: 'Doubles Tide Master collection rate.',
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
      description: 'Doubles Den Keeper collection rate.',
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
      description: 'Doubles your collection rate.',
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
      description: '-25% Hope therapy cooldown.',
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
      description: '-25% Courage therapy cooldown.',
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
      description: '-25% Connection therapy cooldown.',
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
      description: '-25% Healing therapy cooldown.',
      cost: 3000,
      unlocked: false,
      type: 'upgrade',
      upgradeType: 'minigame-cooldown',
      targetMinigameId: 'healing',
      multiplierValue: 0.25,
      thresholdKps: 30
    },
    // Minigame reward multipliers - to keep minigames relevant as KPS increases
    {
      id: 'hope-reward-1',
      name: 'Hope: Brighter Rewards',
      description: '2x Hope therapy rewards.',
      cost: 1000,
      unlocked: false,
      type: 'upgrade',
      upgradeType: 'minigame-reward-multiplier',
      targetMinigameId: 'hope',
      multiplierValue: 2.0,
      thresholdKps: 50
    },
    {
      id: 'hope-reward-2',
      name: 'Hope: Radiant Bounty',
      description: '3x Hope therapy rewards.',
      cost: 5000,
      unlocked: false,
      type: 'upgrade',
      upgradeType: 'minigame-reward-multiplier',
      targetMinigameId: 'hope',
      multiplierValue: 3.0,
      thresholdKps: 200
    },
    {
      id: 'courage-reward-1',
      name: 'Courage: Stronger Rewards',
      description: '2x Courage therapy rewards.',
      cost: 1500,
      unlocked: false,
      type: 'upgrade',
      upgradeType: 'minigame-reward-multiplier',
      targetMinigameId: 'courage',
      multiplierValue: 2.0,
      thresholdKps: 75
    },
    {
      id: 'courage-reward-2',
      name: 'Courage: Valiant Returns',
      description: '3x Courage therapy rewards.',
      cost: 7500,
      unlocked: false,
      type: 'upgrade',
      upgradeType: 'minigame-reward-multiplier',
      targetMinigameId: 'courage',
      multiplierValue: 3.0,
      thresholdKps: 300
    },
    {
      id: 'connection-reward-1',
      name: 'Connection: Deeper Bonds',
      description: '2x Connection therapy rewards.',
      cost: 2000,
      unlocked: false,
      type: 'upgrade',
      upgradeType: 'minigame-reward-multiplier',
      targetMinigameId: 'connection',
      multiplierValue: 2.0,
      thresholdKps: 100
    },
    {
      id: 'connection-reward-2',
      name: 'Connection: Sacred Links',
      description: '3x Connection therapy rewards.',
      cost: 10000,
      unlocked: false,
      type: 'upgrade',
      upgradeType: 'minigame-reward-multiplier',
      targetMinigameId: 'connection',
      multiplierValue: 3.0,
      thresholdKps: 400
    },
    {
      id: 'healing-reward-1',
      name: 'Healing: Gentler Returns',
      description: '2x Healing therapy rewards.',
      cost: 2500,
      unlocked: false,
      type: 'upgrade',
      upgradeType: 'minigame-reward-multiplier',
      targetMinigameId: 'healing',
      multiplierValue: 2.0,
      thresholdKps: 125
    },
    {
      id: 'healing-reward-2',
      name: 'Healing: Profound Restoration',
      description: '3x Healing therapy rewards.',
      cost: 12500,
      unlocked: false,
      type: 'upgrade',
      upgradeType: 'minigame-reward-multiplier',
      targetMinigameId: 'healing',
      multiplierValue: 3.0,
      thresholdKps: 500
    },
    // Global minigame reward multipliers
    {
      id: 'all-therapies-reward-1',
      name: 'Therapies: Universal Boost',
      description: '+50% all therapy rewards.',
      cost: 10000,
      unlocked: false,
      type: 'upgrade',
      upgradeType: 'minigame-reward-multiplier',
      targetMinigameId: 'all',
      multiplierValue: 1.5,
      thresholdKps: 500
    },
    {
      id: 'all-therapies-reward-2',
      name: 'Therapies: Cosmic Amplification',
      description: '2x all therapy rewards.',
      cost: 50000,
      unlocked: false,
      type: 'upgrade',
      upgradeType: 'minigame-reward-multiplier',
      targetMinigameId: 'all',
      multiplierValue: 2.0,
      thresholdKps: 2000
    },
    // Audio upgrades
    {
      id: 'sound-button-click',
      name: 'Sound Effects: Clicks & Collects',
      description: 'Unlock button and collection sounds.',
      cost: 50,
      unlocked: false,
      type: 'upgrade',
      upgradeType: 'audio'
    },
    {
      id: 'sound-minigame-hope',
      name: 'Sound Effects: Hope Therapy',
      description: 'Unlock Hope therapy sounds.',
      cost: 500,
      unlocked: false,
      type: 'upgrade',
      upgradeType: 'audio'
    },
    {
      id: 'sound-minigame-courage',
      name: 'Sound Effects: Courage Therapy',
      description: 'Unlock Courage therapy sounds.',
      cost: 5000,
      unlocked: false,
      type: 'upgrade',
      upgradeType: 'audio'
    },
    {
      id: 'sound-minigame-connection',
      name: 'Sound Effects: Connection Therapy',
      description: 'Unlock Connection therapy sounds.',
      cost: 10000,
      unlocked: false,
      type: 'upgrade',
      upgradeType: 'audio'
    },
    {
      id: 'sound-minigame-healing',
      name: 'Sound Effects: Healing Therapy',
      description: 'Unlock Healing therapy sounds.',
      cost: 20000,
      unlocked: false,
      type: 'upgrade',
      upgradeType: 'audio'
    },
    {
      id: 'sound-music',
      name: 'Background Music',
      description: 'Unlock background music.',
      cost: 1000,
      unlocked: false,
      type: 'upgrade',
      upgradeType: 'audio'
    },
    // Collection multiplier upgrades
    {
      id: 'collect-multiplier-1',
      name: 'Collection Boost I',
      description: '1x manual collection multiplier.',
      cost: 100,
      unlocked: false,
      type: 'upgrade',
      upgradeType: 'collection-multiplier',
      multiplierManualValue: 1
    },
    {
      id: 'collect-multiplier-10',
      name: 'Collection Boost II',
      description: '10x manual collection multiplier.',
      cost: 1000,
      unlocked: false,
      type: 'upgrade',
      upgradeType: 'collection-multiplier',
      multiplierManualValue: 10
    },
    {
      id: 'collect-multiplier-100',
      name: 'Collection Boost III',
      description: '100x manual collection multiplier.',
      cost: 10000,
      unlocked: false,
      type: 'upgrade',
      upgradeType: 'collection-multiplier',
      multiplierManualValue: 100
    }
  ]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Load saved progress
    const savedMinigames = localStorage.getItem(MINIGAMES_STORAGE_KEY);
    const savedUnlockables = localStorage.getItem(UNLOCKABLES_STORAGE_KEY);
    const savedAgents = localStorage.getItem(AGENTS_STORAGE_KEY);
    
    if (savedMinigames) {
      try {
        const loaded = JSON.parse(savedMinigames);
        // Load unlockables to apply reward multipliers
        const savedUnlockables = localStorage.getItem(UNLOCKABLES_STORAGE_KEY);
        let rewardMultiplierUpgrades: Unlockable[] = [];
        if (savedUnlockables) {
          try {
            const allUnlockables: Unlockable[] = JSON.parse(savedUnlockables);
            rewardMultiplierUpgrades = allUnlockables.filter(
              u => u.type === 'upgrade' && 
                   u.upgradeType === 'minigame-reward-multiplier' && 
                   u.unlocked && 
                   u.targetMinigameId && 
                   u.multiplierValue !== undefined
            );
          } catch (e) {}
        }
        
        setMinigames(loaded.map((m: any) => {
          const baseMinigame = minigames.find(mg => mg.id === m.id);
          // Calculate reward multiplier from upgrades
          let calculatedMultiplier = 1.0;
          rewardMultiplierUpgrades.forEach(upgrade => {
            if (upgrade.targetMinigameId === 'all' || upgrade.targetMinigameId === m.id) {
              calculatedMultiplier *= (upgrade.multiplierValue || 1.0);
            }
          });
          
          const finalMultiplier = m.rewardMultiplier || calculatedMultiplier;
          // Recalculate reward with multiplier
          const timesCompleted = m.timesCompleted || 0;
          const baseReward = m.baseReward || baseMinigame?.baseReward || 10;
          const calculatedReward = Math.floor(baseReward * (timesCompleted + 1) * finalMultiplier);
          
          return {
            ...m,
            baseReward: baseReward,
            reward: m.reward || calculatedReward,
            timesCompleted: timesCompleted,
            lastPlayed: m.lastPlayed || 0,
            baseCooldown: m.baseCooldown || baseMinigame?.baseCooldown || 30000,
            cooldown: m.cooldown || m.baseCooldown || baseMinigame?.baseCooldown || 30000,
            cooldownReduction: m.cooldownReduction || 0,
            rewardMultiplier: finalMultiplier
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
      localStorage.setItem(MINIGAMES_STORAGE_KEY, JSON.stringify(updatedMinigames));
      
      // Show floating text for reward
      setFloatingTexts(prev => [...prev, {
        id: `floating-minigame-${minigameId}-${Date.now()}`,
        value: newReward,
        x: 50, // Center of screen
        y: 50
      }]);
      
      // Give krakenlings as reward
      // Get current fractional count from localStorage to maintain precision
      const currentFractional = parseFloat(localStorage.getItem('octopus-count') || '0');
      const newFractionalCount = currentFractional + newReward;
      const newCount = Math.floor(newFractionalCount);
      onOctopusChange(newCount);
      // Save fractional count to maintain precision
      localStorage.setItem('octopus-count', newFractionalCount.toString());
    }
    
    setShowMinigame(null);
  };

  const removeFloatingText = (id: string) => {
    setFloatingTexts(prev => prev.filter(t => t.id !== id));
  };

  const handlePurchaseUnlockable = (unlockableId: string) => {
    if (typeof window === 'undefined') return;
    
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
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(UNLOCKABLES_STORAGE_KEY, JSON.stringify(updatedUnlockables));
      // Save fractional count to maintain precision
      localStorage.setItem('octopus-count', newFractionalCount.toString());
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
          localStorage.setItem(AGENTS_STORAGE_KEY, JSON.stringify(updatedAgents));
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
          localStorage.setItem(MINIGAMES_STORAGE_KEY, JSON.stringify(updatedMinigames));
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
          localStorage.setItem(MINIGAMES_STORAGE_KEY, JSON.stringify(updatedMinigames));
        }
      } else if (unlockable.upgradeType === 'audio') {
        // Audio upgrades don't need special handling, just dispatch event to update audio settings
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('unlockableChanged'));
        }
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
      if (emotionId && typeof window !== 'undefined') {
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
      if (typeof window !== 'undefined') {
        localStorage.setItem(MINIGAMES_STORAGE_KEY, JSON.stringify(updatedMinigames));
      }
    }
  };

  const handlePurchaseAgent = (agentId: string) => {
    if (typeof window === 'undefined') return;
    
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
      
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-90">
        <div className="relative bg-turquoise-800 rounded-2xl p-8 md:p-12 w-full max-w-5xl mx-4 border-2 border-turquoise-400 flex flex-col overflow-hidden" style={{ height: '85vh', minHeight: '85vh', maxHeight: '85vh' }}>
          <button
            onClick={() => {
              playButtonClick();
              onClose();
            }}
            className="absolute top-4 right-4 z-10 text-white text-3xl font-bold opacity-60 hover:opacity-100 transition-opacity w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-10"
          >
            ×
          </button>

          <div className="text-center mb-6 flex-shrink-0">
            <h2 className="font-lora text-4xl md:text-5xl font-bold text-turquoise-400 mb-4">
              The Kraken's Treasure
            </h2>
            <p className="text-gray-300 text-sm md:text-base text-center mb-4">
              Trade Krakenlings for helpers, treasures, and therapies.
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
              onClick={() => {
                playButtonClick();
                setActiveTab('helpers');
              }}
              className={`px-6 py-3 font-lora text-xl font-bold transition-all relative ${
                activeTab === 'helpers'
                  ? 'text-turquoise-400'
                  : 'text-gray-300 hover:text-white'
              }`}
              style={{ borderBottom: '2px solid', borderBottomColor: activeTab === 'helpers' ? 'rgb(94 234 212)' : 'transparent' }}
            >
              <RiEmotionLine className="inline mr-2" />
              Helpers
            </button>
            <button
              onClick={() => {
                playButtonClick();
                setActiveTab('treasures');
              }}
              className={`px-6 py-3 font-lora text-xl font-bold transition-all relative ${
                activeTab === 'treasures'
                  ? 'text-turquoise-400'
                  : 'text-gray-300 hover:text-white'
              }`}
              style={{ borderBottom: activeTab === 'treasures' ? '2px solid rgb(94 234 212)' : '2px solid transparent', borderBottomColor: activeTab === 'treasures' ? 'rgb(94 234 212)' : 'transparent' }}
            >
              <RiShoppingBagLine className="inline mr-2" />
              Treasures
            </button>
            <button
              onClick={() => {
                playButtonClick();
                setActiveTab('upgrades');
              }}
              className={`px-6 py-3 font-lora text-xl font-bold transition-all relative ${
                activeTab === 'upgrades'
                  ? 'text-turquoise-400'
                  : 'text-gray-300 hover:text-white'
              }`}
              style={{ borderBottom: activeTab === 'upgrades' ? '2px solid rgb(94 234 212)' : '2px solid transparent', borderBottomColor: activeTab === 'upgrades' ? 'rgb(94 234 212)' : 'transparent' }}
            >
              <RiLockLine className="inline mr-2" />
              Upgrades
            </button>
            <button
              onClick={() => {
                playButtonClick();
                setActiveTab('therapies');
              }}
              className={`px-6 py-3 font-lora text-xl font-bold transition-all relative ${
                activeTab === 'therapies'
                  ? 'text-turquoise-400'
                  : 'text-gray-300 hover:text-white'
              }`}
              style={{ borderBottom: activeTab === 'therapies' ? '2px solid rgb(94 234 212)' : '2px solid transparent', borderBottomColor: activeTab === 'therapies' ? 'rgb(94 234 212)' : 'transparent' }}
            >
              <RiGamepadLine className="inline mr-2" />
              Therapies
            </button>
          </div>

          {/* Contenido scrolleable */}
          <div className="flex-1 overflow-y-scroll min-h-0 scrollbar-gutter-stable" style={{ minHeight: 0, maxHeight: '100%', contain: 'layout style paint' }}>
          {/* Helpers Section */}
          {activeTab === 'helpers' && (
            <div className="pb-2" style={{ minHeight: '100%' }}>
              <p className="text-gray-300 text-sm mb-4 px-2">
                Hire helpers that automatically collect Krakenlings for you. The more you have, the more they gather.
              </p>
              <div className="space-y-2">
                {agents.map((agent) => {
                  const currentCost = calculateAgentCost(agent);
                  const canAfford = displayOctopusCount >= currentCost;
                  
                  // Only show if previous agent is owned (except for first agent)
                  const agentIndex = agents.findIndex(a => a.id === agent.id);
                  const shouldShow = agentIndex === 0 || (agentIndex > 0 && agents[agentIndex - 1].owned > 0);

                  if (!shouldShow) return null;

                  return (
                    <div
                      key={agent.id}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                        canAfford
                          ? 'bg-turquoise-800 border-turquoise-400 hover:border-turquoise-300'
                          : 'bg-gray-800 border-gray-600 opacity-60'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-lora text-lg font-bold text-white">{agent.name}</h3>
                        <p className="text-white opacity-70 text-xs mt-1">{agent.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-2">
                            <RiEmotionLine className="text-turquoise-400" />
                            <span className="text-white text-sm">+{agent.collectionRate * (agent.multiplier || 1.0)}/s</span>
                          </div>
                          {agent.owned > 0 && (
                            <span className="text-gray-400 text-xs">Owned: {agent.owned}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 ml-4">
                        <div className="flex items-center gap-2">
                          <RiEmotionLine className="text-turquoise-400" />
                          <span className="text-white font-bold">{formatNumber(currentCost)}</span>
                        </div>
                        <button
                          disabled={!canAfford}
                          onClick={() => {
                            playButtonClick();
                            handlePurchaseAgent(agent.id);
                          }}
                          className={`relative w-56 py-4 px-6 border-none select-none flex items-center justify-center h-fit outline-none rounded-2xl transition-all ${
                            canAfford
                              ? 'bg-turquoise-400 hover:bg-turquoise-300 cursor-pointer'
                              : 'bg-gray-600 opacity-40 pointer-events-none cursor-not-allowed'
                          }`}
                        >
                          <p className="whitespace-nowrap text-xl font-lora font-bold text-black">GET</p>
                        </button>
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
              <p className="text-gray-300 text-sm mb-4 px-2">
                Unlock new pages and special treasures that reveal more of the den.
              </p>
              <div className="space-y-2">
                {unlockables.filter(u => {
                  // Only show treasures and pages
                  if (u.type !== 'treasure' && u.type !== 'page') return false;
                  // Exclude unlocked items (they disappear when purchased)
                  if (u.unlocked) return false;
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
                                  playButtonClick();
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

          {/* Upgrades Section */}
          {activeTab === 'upgrades' && (
            <div className="pb-2" style={{ minHeight: '100%' }}>
              <p className="text-gray-300 text-sm mb-4 px-2">
                Enhance your helpers and therapies with powerful upgrades.
              </p>
              <div className="space-y-2">
                {unlockables.filter(u => {
                  // Only show upgrades
                  if (u.type !== 'upgrade') return false;
                  // Exclude unlocked items (they disappear when purchased)
                  if (u.unlocked) return false;
                  // Upgrades only appear when threshold is met
                  if (u.thresholdKps !== undefined) {
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
                        <span className="text-green-400 text-sm font-bold">UNLOCKED</span>
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
                                  playButtonClick();
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

          {/* Therapies Section */}
          {activeTab === 'therapies' && (
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
                        playButtonClick();
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
                                playButtonClick();
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

