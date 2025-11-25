import { Route } from './Route';

export type MissionType =
  | 'visit-page'
  | 'complete-therapy'
  | 'collect-krakenlings'
  | 'purchase-item'
  | 'reach-krakenlings'
  | 'reach-kps'
  | 'helpers-owned'
  | 'mission-completed';

export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  collectionRate: number;
  collectionInterval: number;
  costMultiplier: number;
  unlockRequirement?: string;
  missionRequirement?: string;
}

export interface AgentState extends AgentTemplate {
  owned: number;
  multiplier: number;
}

export interface AgentProgress {
  id: string;
  owned?: number;
  multiplier?: number;
}

export interface UnlockableTemplate {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'page' | 'feature' | 'treasure' | 'upgrade';
  route?: string;
  upgradeType?:
    | 'passive'
    | 'agent-multiplier'
    | 'minigame-cooldown'
    | 'minigame-reward-multiplier'
    | 'audio'
    | 'collection-multiplier';
  targetAgentId?: string;
  targetMinigameId?: string;
  multiplierValue?: number;
  manualCollectionValue?: number;
  manualCollectionPercentOfKps?: number;
  missionRequirement?: string;
}

export interface UnlockableState extends UnlockableTemplate {
  unlocked: boolean;
}

export interface UnlockableProgress {
  id: string;
  unlocked?: boolean;
}

export interface MinigameTemplate {
  id: string;
  name: string;
  description: string;
  emotionId: string;
  baseReward: number;
  baseCooldown: number;
  missionRequirement?: string;
  initiallyUnlocked?: boolean;
}

export interface MinigameState extends MinigameTemplate {
  unlocked: boolean;
  completed: boolean;
  timesCompleted: number;
  lastPlayed: number;
  reward: number;
  cooldown: number;
  cooldownReduction: number;
  rewardMultiplier: number;
}

export interface MinigameProgress {
  id: string;
  unlocked?: boolean;
  timesCompleted?: number;
  lastPlayed?: number;
  rewardMultiplier?: number;
  cooldownReduction?: number;
}

export interface MissionTemplate {
  id: string;
  name: string;
  description: string;
  type: MissionType;
  target?: string;
  targetCount?: number;
  reward?: number;
  dependsOn?: string[];
}

export interface MissionState extends MissionTemplate {
  completed: boolean;
  claimed: boolean;
}

export interface MissionProgress {
  id: string;
  completed?: boolean;
  claimed?: boolean;
}

export const AGENT_TEMPLATES: AgentTemplate[] = [
  {
    id: 'baby-kraken',
    name: 'Baby Kraken – Tiny Scout',
    description: 'Collects 1 Krakenling per second.',
    baseCost: 20,
    collectionRate: 1,
    collectionInterval: 1000,
    costMultiplier: 1.15,
    missionRequirement: 'visit-home'
  },
  {
    id: 'young-kraken',
    name: 'Young Kraken – Steady Guardian',
    description: 'Collects 5 Krakenlings per second.',
    baseCost: 80,
    collectionRate: 5,
    collectionInterval: 1000,
    costMultiplier: 1.15,
    unlockRequirement: 'baby-kraken'
  },
  {
    id: 'adult-kraken',
    name: 'Adult Kraken – Deep Tide Keeper',
    description: 'Collects 20 Krakenlings per second.',
    baseCost: 320,
    collectionRate: 20,
    collectionInterval: 1000,
    costMultiplier: 1.15,
    unlockRequirement: 'young-kraken',
    missionRequirement: 'collect-10'
  },
  {
    id: 'elder-kraken',
    name: 'Elder Kraken – Ancient Current',
    description: 'Collects 50 Krakenlings per second.',
    baseCost: 1200,
    collectionRate: 50,
    collectionInterval: 1000,
    costMultiplier: 1.15,
    unlockRequirement: 'adult-kraken',
    missionRequirement: 'hope-2'
  },
  {
    id: 'guardian-kraken',
    name: 'Guardian Kraken',
    description: 'Collects 100 Krakenlings per second.',
    baseCost: 4800,
    collectionRate: 120,
    collectionInterval: 1000,
    costMultiplier: 1.15,
    unlockRequirement: 'elder-kraken',
    missionRequirement: 'collect-100'
  },
  {
    id: 'tide-master',
    name: 'Tide Master',
    description: 'Flow with the tide.',
    baseCost: 20000,
    collectionRate: 300,
    collectionInterval: 1000,
    costMultiplier: 1.15,
    unlockRequirement: 'guardian-kraken',
    missionRequirement: 'courage-3'
  },
  {
    id: 'den-keeper',
    name: 'Den Keeper',
    description: 'Keeps the den safe.',
    baseCost: 80000,
    collectionRate: 750,
    collectionInterval: 1000,
    costMultiplier: 1.15,
    unlockRequirement: 'tide-master',
    missionRequirement: 'connection-3'
  },
  {
    id: 'the-player',
    name: 'You',
    description: 'You are the treasure.',
    baseCost: 300000,
    collectionRate: 2000,
    collectionInterval: 1000,
    costMultiplier: 1.15,
    unlockRequirement: 'den-keeper',
    missionRequirement: 'healing-4'
  }
];
export const UNLOCKABLE_TEMPLATES: UnlockableTemplate[] = [
  {
    id: 'home',
    name: 'Home Page',
    description: 'Unlock main page.',
    cost: 100,
    route: Route.HOME,
    type: 'page'
  },
  {
    id: 'games',
    name: 'Games Page',
    description: 'Unlock games page.',
    cost: 1000,
    route: Route.HEART_WEAVER,
    type: 'page',
    missionRequirement: 'visit-home'
  },
  {
    id: 'team',
    name: 'About Us',
    description: 'Unlock team page.',
    cost: 10000,
    route: Route.TEAM,
    type: 'page',
    missionRequirement: 'visit-games'
  },
  {
    id: 'contact',
    name: 'Contact',
    description: 'Unlock contact page.',
    cost: 25000,
    route: Route.CONTACT,
    type: 'page',
    missionRequirement: 'visit-team'
  },
  {
    id: 'newsletter',
    name: 'Newsletter',
    description: 'Unlock newsletter.',
    cost: 50000,
    type: 'page',
    missionRequirement: 'visit-contact'
  },
  {
    id: 'courage-minigame',
    name: 'Therapy: Courage',
    description: 'Unlock Courage.',
    cost: 2500,
    type: 'feature',
    missionRequirement: 'hope-3'
  },
  {
    id: 'connection-minigame',
    name: 'Therapy: Connection',
    description: 'Unlock Connection.',
    cost: 5000,
    type: 'feature',
    missionRequirement: 'courage-3'
  },
  {
    id: 'healing-minigame',
    name: 'Therapy: Healing',
    description: 'Unlock Healing.',
    cost: 10000,
    type: 'feature',
    missionRequirement: 'visit-contact'
  },
  {
    id: 'true-heart',
    name: 'True Heart of the Den',
    description: 'Final treasure.',
    cost: 50000000,
    type: 'treasure',
    missionRequirement: 'healing-3'
  },
  {
    id: 'passive-collection-1',
    name: 'Gentle Currents',
    description: '+10% passive rate.',
    cost: 2500,
    type: 'upgrade',
    upgradeType: 'passive',
    multiplierValue: 0.1,
    missionRequirement: 'buy-first-helper'
  },
  {
    id: 'passive-collection-2',
    name: 'Flowing Tides',
    description: '+25% passive rate.',
    cost: 30000,
    type: 'upgrade',
    upgradeType: 'passive',
    multiplierValue: 0.25,
    missionRequirement: 'reach-800-kps'
  },
  {
    id: 'passive-collection-3',
    name: 'Deep Resonance',
    description: '+50% passive rate.',
    cost: 100000,
    type: 'upgrade',
    upgradeType: 'passive',
    multiplierValue: 0.5,
    missionRequirement: 'connection-3'
  },
  {
    id: 'baby-multiplier-1',
    name: 'Baby Kraken Boost I',
    description: '2x Baby Kraken.',
    cost: 1500,
    type: 'upgrade',
    upgradeType: 'agent-multiplier',
    targetAgentId: 'baby-kraken',
    multiplierValue: 2,
    missionRequirement: 'hope-2'
  },
  {
    id: 'young-multiplier-1',
    name: 'Young Kraken Boost I',
    description: '2x Young Kraken.',
    cost: 15000,
    type: 'upgrade',
    upgradeType: 'agent-multiplier',
    targetAgentId: 'young-kraken',
    multiplierValue: 2,
    missionRequirement: 'courage-2'
  },
  {
    id: 'adult-multiplier-1',
    name: 'Adult Kraken Boost I',
    description: '2x Adult Kraken.',
    cost: 40000,
    type: 'upgrade',
    upgradeType: 'agent-multiplier',
    targetAgentId: 'adult-kraken',
    multiplierValue: 2,
    missionRequirement: 'connection-2'
  },
  {
    id: 'elder-multiplier-1',
    name: 'Elder Kraken Boost I',
    description: '2x Elder Kraken.',
    cost: 100000,
    type: 'upgrade',
    upgradeType: 'agent-multiplier',
    targetAgentId: 'elder-kraken',
    multiplierValue: 2,
    missionRequirement: 'healing-3'
  },
  {
    id: 'guardian-multiplier-1',
    name: 'Guardian Kraken Boost I',
    description: '2x Guardian Kraken.',
    cost: 200000,
    type: 'upgrade',
    upgradeType: 'agent-multiplier',
    targetAgentId: 'guardian-kraken',
    multiplierValue: 2,
    missionRequirement: 'own-3-helpers'
  },
  {
    id: 'tide-multiplier-1',
    name: 'Tide Master Boost I',
    description: '2x Tide Master.',
    cost: 400000,
    type: 'upgrade',
    upgradeType: 'agent-multiplier',
    targetAgentId: 'tide-master',
    multiplierValue: 2,
    missionRequirement: 'connection-2'
  },
  {
    id: 'den-multiplier-1',
    name: 'Den Keeper Boost I',
    description: '2x Den Keeper.',
    cost: 2500000,
    type: 'upgrade',
    upgradeType: 'agent-multiplier',
    targetAgentId: 'den-keeper',
    multiplierValue: 2,
    missionRequirement: 'healing-2'
  },
  {
    id: 'player-multiplier-1',
    name: 'Your Boost I',
    description: '2x your rate.',
    cost: 6000000,
    type: 'upgrade',
    upgradeType: 'agent-multiplier',
    targetAgentId: 'the-player',
    multiplierValue: 2,
    missionRequirement: 'visit-contact'
  },
  {
    id: 'hope-cooldown-1',
    name: 'Hope Cooldown I',
    description: '-25% Hope cooldown.',
    cost: 4000,
    type: 'upgrade',
    upgradeType: 'minigame-cooldown',
    targetMinigameId: 'hope',
    multiplierValue: 0.25,
    missionRequirement: 'hope-2'
  },
  {
    id: 'courage-cooldown-1',
    name: 'Courage Cooldown I',
    description: '-25% Courage cooldown.',
    cost: 8000,
    type: 'upgrade',
    upgradeType: 'minigame-cooldown',
    targetMinigameId: 'courage',
    multiplierValue: 0.25,
    missionRequirement: 'courage-2'
  },
  {
    id: 'connection-cooldown-1',
    name: 'Connection Cooldown I',
    description: '-25% Connection cooldown.',
    cost: 15000,
    type: 'upgrade',
    upgradeType: 'minigame-cooldown',
    targetMinigameId: 'connection',
    multiplierValue: 0.25,
    missionRequirement: 'connection-2'
  },
  {
    id: 'healing-cooldown-1',
    name: 'Healing Cooldown I',
    description: '-25% Healing cooldown.',
    cost: 25000,
    type: 'upgrade',
    upgradeType: 'minigame-cooldown',
    targetMinigameId: 'healing',
    multiplierValue: 0.25,
    missionRequirement: 'healing-2'
  },
  {
    id: 'hope-reward-1',
    name: 'Hope Boost I',
    description: '2x Hope rewards.',
    cost: 8000,
    type: 'upgrade',
    upgradeType: 'minigame-reward-multiplier',
    targetMinigameId: 'hope',
    multiplierValue: 2,
    missionRequirement: 'hope-3'
  },
  {
    id: 'hope-reward-2',
    name: 'Hope Boost II',
    description: '3x Hope rewards.',
    cost: 40000,
    type: 'upgrade',
    upgradeType: 'minigame-reward-multiplier',
    targetMinigameId: 'hope',
    multiplierValue: 3,
    missionRequirement: 'hope-4'
  },
  {
    id: 'courage-reward-1',
    name: 'Courage Boost I',
    description: '2x Courage rewards.',
    cost: 12000,
    type: 'upgrade',
    upgradeType: 'minigame-reward-multiplier',
    targetMinigameId: 'courage',
    multiplierValue: 2,
    missionRequirement: 'courage-3'
  },
  {
    id: 'courage-reward-2',
    name: 'Courage Boost II',
    description: '3x Courage rewards.',
    cost: 60000,
    type: 'upgrade',
    upgradeType: 'minigame-reward-multiplier',
    targetMinigameId: 'courage',
    multiplierValue: 3,
    missionRequirement: 'courage-4'
  },
  {
    id: 'connection-reward-1',
    name: 'Connection Boost I',
    description: '2x Connection rewards.',
    cost: 16000,
    type: 'upgrade',
    upgradeType: 'minigame-reward-multiplier',
    targetMinigameId: 'connection',
    multiplierValue: 2,
    missionRequirement: 'connection-3'
  },
  {
    id: 'connection-reward-2',
    name: 'Connection Boost II',
    description: '3x Connection rewards.',
    cost: 80000,
    type: 'upgrade',
    upgradeType: 'minigame-reward-multiplier',
    targetMinigameId: 'connection',
    multiplierValue: 3,
    missionRequirement: 'connection-4'
  },
  {
    id: 'healing-reward-1',
    name: 'Healing Boost I',
    description: '2x Healing rewards.',
    cost: 20000,
    type: 'upgrade',
    upgradeType: 'minigame-reward-multiplier',
    targetMinigameId: 'healing',
    multiplierValue: 2,
    missionRequirement: 'healing-3'
  },
  {
    id: 'healing-reward-2',
    name: 'Healing Boost II',
    description: '3x Healing rewards.',
    cost: 100000,
    type: 'upgrade',
    upgradeType: 'minigame-reward-multiplier',
    targetMinigameId: 'healing',
    multiplierValue: 3,
    missionRequirement: 'healing-3'
  },
  {
    id: 'all-therapies-reward-1',
    name: 'Therapies Boost I',
    description: '+50% all rewards.',
    cost: 80000,
    type: 'upgrade',
    upgradeType: 'minigame-reward-multiplier',
    targetMinigameId: 'all',
    multiplierValue: 1.5,
    missionRequirement: 'healing-1'
  },
  {
    id: 'all-therapies-reward-2',
    name: 'Therapies Boost II',
    description: '2x all rewards.',
    cost: 5000000,
    type: 'upgrade',
    upgradeType: 'minigame-reward-multiplier',
    targetMinigameId: 'all',
    multiplierValue: 2,
    missionRequirement: 'healing-4'
  },
  {
    id: 'sound-button-click',
    name: 'Sound Effects: Clicks & Collects',
    description: 'Unlock click sounds.',
    cost: 2000,
    type: 'upgrade',
    upgradeType: 'audio',
    missionRequirement: 'visit-home'
  },
  {
    id: 'sound-minigame-hope',
    name: 'Sound Effects: Hope Therapy',
    description: 'Unlock Hope sounds.',
    cost: 5000,
    type: 'upgrade',
    upgradeType: 'audio',
    missionRequirement: 'hope-4'
  },
  {
    id: 'sound-minigame-courage',
    name: 'Sound Effects: Courage Therapy',
    description: 'Unlock Courage sounds.',
    cost: 50000,
    type: 'upgrade',
    upgradeType: 'audio',
    missionRequirement: 'courage-4'
  },
  {
    id: 'sound-minigame-connection',
    name: 'Sound Effects: Connection Therapy',
    description: 'Unlock Connection sounds.',
    cost: 80000,
    type: 'upgrade',
    upgradeType: 'audio',
    missionRequirement: 'connection-4'
  },
  {
    id: 'sound-minigame-healing',
    name: 'Sound Effects: Healing Therapy',
    description: 'Unlock Healing sounds.',
    cost: 150000,
    type: 'upgrade',
    upgradeType: 'audio',
    missionRequirement: 'healing-4'
  },
  {
    id: 'sound-music',
    name: 'Background Music',
    description: 'Unlock background music.',
    cost: 60000,
    type: 'upgrade',
    upgradeType: 'audio',
    missionRequirement: 'visit-team'
  },
  {
    id: 'collect-multiplier-10',
    name: 'Collect Surge: 10',
    description: 'Manual collect gives 10 Krakenlings.',
    cost: 8000,
    type: 'upgrade',
    upgradeType: 'collection-multiplier',
    manualCollectionValue: 10,
    missionRequirement: 'collect-10'
  },
  {
    id: 'collect-multiplier-100',
    name: 'Collect Surge: 100',
    description: 'Manual collect gives 100 Krakenlings.',
    cost: 60000,
    type: 'upgrade',
    upgradeType: 'collection-multiplier',
    manualCollectionValue: 100,
    missionRequirement: 'collect-50'
  },
  {
    id: 'collect-multiplier-500',
    name: 'Collect Surge: 1000',
    description: 'Manual collect gives 1000 Krakenlings.',
    cost: 200000,
    type: 'upgrade',
    upgradeType: 'collection-multiplier',
    manualCollectionValue: 1000,
    missionRequirement: 'collect-100'
  },
  {
    id: 'collect-percent-1',
    name: 'Collect Flow I',
    description: 'Manual collect gives 5 times your total KPS.',
    cost: 600000,
    type: 'upgrade',
    upgradeType: 'collection-multiplier',
    manualCollectionPercentOfKps: 5,
    missionRequirement: 'collect-500'
  },
  {
    id: 'collect-percent-2',
    name: 'Collect Flow II',
    description: 'Manual collect gives 10 times of your total KPS.',
    cost: 1200000,
    type: 'upgrade',
    upgradeType: 'collection-multiplier',
    manualCollectionPercentOfKps: 10,
    missionRequirement: 'collect-1000'
  },
  {
    id: 'collect-all',
    name: 'Collect All',
    description: 'When collecting a Krakenling, collect all Krakenlings on the page.',
    cost: 3000000,
    type: 'upgrade',
    upgradeType: 'collection-multiplier',
    missionRequirement: 'reach-2000000'
  }
];
export const MINIGAME_TEMPLATES: MinigameTemplate[] = [
  {
    id: 'hope',
    name: 'Hope – Follow the Light',
    description: 'Follow the light. Focus on one step at a time.',
    emotionId: 'hope',
    baseReward: 50,
    baseCooldown: 90000,
    initiallyUnlocked: true
  },
  {
    id: 'courage',
    name: 'Courage – Hold the Pressure',
    description: 'Hold the button. Stay with discomfort a little longer.',
    emotionId: 'courage',
    baseReward: 750,
    baseCooldown: 120000,
    missionRequirement: 'hope-1'
  },
  {
    id: 'connection',
    name: 'Connection – Connect the Dots',
    description: 'Connect the letters. Build the word.',
    emotionId: 'connection',
    baseReward: 9999,
    baseCooldown: 180000,
    missionRequirement: 'courage-1'
  },
  {
    id: 'healing',
    name: 'Healing – Breathing Rhythm',
    description: 'Tap with the rhythm. Notice your breath.',
    emotionId: 'healing',
    baseReward: 40000,
    baseCooldown: 240000,
    missionRequirement: 'connection-1'
  }
];
export const MISSION_TEMPLATES: MissionTemplate[] = [
  {
    id: 'visit-home',
    name: 'Welcome to the Den',
    description: 'Visit the home page.',
    type: 'visit-page',
    target: Route.HOME,
    reward: 200
  },
  {
    id: 'visit-games',
    name: 'Discover the game',
    description: 'Learn about our games.',
    type: 'visit-page',
    target: Route.HEART_WEAVER,
    reward: 300,
    dependsOn: ['visit-home']
  },
  {
    id: 'visit-team',
    name: 'Meet the team',
    description: 'Meet the people behind the studio.',
    type: 'visit-page',
    target: Route.TEAM,
    reward: 500,
    dependsOn: ['visit-games']
  },
  {
    id: 'visit-contact',
    name: 'Contact us',
    description: 'Visit the contact page.',
    type: 'visit-page',
    target: Route.CONTACT,
    reward: 800,
    dependsOn: ['visit-team']
  },
  {
    id: 'hope-1',
    name: 'Hope I',
    description: 'Complete Hope therapy for the first time.',
    type: 'complete-therapy',
    target: 'hope',
    targetCount: 1,
    reward: 100
  },
  {
    id: 'hope-2',
    name: 'Hope II',
    description: 'Complete Hope therapy 2 times.',
    type: 'complete-therapy',
    target: 'hope',
    targetCount: 2,
    reward: 220,
    dependsOn: ['hope-1']
  },
  {
    id: 'hope-3',
    name: 'Hope III',
    description: 'Complete Hope therapy 5 times.',
    type: 'complete-therapy',
    target: 'hope',
    targetCount: 5,
    reward: 400,
    dependsOn: ['hope-2']
  },
  {
    id: 'hope-4',
    name: 'Hope IV',
    description: 'Complete Hope therapy 10 times.',
    type: 'complete-therapy',
    target: 'hope',
    targetCount: 10,
    reward: 2500,
    dependsOn: ['hope-3']
  },
  {
    id: 'courage-1',
    name: 'Courage I',
    description: 'Complete Courage therapy for the first time.',
    type: 'complete-therapy',
    target: 'courage',
    targetCount: 1,
    reward: 300
  },
  {
    id: 'courage-2',
    name: 'Courage II',
    description: 'Complete Courage therapy 2 times.',
    type: 'complete-therapy',
    target: 'courage',
    targetCount: 2,
    reward: 1000,
    dependsOn: ['courage-1']
  },
  
  {
    id: 'courage-3',
    name: 'Courage III',
    description: 'Complete Courage therapy 5 times.',
    type: 'complete-therapy',
    target: 'courage',
    targetCount: 5,
    reward: 5000,
    dependsOn: ['courage-1']
  },
  {
    id: 'courage-4',
    name: 'Courage IV',
    description: 'Complete Courage therapy 10 times.',
    type: 'complete-therapy',
    target: 'courage',
    targetCount: 10,
    reward: 10000,
    dependsOn: ['courage-3']
  },
  {
    id: 'connection-1',
    name: 'Connection I',
    description: 'Complete Connection therapy for the first time.',
    type: 'complete-therapy',
    target: 'connection',
    targetCount: 1,
    reward: 400,
  },
  {
    id: 'connection-2',
    name: 'Connection II',
    description: 'Complete Connection therapy 2 times.',
    type: 'complete-therapy',
    target: 'connection',
    targetCount: 2,
    reward: 1500,
    dependsOn: ['connection-1']
  },
  {
    id: 'connection-3',
    name: 'Connection III',
    description: 'Complete Connection therapy 5 times.',
    type: 'complete-therapy',
    target: 'connection',
    targetCount: 5,
    reward: 20000,
    dependsOn: ['connection-2']
  },
  {
    id: 'connection-4',
    name: 'Connection IV',
    description: 'Complete Connection therapy 10 times.',
    type: 'complete-therapy',
    target: 'connection',
    targetCount: 10,
    reward: 50000,
    dependsOn: ['connection-3']
  },
  {
    id: 'healing-1',
    name: 'Healing I',
    description: 'Complete Healing therapy for the first time.',
    type: 'complete-therapy',
    target: 'healing',
    targetCount: 1,
    reward: 500,
  },
  {
    id: 'healing-2',
    name: 'Healing II',
    description: 'Complete Healing therapy 2 times.',
    type: 'complete-therapy',
    target: 'healing',
    targetCount: 2,
    reward: 10000,
    dependsOn: ['healing-1']
  },
  {
    id: 'healing-3',
    name: 'Healing III',
    description: 'Complete Healing therapy 5 times.',
    type: 'complete-therapy',
    target: 'healing',
    targetCount: 5,
    reward: 50000,
    dependsOn: ['healing-2']
  },
  {
    id: 'healing-4',
    name: 'Healing IV',
    description: 'Complete Healing therapy 10 times.',
    type: 'complete-therapy',
    target: 'healing',
    targetCount: 10,
    reward: 100000,
    dependsOn: ['healing-3']
  },
  {
    id: 'buy-first-helper',
    name: 'Ask for help',
    description: 'Get your first helper',
    type: 'helpers-owned',
    targetCount: 1,
    reward: 400,
  },
  {
    id: 'own-3-helpers',
    name: 'Initial Team',
    description: 'Get 3 different helpers working at the same time.',
    type: 'helpers-owned',
    targetCount: 3,
    reward: 5000,
    dependsOn: ['buy-first-helper']
  },
  {
    id: 'own-5-helpers',
    name: 'Growing Team',
    description: 'Get 5 different helpers working at the same time.',
    type: 'helpers-owned',
    targetCount: 5,
    reward: 10000,
    dependsOn: ['own-3-helpers']
  },
  {
    id: 'own-10-helpers',
    name: 'Full Team',
    description: 'Get 10 different helpers working at the same time.',
    type: 'helpers-owned',
    targetCount: 10,
    reward: 40000,
    dependsOn: ['own-5-helpers']
  },
  {
    id: 'collect-10',
    name: 'Collector I',
    description: 'Save 10 Krakenlings.',
    type: 'collect-krakenlings',
    target: '10',
    reward: 120,
  },
  {
    id: 'collect-50',
    name: 'Collector II',
    description: 'Save 50 Krakenlings.',
    type: 'collect-krakenlings',
    target: '50',
    reward: 650,
    dependsOn: ['collect-10']
  },
  {
    id: 'collect-100',
    name: 'Collector III',
    description: 'Save 100 Krakenlings.',
    type: 'collect-krakenlings',
    target: '100',
    reward: 2000,
    dependsOn: ['collect-50']
  },
  {
    id: 'collect-500',
    name: 'Collector IV',
    description: 'Save 500 Krakenlings.',
    type: 'collect-krakenlings',
    target: '500',
    reward: 50000,
    dependsOn: ['collect-100']
  },
  {
    id: 'collect-1000',
    name: 'Collector V',
    description: 'Save 1000 Krakenlings.',
    type: 'collect-krakenlings',
    target: '1000',
    reward: 100000,
    dependsOn: ['collect-500']
  },
  {
    id: 'reach-5000',
    name: 'Abundance I',
    description: 'Reach 5000 total Krakenlings.',
    type: 'reach-krakenlings',
    target: '5000',
    reward: 800,
  },
  {
    id: 'reach-20000',
    name: 'Abundance II',
    description: 'Reach 20000 total Krakenlings.',
    type: 'reach-krakenlings',
    target: '20000',
    reward: 1600,
    dependsOn: ['reach-5000']
  },
  {
    id: 'reach-50000',
    name: 'Abundance III',
    description: 'Reach 50000 total Krakenlings.',
    type: 'reach-krakenlings',
    target: '50000',
    reward: 3200,
    dependsOn: ['reach-20000']
  },
  {
    id: 'reach-100000',
    name: 'Abundance IV',
    description: 'Reach 100000 total Krakenlings.',
    type: 'reach-krakenlings',
    target: '100000',
    reward: 6400,
    dependsOn: ['reach-50000']
  },
  {
    id: 'reach-500000',
    name: 'Abundance V',
    description: 'Reach 500000 total Krakenlings.',
    type: 'reach-krakenlings',
    target: '500000',
    reward: 12800,
    dependsOn: ['reach-100000']
  },
  {
    id: 'reach-1000000',
    name: 'Abundance VI',
    description: 'Reach 1000000 total Krakenlings.',
    type: 'reach-krakenlings',
    target: '1000000',
    reward: 25600,
    dependsOn: ['reach-500000']
  },
  {
    id: 'reach-2000000',
    name: 'Abundance VII',
    description: 'Reach 2000000 total Krakenlings.',
    type: 'reach-krakenlings',
    target: '2000000',
    reward: 51200,
    dependsOn: ['reach-1000000']
  },
  {
    id: 'reach-50-kps',
    name: 'Master I',
    description: 'Reach 50 Krakenlings per second.',
    type: 'reach-kps',
    target: '50',
    reward: 500
  },
  {
    id: 'reach-100-kps',
    name: 'Master II',
    description: 'Reach 100 Krakenlings per second.',
    type: 'reach-kps',
    target: '100',
    reward: 1200,
    dependsOn: ['reach-50-kps']
  },
  {
    id: 'reach-200-kps',
    name: 'Master III',
    description: 'Reach 200 Krakenlings per second.',
    type: 'reach-kps',
    target: '200',
    reward: 2800,
    dependsOn: ['reach-100-kps']
  },
  {
    id: 'reach-400-kps',
    name: 'Master IV',
    description: 'Reach 400 Krakenlings per second.',
    type: 'reach-kps',
    target: '400',
    reward: 6400,
    dependsOn: ['reach-200-kps']
  },
  {
    id: 'reach-800-kps',
    name: 'Master V',
    description: 'Reach 800 Krakenlings per second.',
    type: 'reach-kps',
    target: '800',
    reward: 14400,
    dependsOn: ['reach-400-kps']
  },
  {
    id: 'reach-1600-kps',
    name: 'Master VI',
    description: 'Reach 1600 Krakenlings per second.',
    type: 'reach-kps',
    target: '1600',
    reward: 32000,
    dependsOn: ['reach-800-kps']
  },
  {
    id: 'reach-3000-kps',
    name: 'Master VII',
    description: 'Reach 3000 Krakenlings per second.',
    type: 'reach-kps',
    target: '3000',
    reward: 72000,
    dependsOn: ['reach-1600-kps']
  },
];

const buildMap = <T extends { id: string }>(items: ReadonlyArray<T>) => {
  const map = new Map<string, T>();
  items.forEach(item => map.set(item.id, item));
  return map;
};

export const AGENT_TEMPLATE_MAP = buildMap(AGENT_TEMPLATES);
export const UNLOCKABLE_TEMPLATE_MAP = buildMap(UNLOCKABLE_TEMPLATES);
export const MINIGAME_TEMPLATE_MAP = buildMap(MINIGAME_TEMPLATES);
export const MISSION_TEMPLATE_MAP = buildMap(MISSION_TEMPLATES);

export const buildAgents = (progress?: ReadonlyArray<AgentProgress>): AgentState[] => {
  const progressMap = new Map((progress ?? []).map(item => [item.id, item]));
  return AGENT_TEMPLATES.map(template => {
    const saved = progressMap.get(template.id);
    return {
      ...template,
      owned: saved?.owned ?? 0,
      multiplier: saved?.multiplier ?? 1
    };
  });
};

export const serializeAgentProgress = (state: ReadonlyArray<AgentState>): AgentProgress[] =>
  state
    .filter(agent => agent.owned > 0 || agent.multiplier !== 1)
    .map(agent => {
      const payload: AgentProgress = { id: agent.id };
      if (agent.owned > 0) payload.owned = agent.owned;
      if (agent.multiplier !== 1) payload.multiplier = agent.multiplier;
      return payload;
    });

export const buildUnlockables = (progress?: ReadonlyArray<UnlockableProgress>): UnlockableState[] => {
  const progressMap = new Map((progress ?? []).map(item => [item.id, item]));
  return UNLOCKABLE_TEMPLATES.map(template => {
    const saved = progressMap.get(template.id);
    return {
      ...template,
      unlocked: saved?.unlocked ?? false
    };
  });
};

export const serializeUnlockableProgress = (state: ReadonlyArray<UnlockableState>): UnlockableProgress[] =>
  state.filter(item => item.unlocked).map(item => ({ id: item.id, unlocked: true }));

export const buildMinigames = (progress?: ReadonlyArray<MinigameProgress>): MinigameState[] => {
  const progressMap = new Map((progress ?? []).map(item => [item.id, item]));
  return MINIGAME_TEMPLATES.map(template => {
    const saved = progressMap.get(template.id);
    const unlocked = saved?.unlocked ?? !!template.initiallyUnlocked;
    const timesCompleted = saved?.timesCompleted ?? 0;
    const rewardMultiplier = saved?.rewardMultiplier ?? 1;
    const cooldownReduction = saved?.cooldownReduction ?? 0;
    const baseCooldown = template.baseCooldown;
    return {
      ...template,
      unlocked,
      completed: false,
      timesCompleted,
      lastPlayed: saved?.lastPlayed ?? 0,
      rewardMultiplier,
      cooldownReduction,
      cooldown: Math.floor(baseCooldown * (1 - cooldownReduction)),
      reward: Math.floor(template.baseReward * (timesCompleted + 1) * rewardMultiplier)
    };
  });
};

export const serializeMinigameProgress = (state: ReadonlyArray<MinigameState>): MinigameProgress[] => {
  return state
    .map(minigame => {
      const template = MINIGAME_TEMPLATE_MAP.get(minigame.id);
      if (!template) return null;
      const payload: MinigameProgress = { id: minigame.id };
      let changed = false;
      if (minigame.unlocked !== !!template.initiallyUnlocked) {
        payload.unlocked = minigame.unlocked;
        changed = true;
      }
      if (minigame.timesCompleted > 0) {
        payload.timesCompleted = minigame.timesCompleted;
        changed = true;
      }
      if (minigame.lastPlayed > 0) {
        payload.lastPlayed = minigame.lastPlayed;
        changed = true;
      }
      if (minigame.rewardMultiplier !== 1) {
        payload.rewardMultiplier = minigame.rewardMultiplier;
        changed = true;
      }
      if (minigame.cooldownReduction !== 0) {
        payload.cooldownReduction = minigame.cooldownReduction;
        changed = true;
      }
      return changed ? payload : null;
    })
    .filter((entry): entry is MinigameProgress => entry !== null);
};

export const buildMissions = (progress?: ReadonlyArray<MissionProgress>): MissionState[] => {
  const progressMap = new Map((progress ?? []).map(item => [item.id, item]));
  return MISSION_TEMPLATES.map(template => {
    const saved = progressMap.get(template.id);
    return {
      ...template,
      completed: saved?.completed ?? false,
      claimed: saved?.claimed ?? false
    };
  });
};

export const serializeMissionProgress = (state: ReadonlyArray<MissionState>): MissionProgress[] =>
  state
    .filter(mission => mission.completed || mission.claimed)
    .map(mission => ({
      id: mission.id,
      completed: mission.completed || undefined,
      claimed: mission.claimed || undefined
    }));

export const calculateTotalKps = (agents: ReadonlyArray<AgentState>, unlockables: ReadonlyArray<UnlockableState>): number => {
  const activeAgents = agents.filter(agent => agent.owned > 0);
  const baseKrakenlingsPerSecond = activeAgents.reduce((sum, agent) => {
    return sum + agent.owned * agent.collectionRate * (agent.multiplier || 1);
  }, 0);

  const passiveMultiplier = unlockables
    .filter(u => u.type === 'upgrade' && u.upgradeType === 'passive' && u.unlocked)
    .reduce((sum, upgrade) => sum + (upgrade.multiplierValue || 0), 0);

  return baseKrakenlingsPerSecond + baseKrakenlingsPerSecond * passiveMultiplier;
};

const MANUAL_COLLECTION_PRIORITY_IDS = [
  'collect-percent-2',
  'collect-percent-1',
  'collect-multiplier-500',
  'collect-multiplier-100',
  'collect-multiplier-10'
];

export type ManualCollectionTier =
  | { kind: 'percent'; percent: number }
  | { kind: 'flat'; value: number };

export const resolveManualCollectionTier = (unlockables: ReadonlyArray<UnlockableState>): ManualCollectionTier => {
  for (const id of MANUAL_COLLECTION_PRIORITY_IDS) {
    const isUnlocked = unlockables.some(u => u.id === id && u.unlocked);
    if (!isUnlocked) continue;
    const template = UNLOCKABLE_TEMPLATE_MAP.get(id);
    if (template?.manualCollectionPercentOfKps) {
      return { kind: 'percent', percent: template.manualCollectionPercentOfKps };
    }
    if (template?.manualCollectionValue) {
      return { kind: 'flat', value: template.manualCollectionValue };
    }
  }
  return { kind: 'flat', value: 1 };
};

const parseJsonArray = (raw: string | null): any[] | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const hasKey = (entry: any, key: string) =>
  typeof entry === 'object' && entry !== null && Object.prototype.hasOwnProperty.call(entry, key);

export const deserializeAgents = (
  raw: string | null
): { state: AgentState[]; shouldPersist: boolean } => {
  const parsed = parseJsonArray(raw);
  if (!parsed) {
    return { state: buildAgents(), shouldPersist: !!raw };
  }
  const isLegacy = parsed.some(entry => hasKey(entry, 'collectionRate'));
  const progress: AgentProgress[] = isLegacy
    ? parsed.map(entry => ({ id: entry.id, owned: entry.owned, multiplier: entry.multiplier }))
    : parsed;
  return {
    state: buildAgents(progress),
    shouldPersist: isLegacy
  };
};

export const deserializeUnlockables = (
  raw: string | null
): { state: UnlockableState[]; shouldPersist: boolean } => {
  const parsed = parseJsonArray(raw);
  if (!parsed) {
    return { state: buildUnlockables(), shouldPersist: !!raw };
  }
  const isLegacy = parsed.some(entry => hasKey(entry, 'type'));
  const progress: UnlockableProgress[] = isLegacy
    ? parsed.map(entry => ({ id: entry.id, unlocked: entry.unlocked }))
    : parsed;
  return {
    state: buildUnlockables(progress),
    shouldPersist: isLegacy
  };
};

export const deserializeMinigames = (
  raw: string | null
): { state: MinigameState[]; shouldPersist: boolean } => {
  const parsed = parseJsonArray(raw);
  if (!parsed) {
    return { state: buildMinigames(), shouldPersist: !!raw };
  }
  const isLegacy = parsed.some(entry => hasKey(entry, 'baseReward'));
  const progress: MinigameProgress[] = isLegacy
    ? parsed.map(entry => ({
        id: entry.id,
        unlocked: entry.unlocked,
        timesCompleted: entry.timesCompleted,
        lastPlayed: entry.lastPlayed,
        rewardMultiplier: entry.rewardMultiplier,
        cooldownReduction: entry.cooldownReduction
      }))
    : parsed;
  return {
    state: buildMinigames(progress),
    shouldPersist: isLegacy
  };
};

export const deserializeMissions = (
  raw: string | null
): { state: MissionState[]; shouldPersist: boolean } => {
  const parsed = parseJsonArray(raw);
  if (!parsed) {
    return { state: buildMissions(), shouldPersist: !!raw };
  }
  const isLegacy = parsed.some(entry => hasKey(entry, 'name'));
  const progress: MissionProgress[] = isLegacy
    ? parsed.map(entry => ({ id: entry.id, completed: entry.completed, claimed: entry.claimed }))
    : parsed;
  return {
    state: buildMissions(progress),
    shouldPersist: isLegacy
  };
};

