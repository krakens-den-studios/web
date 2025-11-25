'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { RiEmotionLine } from 'react-icons/ri';
import FloatingText from './FloatingText';
import { useAudio } from '@/hooks/useAudio';
import { usePathname } from 'next/navigation';
import { useUnlockedPages } from '@/hooks/useUnlockedPages';
import { cookieStorage } from '@/utils/cookieStorage';
import { calculateTotalKps, deserializeAgents, deserializeUnlockables, resolveManualCollectionTier } from '@/shared/gameData';

interface Octopus {
  id: string;
  x: number;
  y: number;
  collected: boolean;
  size: number;
  collectedAt?: number; // Timestamp cuando fue recolectado
  fading: boolean; // Si está en proceso de fade out
  createdAt: number; // Timestamp cuando fue creado
  particles?: Array<{ angle: number; distance: number }>; // Partículas para el efecto
}

interface FloatingTextData {
  id: string;
  value: number;
  x: number;
  y: number;
}

interface OctopusCollectorProps {
  onCollect: (octopusId: string) => void;
  collectedOctopuses: string[];
}

export default function OctopusCollector({ onCollect, collectedOctopuses }: OctopusCollectorProps) {
  const [octopuses, setOctopuses] = useState<Octopus[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingTextData[]>([]);
  const floatingIdRef = useRef(0);
  const { playCollect } = useAudio();
  const pathname = usePathname();
  const { unlockedPages } = useUnlockedPages();
  const generateFloatingId = useCallback((baseId: string, timestamp: number = Date.now()) => {
    floatingIdRef.current += 1;
    return `floating-${baseId}-${timestamp}-${floatingIdRef.current}`;
  }, []);
  
  // Check if shop was just closed using a timestamp stored in cookies
  const wasShopJustClosed = useCallback(() => {
    if (typeof window === 'undefined') return false;
    const shopClosedTime = cookieStorage.getItem('shop-closed-time');
    if (!shopClosedTime) return false;
    const timeSinceClose = Date.now() - parseInt(shopClosedTime, 10);
    // Consider "just closed" if less than 1 second ago (minimum delay)
    return timeSinceClose < 1000;
  }, []);
  
  // Check if current page is unlocked and calculate spawn rate and max limit
  const getSpawnInfo = useCallback(() => {
    const unlockedCount = Object.values(unlockedPages).filter(Boolean).length;
    
    // Root page always allows krakenlings
    if (pathname === '/') {
      const multiplier = unlockedCount;
      const maxLimit = 10;
      return { shouldSpawn: true, multiplier, maxLimit };
    }
    
    // Check if on an unlocked page
    const isOnUnlockedPage = 
      (pathname === '/home' && unlockedPages.home) ||
      (pathname === '/games/heartweaver' && unlockedPages.games) ||
      (pathname === '/team' && unlockedPages.team) ||
      (pathname === '/contact' && unlockedPages.contact);
    
    if (!isOnUnlockedPage) {
      return { shouldSpawn: false, multiplier: 0, maxLimit: 0 };
    }
    
    // Calculate multiplier based on unlocked pages
    let multiplier = unlockedCount; // Base +1 for each unlocked page
    
    // Calculate max limit: base 10 + 10 per unlocked page + 10 if on specific unlocked page
    let maxLimit = 10;
    if (pathname === '/home' && unlockedPages.home) maxLimit += 10;
    if (pathname === '/games/heartweaver' && unlockedPages.games) maxLimit += 20;
    if (pathname === '/team' && unlockedPages.team) maxLimit += 30;
    if (pathname === '/contact' && unlockedPages.contact) maxLimit += 40;
    
    return { shouldSpawn: true, multiplier, maxLimit };
  }, [unlockedPages, pathname]);

  const generateOctopus = useCallback((): Octopus => {
    const now = Date.now();
    return {
      id: `octopus-${now}-${Math.random()}`,
      x: Math.random() * 90 + 5, // Entre 5% y 95%
      y: Math.random() * 90 + 5,
      collected: false,
      size: 35, // Fixed size - always the maximum size
      fading: false,
      createdAt: now
    };
  }, []);

  useEffect(() => {
    // Always start with empty array
    setOctopuses([]);
    
    const spawnInfo = getSpawnInfo();
    
    if (!spawnInfo.shouldSpawn) {
      // Clear all krakenlings if not on an unlocked page
      return;
    }
    
    const multiplier = spawnInfo.multiplier;
    const maxLimit = spawnInfo.maxLimit;
    
    // Check if shop was just closed
    const shopJustClosed = wasShopJustClosed();
    
    // Calculate delay before starting to spawn
    let spawnDelay = 0;
    if (shopJustClosed) {
      // If shop was just closed, wait at least 1 second before spawning
      const shopClosedTime = typeof window !== 'undefined' ? cookieStorage.getItem('shop-closed-time') : null;
      if (shopClosedTime) {
        const timeSinceClose = Date.now() - parseInt(shopClosedTime, 10);
        const remainingDelay = Math.max(0, 1000 - timeSinceClose);
        spawnDelay = remainingDelay;
        
        // Clear the timestamp after checking
        if (typeof window !== 'undefined') {
          cookieStorage.removeItem('shop-closed-time');
        }
      }
    } else {
      // Normal behavior: generate initial krakenlings after a small delay
      spawnDelay = 100;
    }
    
    // Generate initial krakenlings after delay (only a few, not up to maxLimit)
    const initialSpawnTimeout = setTimeout(() => {
      if (!shopJustClosed || spawnDelay >= 1000) {
        const initialSpawnCount = 1; // Always spawn only 3 initially
        const initialOctopuses = Array.from({ length: initialSpawnCount }, () => generateOctopus());
        setOctopuses(initialOctopuses);
      }
    }, spawnDelay);

    // Generate new krakenlings - slower spawn rate with reduced multiplier effect
    // Also delay the interval start if shop was just closed
    const baseInterval = 5000 + Math.random() * 3000; // Increased from 3000-5000ms to 5000-8000ms
    const intervalStartDelay = shopJustClosed ? Math.max(1000, spawnDelay) : 0;
    
    // Reduce multiplier effect on spawn rate (use square root for slower growth)
    const spawnRateMultiplier = 1 + (multiplier - 1) * 0.3; // Only 30% of multiplier effect
    
    let intervalId: NodeJS.Timeout | null = null;
    const intervalTimeout = setTimeout(() => {
      intervalId = setInterval(() => {
        const currentSpawnInfo = getSpawnInfo();
        if (!currentSpawnInfo.shouldSpawn) {
          // Stop spawning if page is no longer unlocked
          setOctopuses([]);
          return;
        }
        
        setOctopuses(prev => {
          // Clean up krakenlings that have completely disappeared
          const active = prev.filter(o => !o.fading || (o.collectedAt && Date.now() - o.collectedAt < 2000));
          const currentMaxLimit = currentSpawnInfo.maxLimit;
          // Only spawn if we haven't reached the max limit
          if (active.length < currentMaxLimit) {
            return [...active, generateOctopus()];
          }
          return active;
        });
      }, baseInterval / spawnRateMultiplier); // Slower spawn with reduced multiplier effect
    }, intervalStartDelay);

    return () => {
      clearTimeout(initialSpawnTimeout);
      clearTimeout(intervalTimeout);
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [generateOctopus, getSpawnInfo, wasShopJustClosed]);



  // Clean up krakenlings that have finished fading out (only collected ones)
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setOctopuses(prev => prev.filter(o => {
        // Only remove collected krakenlings after animation completes
        if (o.fading && o.collectedAt) {
          const timeSinceFadeStart = Date.now() - o.collectedAt;
          // Remove after 300ms animation
          return timeSinceFadeStart < 300;
        }
        // Never remove uncollected krakenlings automatically
        return true;
      }));
    }, 100);

    return () => clearInterval(cleanupInterval);
  }, []);

  // Listen for shop open/close events
  useEffect(() => {
    const handleShopOpen = () => {
      // Clear all krakenlings when shop opens
      setOctopuses([]);
      if (typeof window !== 'undefined') {
        cookieStorage.removeItem('shop-closed-time');
      }
    };

    const handleShopClose = () => {
      // Mark timestamp when shop closes
      if (typeof window !== 'undefined') {
        cookieStorage.setItem('shop-closed-time', Date.now().toString());
      }
    };

    window.addEventListener('shopOpened', handleShopOpen);
    window.addEventListener('shopClosed', handleShopClose);

    return () => {
      window.removeEventListener('shopOpened', handleShopOpen);
      window.removeEventListener('shopClosed', handleShopClose);
    };
  }, []);

  const handleOctopusClick = (octopus: Octopus) => {
    if (!octopus.collected && !collectedOctopuses.includes(octopus.id) && !octopus.fading) {
      let collectionValue = 1;
      let hasCollectAll = false;
      try {
        if (typeof window !== 'undefined') {
          const { state: unlockables } = deserializeUnlockables(cookieStorage.getItem('unlockables-progress'));
          const tier = resolveManualCollectionTier(unlockables);
          if (tier.kind === 'flat') {
            collectionValue = tier.value;
          } else {
            const { state: agents } = deserializeAgents(cookieStorage.getItem('agents-progress'));
            const totalKps = calculateTotalKps(agents, unlockables);
            collectionValue = Math.max(1, Math.floor(totalKps * tier.percent));
          }
          
          // Check if collect-all upgrade is unlocked
          const collectAllUpgrade = unlockables.find(u => u.id === 'collect-all');
          hasCollectAll = collectAllUpgrade?.unlocked || false;
        }
      } catch (e) {
        // Ignore errors
      }
      
      // If collect-all is active, collect all krakenlings on the page
      if (hasCollectAll) {
        const now = Date.now();
        const batchToCollect = octopuses.filter(o => !o.collected && !collectedOctopuses.includes(o.id) && !o.fading);
        if (batchToCollect.length === 0) {
          return;
        }
        
        const particles = Array.from({ length: 8 }, (_, i) => ({
          angle: (i * 360) / 8,
          distance: 0
        }));
        
        setOctopuses(prev => prev.map(o => {
          if (!o.collected && !collectedOctopuses.includes(o.id) && !o.fading) {
            return {
              ...o,
              collected: true,
              collectedAt: now,
              fading: true,
              particles
            };
          }
          return o;
        }));
        
        batchToCollect.forEach(o => {
          onCollect(o.id);
        });
        
        playCollect();
        
        setFloatingTexts(prevTexts => [
          ...prevTexts,
          ...batchToCollect.map(o => ({
            id: generateFloatingId(o.id, now),
            value: collectionValue,
            x: o.x,
            y: o.y
          }))
        ]);
        
        return;
      } else {
        // Normal collection - just this one
        onCollect(octopus.id);
        
        // Play collect sound
        playCollect();
        
        // Show floating text with value
        setFloatingTexts(prev => [...prev, {
          id: generateFloatingId(octopus.id),
          value: collectionValue,
          x: octopus.x,
          y: octopus.y
        }]);
        
        // Generar partículas para el efecto
        const particles = Array.from({ length: 8 }, (_, i) => ({
          angle: (i * 360) / 8, // Distribuir en círculo
          distance: 0
        }));
        
        // Mark as collected and start satisfying animation
        setOctopuses(prev => prev.map(o => 
          o.id === octopus.id ? { 
            ...o, 
            collected: true, 
            collectedAt: Date.now(),
            fading: true,
            particles: particles
          } : o
        ));
      }
    }
  };

  const removeFloatingText = (id: string) => {
    setFloatingTexts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <>
      {/* Floating texts - outside the pointer-events-none container */}
      {floatingTexts.map(text => (
        <FloatingText
          key={text.id}
          value={text.value}
          x={text.x}
          y={text.y}
          onComplete={() => removeFloatingText(text.id)}
        />
      ))}
      
      <div className="fixed inset-0 pointer-events-none z-[50]">
      {octopuses
        .filter(o => {
          // Mostrar pulpitos no recolectados
          if (!o.collected && !collectedOctopuses.includes(o.id)) {
            return true;
          }
          // Show collected krakenlings that are in animation process
          if (o.collected && o.fading && o.collectedAt) {
            const timeSinceFadeStart = Date.now() - o.collectedAt;
            return timeSinceFadeStart < 300; // Mostrar durante la animación
          }
          return false;
        })
        .map((octopus) => {
          const isCollected = octopus.collected || collectedOctopuses.includes(octopus.id);
          const timeSinceFadeStart = octopus.fading && octopus.collectedAt ? Date.now() - octopus.collectedAt : 0;
          const fadeProgress = octopus.fading ? Math.min(timeSinceFadeStart / 300, 1) : 0; // Faster animation of 300ms
          
          // Satisfying effect: rotation and glow (without size change)
          const rotation = isCollected ? fadeProgress * 360 : 0; // Rota 360 grados
          const glowIntensity = isCollected ? (1 - fadeProgress) * 2 : 1; // Brillo que se intensifica y luego desaparece
          const opacity = isCollected ? 1 - fadeProgress * 0.8 : 1; // Desaparece gradualmente

          return (
            <div 
              key={octopus.id} 
              className="absolute pointer-events-auto z-[9999]"
              style={{
                left: `${octopus.x}%`,
                top: `${octopus.y}%`,
                transform: 'translate(-50%, -50%)',
                width: 0,
                height: 0
              }}
            >
              {/* Particles that come out */}
              {octopus.particles && octopus.fading && octopus.particles.map((particle, idx) => {
                const particleProgress = fadeProgress;
                const distance = particleProgress * 30; // Distancia reducida
                const angleRad = (particle.angle * Math.PI) / 180;
                const x = Math.cos(angleRad) * distance;
                const y = Math.sin(angleRad) * distance;
                const particleOpacity = 1 - particleProgress;
                const particleScale = 0.5 + particleProgress * 0.5;
                
                return (
                  <div
                    key={idx}
                    className="absolute w-1.5 h-1.5 rounded-full bg-turquoise-400"
                    style={{
                      left: `${x}px`,
                      top: `${y}px`,
                      transform: `scale(${particleScale})`,
                      opacity: particleOpacity,
                      boxShadow: `0 0 ${8 * particleOpacity}px rgba(17, 180, 187, ${particleOpacity})`
                    }}
                  />
                );
              })}
              
              {/* Main krakenling with satisfying effect */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleOctopusClick(octopus);
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                }}
                className={`flex items-center justify-center cursor-pointer p-0 m-0 bg-transparent border-none outline-none z-[10000] ${
                  isCollected ? '' : 'hover:scale-125 animate-bounce transition-transform duration-200 ease-out'
                }`}
                style={{
                  position: 'absolute',
                  left: `-${(octopus.size + 16) / 2}px`,
                  top: `-${(octopus.size + 16) / 2}px`,
                  width: `${octopus.size + 16}px`,
                  height: `${octopus.size + 16}px`,
                  opacity: opacity,
                  filter: `drop-shadow(0 0 ${10 * glowIntensity}px rgba(17, 180, 187, ${glowIntensity})) brightness(${1 + glowIntensity * 0.5})`
                }}
              >
                <RiEmotionLine
                  className="text-turquoise-400 pointer-events-none"
                  style={{
                    width: `${octopus.size}px`,
                    height: `${octopus.size}px`,
                    transform: `rotate(${rotation}deg)`,
                    transformOrigin: 'center center'
                  }}
                />
              </button>
              
              {/* Expansion ring */}
              {isCollected && (
                <div
                  className="absolute rounded-full border-2 border-turquoise-400"
                  style={{
                    left: `-${octopus.size / 2}px`,
                    top: `-${octopus.size / 2}px`,
                    width: `${octopus.size}px`,
                    height: `${octopus.size}px`,
                    transform: `scale(${1 + fadeProgress * 3})`,
                    opacity: (1 - fadeProgress) * 0.6
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

