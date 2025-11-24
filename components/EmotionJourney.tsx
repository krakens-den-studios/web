'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import Button from './Button';
import OctopusCollector from './OctopusCollector';
import EmotionShop from './EmotionShop';
import { RiEmotionLine } from 'react-icons/ri';
import { cookieStorage } from '@/utils/cookieStorage';

interface Emotion {
  id: string;
  name: string;
  color: string;
  description: string;
  position: { x: number; y: number };
  unlocked: boolean;
  sectionId: string;
  message: string;
  cost: number; // Cost in krakenlings to unlock
}

const STORAGE_KEY = 'emotion-journey-progress';
const OCTOPUS_STORAGE_KEY = 'octopus-collected-ids';
const OCTOPUS_COUNT_KEY = 'octopus-count';

// Componente para las burbujas con posiciones estables
const BubblesBackground = () => {
  const bubbles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 20 + 10,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10
    }));
  }, []); // Solo se genera una vez

  return (
    <div className="absolute inset-0 overflow-hidden">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute rounded-full bg-turquoise-400 opacity-20 animate-float"
          style={{
            left: `${bubble.left}%`,
            top: `${bubble.top}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            animationDelay: `${bubble.delay}s`,
            animationDuration: `${bubble.duration}s`
          }}
        />
      ))}
    </div>
  );
};

export default function EmotionJourney({ 
  onComplete, 
  emotionId, 
  onClose 
}: { 
  onComplete?: () => void;
  emotionId?: string;
  onClose?: () => void;
}) {
  const [currentPhase, setCurrentPhase] = useState<'intro' | 'game' | 'shop'>('intro');
  const [emotions, setEmotions] = useState<Emotion[]>([
    {
      id: 'hope',
      name: 'Hope',
      color: '#11B4BB',
      description: 'The light that guides in the darkness',
      position: { x: 20, y: 30 },
      unlocked: false,
      sectionId: 'welcome',
      message: 'Welcome to our Den. Hope is the first step towards healing.',
      cost: 5 // Cost in krakenlings
    },
    {
      id: 'courage',
      name: 'Courage',
      color: '#29e3eb',
      description: 'The strength to face our fears',
      position: { x: 50, y: 20 },
      unlocked: false,
      sectionId: 'games-section',
      message: 'Courage allows us to explore new worlds. Discover our games.',
      cost: 10
    },
    {
      id: 'connection',
      name: 'Connection',
      color: '#492A3D',
      description: 'The bond that unites us',
      position: { x: 80, y: 50 },
      unlocked: false,
      sectionId: 'team',
      message: 'Connect with those who share your journey. Meet our team.',
      cost: 15
    },
    {
      id: 'healing',
      name: 'Healing',
      color: '#043D40',
      description: 'The transformation process',
      position: { x: 40, y: 70 },
      unlocked: false,
      sectionId: 'newsletter',
      message: 'Healing is a continuous journey. Join our community.',
      cost: 20
    }
  ]);
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [unlockedCount, setUnlockedCount] = useState(0);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'success'>('idle');
  const [gameProgress, setGameProgress] = useState(0);
  const [gameData, setGameData] = useState<any>(null);
  const [collectedOctopuses, setCollectedOctopuses] = useState<string[]>([]);
  const [octopusCount, setOctopusCount] = useState(0);
  const [showShop, setShowShop] = useState(false);
  const holdButtonRef = useRef<NodeJS.Timeout | null>(null);
  const sequenceRef = useRef<number[]>([]);
  const userSequenceRef = useRef<number[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Load saved progress
    const saved = cookieStorage.getItem(STORAGE_KEY);
    const savedOctopuses = cookieStorage.getItem(OCTOPUS_STORAGE_KEY);
    const savedCount = cookieStorage.getItem(OCTOPUS_COUNT_KEY);
    
    if (saved) {
      try {
        const progress = JSON.parse(saved);
        // Asegurar que las emociones tengan costos si no los tienen
        const emotionsWithCosts = progress.emotions.map((e: any) => {
          if (!e.cost) {
            const defaultCosts: { [key: string]: number } = {
              hope: 5,
              courage: 10,
              connection: 15,
              healing: 20
            };
            return { ...e, cost: defaultCosts[e.id] || 10 };
          }
          return e;
        });
        setEmotions(emotionsWithCosts);
        setUnlockedCount(progress.unlockedCount);
        setCurrentPhase('game');
      } catch (e) {
        // Si hay error, empezar desde cero
      }
    }
    
    if (savedOctopuses) {
      try {
        setCollectedOctopuses(JSON.parse(savedOctopuses));
      } catch (e) {
        // Si hay error, empezar desde cero
      }
    }
    
    if (savedCount) {
      try {
        setOctopusCount(parseInt(savedCount, 10));
      } catch (e) {
        setOctopusCount(0);
      }
    }
  }, []);

  const handleCollectOctopus = (octopusId: string) => {
    if (!collectedOctopuses.includes(octopusId)) {
      const newCollected = [...collectedOctopuses, octopusId];
      const newCount = octopusCount + 1;
      
      setCollectedOctopuses(newCollected);
      setOctopusCount(newCount);
      
      if (typeof window !== 'undefined') {
        cookieStorage.setItem(OCTOPUS_STORAGE_KEY, JSON.stringify(newCollected));
        cookieStorage.setItem(OCTOPUS_COUNT_KEY, newCount.toString());
      }
    }
  };

  const handlePurchaseEmotion = (emotionId: string) => {
    const emotion = emotions.find(e => e.id === emotionId);
    if (!emotion || emotion.unlocked || octopusCount < emotion.cost) return;

    const newCount = octopusCount - emotion.cost;
    const updatedEmotions = emotions.map(e => 
      e.id === emotionId ? { ...e, unlocked: true } : e
    );
    
    setOctopusCount(newCount);
    setEmotions(updatedEmotions);
    setUnlockedCount(prev => prev + 1);
    
    if (typeof window !== 'undefined') {
      cookieStorage.setItem(OCTOPUS_COUNT_KEY, newCount.toString());
      const newUnlockedCount = unlockedCount + 1;
      setUnlockedCount(newUnlockedCount);
      cookieStorage.setItem(STORAGE_KEY, JSON.stringify({
        emotions: updatedEmotions,
        unlockedCount: newUnlockedCount
      }));
    }

    window.dispatchEvent(new CustomEvent('emotionUnlocked'));
  };

  // This function now gives krakenlings when completing a minigame
  const completeMinigame = (emotionId: string) => {
    const emotion = emotions.find(e => e.id === emotionId);
    if (!emotion) return;

    // Si se pasa onComplete como callback, llamarlo (para la tienda)
    if (onComplete) {
      onComplete();
    } else if (onClose) {
      // Si no hay onComplete pero hay onClose, cerrar el modal
      setTimeout(() => {
        if (onClose) onClose();
      }, 2000);
    }
  };

  const handleEmotionClick = (emotion: Emotion) => {
    // Only allow playing if emotion is unlocked from the shop
    if (emotion.unlocked && gameState === 'idle') {
      setSelectedEmotion(emotion);
      setGameState('idle');
      setGameProgress(0);
      // Initialize minigame according to emotion
      initializeGame(emotion);
    } else if (!emotion.unlocked) {
      // If not unlocked, open the shop
      setShowShop(true);
    }
  };

  const initializeGame = (emotion: Emotion) => {
    if (emotion.id === 'hope') {
      // Hope: follow the light
      const sequence = [1, 2, 3, 4, 5];
      sequenceRef.current = sequence;
      userSequenceRef.current = [];
      setGameData({ type: 'sequence', currentStep: 0, sequence });
    } else if (emotion.id === 'courage') {
      // Bravery: hold the button
      setGameData({ type: 'hold', duration: 3000, currentTime: 0 });
    } else if (emotion.id === 'connection') {
      // Connection: connect points in order
      const points = [1, 2, 3, 4];
      sequenceRef.current = points;
      userSequenceRef.current = [];
      setGameData({ type: 'connect', points, currentStep: 0 });
    } else if (emotion.id === 'healing') {
      // Healing: breathing pattern (click in rhythm)
      setGameData({ type: 'breath', clicks: 0, target: 5, lastClick: Date.now() });
    }
  };

  const handleGameAction = (action: string, value?: any) => {
    if (!selectedEmotion) return;

    const emotion = selectedEmotion;
    
    if (emotion.id === 'hope') {
      // Hope: follow the sequence
      if (action === 'click' && value !== undefined) {
        const expected = sequenceRef.current[userSequenceRef.current.length];
        if (value === expected) {
          userSequenceRef.current.push(value);
          setGameProgress((userSequenceRef.current.length / sequenceRef.current.length) * 100);
          
          if (userSequenceRef.current.length === sequenceRef.current.length) {
            setGameState('success');
            setTimeout(() => completeMinigame(emotion.id), 1000);
          }
        } else {
          // Error: restart
          userSequenceRef.current = [];
          setGameProgress(0);
          setGameData({ ...gameData, error: true });
          setTimeout(() => setGameData({ ...gameData, error: false }), 500);
        }
      }
    } else if (emotion.id === 'courage') {
      // Bravery: hold the button
      if (action === 'holdStart') {
        const startTime = Date.now();
        const interval = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min((elapsed / gameData.duration) * 100, 100);
          setGameProgress(progress);
          
          if (progress >= 100) {
            clearInterval(interval);
            setGameState('success');
            setTimeout(() => completeMinigame(emotion.id), 500);
          }
        }, 16);
        holdButtonRef.current = interval as any;
      } else if (action === 'holdEnd') {
        if (holdButtonRef.current) {
          clearInterval(holdButtonRef.current);
          holdButtonRef.current = null;
          if (gameProgress < 100) {
            setGameProgress(0);
          }
        }
      }
    } else if (emotion.id === 'connection') {
      // Connection: connect points
      if (action === 'click' && value !== undefined) {
        const expected = sequenceRef.current[userSequenceRef.current.length];
        if (value === expected) {
          userSequenceRef.current.push(value);
          setGameProgress((userSequenceRef.current.length / sequenceRef.current.length) * 100);
          
          if (userSequenceRef.current.length === sequenceRef.current.length) {
            setGameState('success');
            setTimeout(() => completeMinigame(emotion.id), 1000);
          }
        } else {
          // Error: restart
          userSequenceRef.current = [];
          setGameData({ ...gameData, error: true });
          setGameProgress(0);
          setGameData({ ...gameData, error: true });
          setTimeout(() => setGameData({ ...gameData, error: false }), 500);
        }
      }
    } else if (emotion.id === 'healing') {
      // Healing: breathing pattern
      if (action === 'click') {
        const now = Date.now();
        const timeSinceLastClick = now - gameData.lastClick;
        
        // Must click every 800-1200ms (breathing rhythm)
        if (timeSinceLastClick >= 600 && timeSinceLastClick <= 1400) {
          const newClicks = gameData.clicks + 1;
          setGameData({ ...gameData, clicks: newClicks, lastClick: now });
          setGameProgress((newClicks / gameData.target) * 100);
          
          if (newClicks >= gameData.target) {
            setGameState('success');
            setTimeout(() => completeMinigame(emotion.id), 1000);
          }
        } else {
          // Incorrect rhythm: restart the game
          setGameData({ ...gameData, clicks: 0, lastClick: now });
          setGameProgress(0);
          setGameData({ ...gameData, error: true });
          setTimeout(() => setGameData({ ...gameData, error: false }), 500);
        }
      }
    }
  };

  const startJourney = () => {
    setCurrentPhase('game');
  };

  const skipJourney = () => {
    if (typeof window !== 'undefined') {
      cookieStorage.setItem(STORAGE_KEY, JSON.stringify({
        emotions: emotions.map(e => ({ ...e, unlocked: true })),
        unlockedCount: emotions.length
      }));
    }
    if (onComplete) {
      onComplete();
    } else if (onClose) {
      onClose();
    }
  };

  if (currentPhase === 'intro') {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <div className="relative w-full h-full flex flex-col items-center justify-center gap-8 p-8 text-center">
          <div className="absolute inset-0 bg-gradient-to-b from-turquoise-800 via-black to-black opacity-50" />
          
          {/* Close button */}
          <button
            onClick={() => {
              if (onClose) {
                onClose();
              } else if (onComplete) {
                onComplete();
              }
            }}
            className="absolute top-8 right-8 z-20 text-white text-4xl font-bold opacity-60 hover:opacity-100 transition-opacity w-12 h-12 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-10"
            title="Cerrar"
          >
            ×
          </button>
          
          <div className="relative z-10 max-w-3xl flex flex-col gap-8 items-center">
            <h1 className="font-lora text-5xl md:text-6xl font-bold text-turquoise-400">
              The Emotional Journey
            </h1>
            
            <p className="text-2xl md:text-3xl opacity-90 leading-relaxed">
              In the depths of the ocean, small emotion krakenlings appear throughout the page.
            </p>
            
            <p className="text-xl md:text-2xl opacity-80 leading-relaxed">
              Collect these krakenlings and use them in The Kraken's Treasure to unlock therapies that will allow you to access new pages.
            </p>

            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <Button label="START JOURNEY" onClick={startJourney} />
              <button
                onClick={skipJourney}
                className="text-white text-xl font-lora opacity-60 hover:opacity-100 transition-opacity underline"
              >
                Saltar
              </button>
            </div>
          </div>
      </div>

      {/* Tienda de emociones */}
      {showShop && (
        <EmotionShop
          emotions={emotions}
          collectedOctopuses={octopusCount}
          onPurchase={handlePurchaseEmotion}
          onClose={() => setShowShop(false)}
        />
      )}
    </div>
  );
}

  // We removed the automatic "completed" screen
  // El usuario puede continuar explorando o cerrar cuando quiera

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      {/* Botón de cerrar */}
      <button
        onClick={() => {
          if (onClose) {
            onClose();
          } else if (onComplete) {
            onComplete();
          }
        }}
        className="absolute top-8 right-8 z-30 text-white text-4xl font-bold opacity-60 hover:opacity-100 transition-opacity w-12 h-12 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-10"
        title="Cerrar"
      >
        ×
      </button>

      {/* Animated oceanic background */}
      <div className="absolute inset-0 bg-gradient-to-b from-turquoise-800 via-black to-black" />
      
      {/* Floating particles (bubbles) */}
      <BubblesBackground />

      {/* Instrucciones y contador de pulpitos */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20 text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <RiEmotionLine className="text-turquoise-400 text-3xl" />
          <span className="text-2xl text-white font-bold">{octopusCount}</span>
          <span className="text-lg text-white opacity-80">pulpitos</span>
        </div>
        <p className="text-xl md:text-2xl text-white opacity-80 font-lora">
          Recolecta pulpitos y desbloquea emociones en El Tesoro del Kraken
        </p>
        <p className="text-lg text-white opacity-60 mt-2">
          {unlockedCount} / {emotions.length} emociones desbloqueadas
        </p>
      </div>

      {/* Button to open the shop */}
      <button
        onClick={() => setShowShop(true)}
        className="absolute top-8 right-24 z-30 bg-turquoise-400 hover:bg-turquoise-300 rounded-xl px-6 py-3 shadow-lg transition-all flex items-center gap-2"
        title="Open The Kraken's Treasure"
      >
        <span className="font-lora font-bold text-black text-lg">
          El Tesoro del Kraken
        </span>
      </button>

      {/* Krakenling collection component */}
      <OctopusCollector
        onCollect={handleCollectOctopus}
        collectedOctopuses={collectedOctopuses}
      />

      {/* Emotion crystals */}
      <div className="absolute inset-0">
        {emotions.map((emotion) => (
          <div
            key={emotion.id}
            className="absolute cursor-pointer transition-all duration-300 hover:scale-110"
            style={{
              left: `${emotion.position.x}%`,
              top: `${emotion.position.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={() => handleEmotionClick(emotion)}
          >
            <div
              className={`relative w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center transition-all duration-500 ${
                emotion.unlocked
                  ? 'opacity-50 scale-75'
                  : 'opacity-100 animate-pulse hover:animate-none'
              }`}
              style={{
                backgroundColor: emotion.color,
                boxShadow: emotion.unlocked
                  ? `0 0 20px ${emotion.color}`
                  : `0 0 40px ${emotion.color}, 0 0 80px ${emotion.color}`
              }}
            >
              {emotion.unlocked && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl">✓</span>
                </div>
              )}
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <p className="text-white text-sm md:text-base font-lora text-center">
                  {emotion.name}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Diálogo de emoción seleccionada */}
      {selectedEmotion && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black bg-opacity-80">
          <div className="relative bg-turquoise-800 rounded-2xl p-8 md:p-12 max-w-2xl mx-4 border-2 border-turquoise-400">
            <h2
              className="font-lora text-3xl md:text-4xl font-bold mb-4"
              style={{ color: selectedEmotion.color }}
            >
              {selectedEmotion.name}
            </h2>
            <p className="text-xl md:text-2xl text-white opacity-90 mb-4">
              {selectedEmotion.description}
            </p>
            <p className="text-lg md:text-xl text-white opacity-80 mb-4">
              {selectedEmotion.message}
            </p>
            {selectedEmotion.sectionId === 'team' && (
              <p className="text-base text-white opacity-70 mb-6 italic">
                By completing this therapy, the team page will be unlocked.
              </p>
            )}
            {selectedEmotion.sectionId === 'games-section' && (
              <p className="text-base text-white opacity-70 mb-6 italic">
                By completing this therapy, the games page will be unlocked.
              </p>
            )}
            {selectedEmotion.sectionId === 'newsletter' && (
              <p className="text-base text-white opacity-70 mb-6 italic">
                By completing this therapy, newsletter access will be unlocked.
              </p>
            )}

            {/* Minigames according to emotion */}
            {selectedEmotion.id === 'hope' && gameData && (
              <div className="mb-6">
                <p className="text-white text-lg mb-4 text-center">
                  Follow the light: Click the points in order (1 → 2 → 3 → 4 → 5)
                </p>
                <div className="flex justify-center gap-4 flex-wrap">
                  {[1, 2, 3, 4, 5].map((num) => {
                    const isCompleted = userSequenceRef.current.includes(num);
                    const isNext = userSequenceRef.current.length === num - 1;
                    return (
                      <button
                        key={num}
                        onClick={() => handleGameAction('click', num)}
                        className={`w-16 h-16 rounded-full text-2xl font-bold transition-all ${
                          isCompleted
                            ? 'bg-green-500 opacity-50'
                            : isNext
                            ? 'bg-yellow-400 animate-pulse scale-110'
                            : 'bg-white bg-opacity-20 hover:bg-opacity-40'
                        } ${gameData.error ? 'animate-shake' : ''}`}
                        style={{
                          boxShadow: isNext ? `0 0 20px ${selectedEmotion.color}` : 'none'
                        }}
                      >
                        {num}
                      </button>
                    );
                  })}
                </div>
                {gameProgress > 0 && (
                  <div className="mt-4">
                    <div className="w-full bg-black bg-opacity-50 rounded-full h-3">
                      <div
                        className="h-3 rounded-full transition-all duration-300"
                        style={{
                          width: `${gameProgress}%`,
                          backgroundColor: selectedEmotion.color
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedEmotion.id === 'courage' && gameData && (
              <div className="mb-6">
                <p className="text-white text-lg mb-4 text-center">
                  Hold to demonstrate your courage
                </p>
                <div className="flex flex-col items-center gap-4">
                  <button
                    onMouseDown={() => handleGameAction('holdStart')}
                    onMouseUp={() => handleGameAction('holdEnd')}
                    onMouseLeave={() => handleGameAction('holdEnd')}
                    onTouchStart={() => handleGameAction('holdStart')}
                    onTouchEnd={() => handleGameAction('holdEnd')}
                    className={`w-32 h-32 rounded-full text-2xl font-bold transition-all ${
                      gameProgress > 0 ? 'scale-110' : ''
                    }`}
                    style={{
                      backgroundColor: selectedEmotion.color,
                      boxShadow: `0 0 40px ${selectedEmotion.color}`
                    }}
                  >
                    {gameProgress >= 100 ? '✓' : 'Hold'}
                  </button>
                  {gameProgress > 0 && (
                    <div className="w-full max-w-xs bg-black bg-opacity-50 rounded-full h-4">
                      <div
                        className="h-4 rounded-full transition-all duration-100"
                        style={{
                          width: `${gameProgress}%`,
                          backgroundColor: selectedEmotion.color
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedEmotion.id === 'connection' && gameData && (
              <div className="mb-6">
                <p className="text-white text-lg mb-4 text-center">
                  Connect the points in order: A → B → C → D
                </p>
                <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                  {['A', 'B', 'C', 'D'].map((letter, idx) => {
                    const num = idx + 1;
                    const isCompleted = userSequenceRef.current.includes(num);
                    const isNext = userSequenceRef.current.length === idx;
                    return (
                      <button
                        key={letter}
                        onClick={() => handleGameAction('click', num)}
                        className={`w-20 h-20 rounded-full text-xl font-bold transition-all ${
                          isCompleted
                            ? 'bg-green-500 opacity-50'
                            : isNext
                            ? 'bg-yellow-400 animate-pulse scale-110'
                            : 'bg-white bg-opacity-20 hover:bg-opacity-40'
                        } ${gameData.error ? 'animate-shake' : ''}`}
                        style={{
                          boxShadow: isNext ? `0 0 20px ${selectedEmotion.color}` : 'none'
                        }}
                      >
                        {letter}
                      </button>
                    );
                  })}
                </div>
                {gameProgress > 0 && (
                  <div className="mt-4">
                    <div className="w-full bg-black bg-opacity-50 rounded-full h-3">
                      <div
                        className="h-3 rounded-full transition-all duration-300"
                        style={{
                          width: `${gameProgress}%`,
                          backgroundColor: selectedEmotion.color
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedEmotion.id === 'healing' && gameData && (
              <div className="mb-6">
                <p className="text-white text-lg mb-4 text-center">
                  Follow the breathing rhythm: Click when the circle expands (every ~1 second)
                </p>
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <button
                      onClick={() => handleGameAction('click')}
                      className={`w-32 h-32 rounded-full text-2xl font-bold transition-all ${
                        gameData.error ? 'animate-shake bg-red-500' : ''
                      }`}
                      style={{
                        backgroundColor: selectedEmotion.color,
                        boxShadow: `0 0 40px ${selectedEmotion.color}`,
                        animation: gameData.clicks < gameData.target ? 'pulse 1s infinite' : 'none',
                        transform: gameData.error ? 'scale(0.9)' : 'scale(1)'
                      }}
                    >
                      {gameData.clicks >= gameData.target ? '✓' : 'Breathe'}
                    </button>
                    {gameData.clicks > 0 && gameData.clicks < gameData.target && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div
                          className="absolute w-32 h-32 rounded-full border-4 opacity-30 animate-ping"
                          style={{
                            borderColor: selectedEmotion.color,
                            animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite'
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-white text-sm">
                    Correct clicks: {gameData.clicks} / {gameData.target}
                  </p>
                  {gameData.error && (
                    <p className="text-red-400 text-sm animate-pulse">
                      Incorrect rhythm. Try to follow the pulse.
                    </p>
                  )}
                  {gameProgress > 0 && (
                    <div className="w-full max-w-xs bg-black bg-opacity-50 rounded-full h-3">
                      <div
                        className="h-3 rounded-full transition-all duration-300"
                        style={{
                          width: `${gameProgress}%`,
                          backgroundColor: selectedEmotion.color
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {gameState === 'success' && (
              <div className="mb-6 text-center">
                <p className="text-2xl font-bold text-green-400 animate-pulse mb-4">
                  ¡Emoción desbloqueada!
                </p>
                <p className="text-white text-lg opacity-80 mb-4">
                  Puedes continuar explorando otras emociones o cerrar este diálogo cuando quieras.
                </p>
                {selectedEmotion.sectionId === 'welcome' && (
                  <Link href="/home" className="inline-block">
                    <Button label="GO TO HOME" />
                  </Link>
                )}
                {selectedEmotion.sectionId === 'team' && (
                  <Link href="/team" className="inline-block">
                    <Button label="GO TO TEAM" />
                  </Link>
                )}
                {selectedEmotion.sectionId === 'games-section' && (
                  <Link href="/games/heartweaver" className="inline-block">
                    <Button label="GO TO GAMES" />
                  </Link>
                )}
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setSelectedEmotion(null);
                  setGameState('idle');
                  setGameProgress(0);
                  setGameData(null);
                  if (holdButtonRef.current) {
                    clearInterval(holdButtonRef.current);
                    holdButtonRef.current = null;
                  }
                }}
                className="text-white text-xl font-lora opacity-60 hover:opacity-100 transition-opacity underline"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Skip button (optional, user can use X to close) */}
      <button
        onClick={skipJourney}
        className="absolute bottom-8 right-8 z-20 text-white text-lg font-lora opacity-60 hover:opacity-100 transition-opacity underline"
        title="Skip and unlock everything"
      >
        Skip journey
      </button>
    </div>
  );
}
