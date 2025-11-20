'use client';

import { useState, useRef, useEffect } from 'react';
import Button from '../Button';

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
  const [buttonSize, setButtonSize] = useState(192);

  useEffect(() => {
    setGameState('playing');
    setGameProgress(0);
    
    // Randomize game parameters for variety
    const randomDuration = Math.floor(Math.random() * 1500) + 2500; // 2.5-4 seconds
    const randomButtonSize = Math.floor(Math.random() * 48) + 160; // 160-208px
    
    setDuration(randomDuration);
    setButtonSize(randomButtonSize);
  }, []);

  const handleMouseDown = () => {
    if (gameState !== 'playing') return;
    
    startTimeRef.current = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setGameProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setGameState('success');
        setTimeout(() => {
          onComplete();
        }, 500);
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
      <div className="relative bg-turquoise-800 rounded-2xl p-8 md:p-12 max-w-2xl mx-4 border-2 border-turquoise-400">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-3xl font-bold opacity-60 hover:opacity-100 transition-opacity w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-10"
        >
          ×
        </button>

        <div className="text-center mb-8">
          <h2 className="font-lora text-3xl md:text-4xl font-bold text-turquoise-400 mb-4">
            Courage: Hold the Pressure
          </h2>
          <p className="text-white opacity-80">
            Hold the button until it fills
          </p>
        </div>

        {gameState === 'success' ? (
          <div className="text-center">
            <p className="text-green-400 text-2xl font-bold mb-4">Completed!</p>
            <p className="text-white opacity-80">You have shown courage</p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <div className="w-full bg-gray-700 rounded-full h-8">
                <div
                  className="bg-turquoise-400 h-8 rounded-full transition-all duration-100 flex items-center justify-center"
                  style={{ width: `${gameProgress}%` }}
                >
                  {gameProgress > 0 && (
                    <span className="text-black font-bold text-sm">
                      {Math.round(gameProgress)}%
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchEnd={handleMouseUp}
                className={`rounded-full text-2xl font-bold transition-all ${
                  gameProgress > 0
                    ? 'bg-turquoise-400 text-black scale-110'
                    : 'bg-gray-600 text-white hover:bg-gray-500'
                }`}
                style={{ width: `${buttonSize}px`, height: `${buttonSize}px` }}
              >
                {gameProgress === 0 ? 'Hold' : 'Hold...'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

