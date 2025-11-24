'use client';

import { useState, useRef, useEffect } from 'react';
import Button from '../Button';
import { useAudio } from '@/hooks/useAudio';

interface CourageMinigameProps {
  onComplete: () => void;
  onClose: () => void;
}

export default function CourageMinigame({ onComplete, onClose }: CourageMinigameProps) {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'success'>('idle');
  const [gameProgress, setGameProgress] = useState(0);
  const holdButtonRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const [duration, setDuration] = useState(3000);
  const durationRef = useRef<number>(3000);
  const [buttonSize, setButtonSize] = useState(192);
  const { playMinigameSound } = useAudio();

  useEffect(() => {
    setGameState('playing');
    setGameProgress(0);
    
    // Randomize game parameters for variety
    const randomDuration = Math.floor(Math.random() * 1500) + 2500; // 2.5-4 seconds
    const randomButtonSize = Math.floor(Math.random() * 48) + 160; // 160-208px
    
    setDuration(randomDuration);
    durationRef.current = randomDuration; // Store in ref for interval access
    setButtonSize(randomButtonSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseDown = () => {
    if (gameState !== 'playing') return;
    
    // Clear any existing interval
    if (holdButtonRef.current) {
      clearInterval(holdButtonRef.current);
    }
    
    startTimeRef.current = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min((elapsed / durationRef.current) * 100, 100);
      setGameProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        holdButtonRef.current = null;
        // Ensure progress is exactly 100% before showing success
        setGameProgress(100);
        // Wait a bit for the visual to catch up, then show success
        setTimeout(() => {
          playMinigameSound('courage');
          setGameState('success');
          // Show success message for longer before completing
          setTimeout(() => {
            onComplete();
          }, 2000);
        }, 100);
      }
    }, 16); // ~60fps
    
    holdButtonRef.current = interval as any;
  };

  const handleMouseUp = () => {
    if (holdButtonRef.current) {
      clearInterval(holdButtonRef.current);
      holdButtonRef.current = null;
    }
    if (gameState === 'playing' && gameProgress < 100) {
      setGameProgress(0);
    }
  };

  useEffect(() => {
    return () => {
      if (holdButtonRef.current) {
        clearInterval(holdButtonRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      <div className="relative bg-turquoise-800 rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 max-w-2xl mx-2 sm:mx-4 border-2 border-turquoise-400 w-full h-[90vh] max-h-[90vh] flex flex-col overflow-hidden" style={{ minHeight: '500px', maxHeight: '90vh' }}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-3xl font-bold opacity-60 hover:opacity-100 transition-opacity w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-10"
        >
          ×
        </button>

        <div className="text-center mb-3 sm:mb-4 md:mb-6 flex-shrink-0">
          <h2 className="font-lora text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-turquoise-400 mb-2 sm:mb-4">
            Courage
          </h2>
        </div>

        {gameState === 'success' ? (
          <div className="text-center flex-1 flex items-center justify-center min-h-0">
            <div>
              <p className="text-green-400 text-lg sm:text-xl md:text-2xl font-bold mb-4">Completed!</p>
              <p className="text-white opacity-80 text-sm sm:text-base">You have shown courage</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-center min-h-0">
            <div className="mb-4 sm:mb-6 md:mb-8 flex-shrink-0">
              <div className="w-full bg-gray-700 rounded-full h-4 sm:h-6 md:h-8">
                <div
                  className="bg-turquoise-400 h-4 sm:h-6 md:h-8 rounded-full transition-all duration-100"
                  style={{ width: `${gameProgress}%` }}
                >
                </div>
              </div>
            </div>

            <div className="flex justify-center items-center flex-1 min-h-0">
              <button
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchEnd={handleMouseUp}
                className={`rounded-full text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold transition-all flex items-center justify-center ${
                  gameProgress > 0
                    ? 'bg-turquoise-400 text-black scale-110'
                    : 'bg-gray-600 text-white hover:bg-gray-500'
                }`}
                style={{ 
                  width: `min(${buttonSize}px, 50vw, 60vh)`, 
                  height: `min(${buttonSize}px, 50vw, 60vh)`,
                  minWidth: '120px',
                  minHeight: '120px',
                  maxWidth: '100%',
                  maxHeight: '100%'
                }}
              >
                {gameProgress === 0 ? 'Hold' : 'Hold...'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

