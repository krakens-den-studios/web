'use client';

import { useState, useEffect, useCallback } from 'react';
import { RiEmotionLine } from 'react-icons/ri';

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

interface OctopusCollectorProps {
  onCollect: (octopusId: string) => void;
  collectedOctopuses: string[];
}

export default function OctopusCollector({ onCollect, collectedOctopuses }: OctopusCollectorProps) {
  const [octopuses, setOctopuses] = useState<Octopus[]>([]);

  const generateOctopus = useCallback((): Octopus => {
    const now = Date.now();
    return {
      id: `octopus-${now}-${Math.random()}`,
      x: Math.random() * 90 + 5, // Entre 5% y 95%
      y: Math.random() * 90 + 5,
      collected: false,
      size: Math.random() * 15 + 20, // Entre 20px y 35px
      fading: false,
      createdAt: now
    };
  }, []);

  useEffect(() => {
    // Generate initial krakenlings
    const initialOctopuses = Array.from({ length: 3 }, () => generateOctopus());
    setOctopuses(initialOctopuses);

    // Generate new krakenlings every 3-5 seconds
    const interval = setInterval(() => {
      setOctopuses(prev => {
        // Clean up krakenlings that have completely disappeared
        const active = prev.filter(o => !o.fading || (o.collectedAt && Date.now() - o.collectedAt < 2000));
        if (active.length < 5) { // Maximum 5 active krakenlings
          return [...active, generateOctopus()];
        }
        return active;
      });
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, [generateOctopus]);

  // Effect to handle automatic fade out after a time without collecting
  useEffect(() => {
    const fadeInterval = setInterval(() => {
      setOctopuses(prev => prev.map(o => {
        // If not collected and a lot of time has passed, start automatic fade out
        if (!o.collected && !o.fading) {
          const timeSinceCreated = Date.now() - o.createdAt;
          // Uncollected krakenlings disappear after 10 seconds
          if (timeSinceCreated >= 10000) {
            return { ...o, fading: true, collectedAt: Date.now() };
          }
        }
        // If collected by click, fade out already started immediately
        // We don't need to do anything else here
        return o;
      }));
    }, 50);

    return () => clearInterval(fadeInterval);
  }, []);

  // Clean up krakenlings that have finished fading out
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setOctopuses(prev => prev.filter(o => {
        if (o.fading && o.collectedAt) {
          const timeSinceFadeStart = Date.now() - o.collectedAt;
          // Eliminar después de 300ms de animación
          return timeSinceFadeStart < 300;
        }
        // Si no está fading pero lleva mucho tiempo sin recolectar, eliminarlo
        if (!o.collected && !o.fading) {
          const timeSinceCreated = Date.now() - o.createdAt;
          return timeSinceCreated < 12000; // Máximo 12 segundos (10s + 2s de margen)
        }
        return true;
      }));
    }, 100);

    return () => clearInterval(cleanupInterval);
  }, []);

  const handleOctopusClick = (octopus: Octopus) => {
    if (!octopus.collected && !collectedOctopuses.includes(octopus.id) && !octopus.fading) {
      onCollect(octopus.id);
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
  };

  return (
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
  );
}

