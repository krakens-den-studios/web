'use client';

import { useState, useRef, useEffect } from 'react';
import Button from '../Button';
import { useAudio } from '@/hooks/useAudio';

interface HopeMinigameProps {
  onComplete: () => void;
  onClose: () => void;
}

interface Point {
  id: number;
  x: number;
  y: number;
  completed: boolean;
}

export default function HopeMinigame({ onComplete, onClose }: HopeMinigameProps) {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'success'>('idle');
  const [gameProgress, setGameProgress] = useState(0);
  const [currentPointIndex, setCurrentPointIndex] = useState(0);
  const [points, setPoints] = useState<Point[]>([]);
  const [isHolding, setIsHolding] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const [numPoints, setNumPoints] = useState(5);
  const [pointSize, setPointSize] = useState(48);
  const [activationDistance, setActivationDistance] = useState(5);
  const { playMinigameSound } = useAudio();

  useEffect(() => {
    setGameState('playing');
    setGameProgress(0);
    setCurrentPointIndex(0);
    setIsHolding(false);
    
    // Randomize game parameters for variety
    const randomNumPoints = Math.floor(Math.random() * 4) + 4; // 4-7 points
    const randomPointSize = Math.floor(Math.random() * 16) + 40; // 40-56px
    const randomActivationDistance = Math.random() * 2 + 4; // 4-6%
    
    setNumPoints(randomNumPoints);
    setPointSize(randomPointSize);
    setActivationDistance(randomActivationDistance);
    
    // Generate random points - wait for game area to be rendered
    setTimeout(() => {
      if (gameAreaRef.current) {
        const newPoints: Point[] = [];
        const minDistance = 15; // Minimum distance between points in percentage
        
        for (let i = 0; i < randomNumPoints; i++) {
          let attempts = 0;
          let validPosition = false;
          let x = 0;
          let y = 0;
          
          // Try to find a position that doesn't overlap with existing points
          while (!validPosition && attempts < 100) {
            x = Math.random() * 80 + 10; // Between 10% and 90%
            y = Math.random() * 60 + 20; // Between 20% and 80%
            
            // Check distance from all existing points
            validPosition = newPoints.every(point => {
              const distance = Math.sqrt(
                Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2)
              );
              return distance >= minDistance;
            });
            
            attempts++;
          }
          
          newPoints.push({
            id: i,
            x: x,
            y: y,
            completed: false
          });
        }
        setPoints(newPoints);
      }
    }, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!gameAreaRef.current || gameState !== 'playing') return;
      
      const rect = gameAreaRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      // Clamp to valid range
      const clampedX = Math.max(0, Math.min(100, x));
      const clampedY = Math.max(0, Math.min(100, y));
      
      setMousePosition({ x: clampedX, y: clampedY });
      
      if (isHolding && currentPointIndex < points.length) {
        // Check if player passes through any point that is not the current one
        for (let i = 0; i < points.length; i++) {
          if (i !== currentPointIndex && !points[i].completed) {
            const point = points[i];
            const distance = Math.sqrt(
              Math.pow(clampedX - point.x, 2) + Math.pow(clampedY - point.y, 2)
            );
            
            // If player passes through a wrong point, they lose
            if (distance < activationDistance) {
              // Reset game
              const updatedPoints = points.map(p => ({ ...p, completed: false }));
              setPoints(updatedPoints);
              setCurrentPointIndex(0);
              setGameProgress(0);
              setIsHolding(false);
              return;
            }
          }
        }
        
        // Check if player reaches the correct current point
        const currentPoint = points[currentPointIndex];
        const distance = Math.sqrt(
          Math.pow(clampedX - currentPoint.x, 2) + Math.pow(clampedY - currentPoint.y, 2)
        );
        
        // If within activation distance, mark as completed and move to next
        if (distance < activationDistance && !currentPoint.completed) {
          const updatedPoints = points.map((p, idx) => 
            idx === currentPointIndex ? { ...p, completed: true } : p
          );
          setPoints(updatedPoints);
          
          const newIndex = currentPointIndex + 1;
          setCurrentPointIndex(newIndex);
          setGameProgress((newIndex / points.length) * 100);
          
          if (newIndex === points.length) {
            playMinigameSound('hope');
            setGameState('success');
            setTimeout(() => {
              onComplete();
            }, 1000);
          }
        }
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (gameState === 'playing' && gameAreaRef.current) {
        const rect = gameAreaRef.current.getBoundingClientRect();
        // Only start holding if click is within game area
        if (e.clientX >= rect.left && e.clientX <= rect.right && 
            e.clientY >= rect.top && e.clientY <= rect.bottom) {
          setIsHolding(true);
        }
      }
    };

    const handleMouseUp = () => {
      setIsHolding(false);
      // Reset if not completed
      if (gameState === 'playing' && currentPointIndex < points.length) {
        const updatedPoints = points.map(p => ({ ...p, completed: false }));
        setPoints(updatedPoints);
        setCurrentPointIndex(0);
        setGameProgress(0);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!gameAreaRef.current || gameState !== 'playing') return;
      e.preventDefault();
      const touch = e.touches[0];
      const rect = gameAreaRef.current.getBoundingClientRect();
      const x = ((touch.clientX - rect.left) / rect.width) * 100;
      const y = ((touch.clientY - rect.top) / rect.height) * 100;
      
      const clampedX = Math.max(0, Math.min(100, x));
      const clampedY = Math.max(0, Math.min(100, y));
      
      setMousePosition({ x: clampedX, y: clampedY });
      
      if (isHolding && currentPointIndex < points.length) {
        // Check if player passes through any point that is not the current one
        for (let i = 0; i < points.length; i++) {
          if (i !== currentPointIndex && !points[i].completed) {
            const point = points[i];
            const distance = Math.sqrt(
              Math.pow(clampedX - point.x, 2) + Math.pow(clampedY - point.y, 2)
            );
            
            // If player passes through a wrong point, they lose
            if (distance < activationDistance) {
              // Reset game
              const updatedPoints = points.map(p => ({ ...p, completed: false }));
              setPoints(updatedPoints);
              setCurrentPointIndex(0);
              setGameProgress(0);
              setIsHolding(false);
              return;
            }
          }
        }
        
        // Check if player reaches the correct current point
        const currentPoint = points[currentPointIndex];
        const distance = Math.sqrt(
          Math.pow(clampedX - currentPoint.x, 2) + Math.pow(clampedY - currentPoint.y, 2)
        );
        
        if (distance < activationDistance && !currentPoint.completed) {
          const updatedPoints = points.map((p, idx) => 
            idx === currentPointIndex ? { ...p, completed: true } : p
          );
          setPoints(updatedPoints);
          
          const newIndex = currentPointIndex + 1;
          setCurrentPointIndex(newIndex);
          setGameProgress((newIndex / points.length) * 100);
          
          if (newIndex === points.length) {
            setGameState('success');
            setTimeout(() => {
              onComplete();
            }, 1000);
          }
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (gameState === 'playing' && gameAreaRef.current) {
        const touch = e.touches[0];
        const rect = gameAreaRef.current.getBoundingClientRect();
        if (touch.clientX >= rect.left && touch.clientX <= rect.right && 
            touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
          setIsHolding(true);
        }
      }
    };

    const handleTouchEnd = () => {
      setIsHolding(false);
      if (gameState === 'playing' && currentPointIndex < points.length) {
        const updatedPoints = points.map(p => ({ ...p, completed: false }));
        setPoints(updatedPoints);
        setCurrentPointIndex(0);
        setGameProgress(0);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [gameState, isHolding, currentPointIndex, points, onComplete, activationDistance]);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center select-none">
      <div 
        className="relative bg-turquoise-800 rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 max-w-2xl mx-2 sm:mx-4 border-2 border-turquoise-400 w-full h-[90vh] max-h-[90vh] flex flex-col select-none overflow-hidden"
        style={{ minHeight: '500px', maxHeight: '90vh' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-3xl font-bold opacity-60 hover:opacity-100 transition-opacity w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-10 z-10 select-none"
        >
          ×
        </button>

        <div className="text-center mb-6 flex-shrink-0 select-none">
          <h2 className="font-lora text-3xl md:text-4xl font-bold text-turquoise-400 mb-4 select-none">
            Hope
          </h2>
        </div>

        {gameState === 'success' ? (
          <div className="text-center flex-1 flex items-center justify-center select-none min-h-0">
            <div>
              <p className="text-green-400 text-2xl font-bold mb-4 select-none">Completed!</p>
              <p className="text-white opacity-80 select-none">You have followed the light of hope</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 flex-shrink-0 select-none">
              <div className="w-full bg-gray-700 rounded-full h-4">
                <div
                  className="bg-turquoise-400 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${gameProgress}%` }}
                />
              </div>
              <p className="text-white text-sm mt-2 text-center select-none">
                Progress: {currentPointIndex} / {points.length}
              </p>
            </div>

            <div 
              ref={gameAreaRef}
              className={`relative w-full flex-1 border-2 border-turquoise-400 border-dashed rounded-lg overflow-hidden select-none min-h-0 ${isHolding ? 'cursor-crosshair' : 'cursor-default'}`}
              style={{ minHeight: 'min(300px, 40vh)', maxHeight: '100%' }}
            >
              {points.map((point, idx) => {
                const isCurrent = idx === currentPointIndex;
                const isCompleted = point.completed;
                const distance = isHolding ? Math.sqrt(
                  Math.pow(mousePosition.x - point.x, 2) + Math.pow(mousePosition.y - point.y, 2)
                ) : Infinity;
                const isNear = distance < activationDistance;
                
                return (
                  <div
                    key={point.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all"
                    style={{
                      left: `${point.x}%`,
                      top: `${point.y}%`,
                      zIndex: isCurrent ? 10 : 5
                    }}
                  >
                    <div
                      className={`rounded-full flex items-center justify-center text-sm sm:text-base md:text-lg lg:text-xl font-bold transition-all select-none ${
                        isCompleted
                          ? 'bg-green-400 text-black scale-150'
                          : isCurrent && isHolding && isNear
                          ? 'bg-turquoise-400 text-black scale-125 animate-pulse'
                          : isCurrent
                          ? 'bg-turquoise-400 text-black scale-110 animate-pulse'
                          : 'bg-gray-600 text-white opacity-50'
                      }`}
                      style={{ 
                        width: `min(${pointSize}px, 12vw)`, 
                        height: `min(${pointSize}px, 12vw)`,
                        minWidth: '32px',
                        minHeight: '32px'
                      }}
                    >
                      {idx + 1}
                    </div>
                  </div>
                );
              })}
              
              {isHolding && (
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
                  style={{
                    left: `${mousePosition.x}%`,
                    top: `${mousePosition.y}%`
                  }}
                >
                  <div className="w-8 h-8 rounded-full bg-white bg-opacity-50 border-2 border-turquoise-400"></div>
                </div>
              )}
            </div>

            <div className="text-center mt-4 flex-shrink-0 select-none">
              <p className="text-white text-sm select-none">
                {isHolding ? 'Hold and move to the points' : 'Hold your mouse button to start'}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
