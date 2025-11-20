'use client';

import { useState, useRef, useEffect } from 'react';
import Button from '../Button';
import { useAudio } from '@/hooks/useAudio';

interface HealingMinigameProps {
  onComplete: () => void;
  onClose: () => void;
}

export default function HealingMinigame({ onComplete, onClose }: HealingMinigameProps) {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'success'>('idle');
  const [gameProgress, setGameProgress] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [error, setError] = useState(false);
  const lastClickRef = useRef<number>(Date.now());
  const [targetClicks, setTargetClicks] = useState(5);
  const [rhythmWindow, setRhythmWindow] = useState({ min: 600, max: 1400 });
  const [circleSize, setCircleSize] = useState(192);
  const [pulseScale, setPulseScale] = useState(1);
  const [canClick, setCanClick] = useState(false);
  const [targetRhythm, setTargetRhythm] = useState(1000);
  const pulseIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pulseStartTimeRef = useRef<number>(Date.now());
  const targetRhythmRef = useRef<number>(1000);
  const clickedInWindowRef = useRef<boolean>(false); // Track if user clicked during the current click window
  const previousCanClickRef = useRef<boolean>(false); // Track previous canClick state
  const clicksRef = useRef<number>(0); // Track clicks count for interval access
  const gameStateRef = useRef<'idle' | 'playing' | 'success'>('idle'); // Track game state for interval access
  const lastClickTimeRef = useRef<number>(0); // Track when the last click happened
  const lastSuccessfulClickTimeRef = useRef<number>(0); // Track when the last successful click happened
  const { playMinigameSound } = useAudio();

  useEffect(() => {
    setGameState('playing');
    gameStateRef.current = 'playing';
    setClicks(0);
    clicksRef.current = 0;
    setGameProgress(0);
    
    // Play minigame sound
    playMinigameSound('healing');
    setCanClick(true); // First click is always valid
    const now = Date.now();
    lastClickRef.current = now;
    lastSuccessfulClickTimeRef.current = now;
    
    // Randomize game parameters for variety
    const randomTargetClicks = Math.floor(Math.random() * 3) + 4; // 4-6 clicks
    const baseRhythm = Math.floor(Math.random() * 300) + 700; // 700-1000ms base
    const rhythmVariation = Math.floor(Math.random() * 200) + 200; // 200-400ms variation
    const randomCircleSize = Math.floor(Math.random() * 48) + 160; // 160-208px
    
    const targetRhythmValue = baseRhythm;
    
    setTargetClicks(randomTargetClicks);
    setRhythmWindow({ 
      min: baseRhythm - rhythmVariation, 
      max: baseRhythm + rhythmVariation 
    });
    setTargetRhythm(targetRhythmValue);
    targetRhythmRef.current = targetRhythmValue; // Store in ref for interval access
    setCircleSize(randomCircleSize);
    
    // Start the pulse animation synchronized with target rhythm
    pulseStartTimeRef.current = Date.now();
    const startPulse = () => {
      const pulseInterval = setInterval(() => {
        const now = Date.now();
        const elapsed = now - pulseStartTimeRef.current;
        const currentTargetRhythm = targetRhythmRef.current;
        
        // Ensure elapsed is positive and handle edge cases
        const safeElapsed = Math.max(0, elapsed);
        const cycleProgress = (safeElapsed % currentTargetRhythm) / currentTargetRhythm;
        const phase = cycleProgress * Math.PI * 2;
        
        // Pulse between 1.0 and 1.3, peaking at the target rhythm
        // Start from scale 1.0 (minimum) when cycle starts
        const scale = 1 + Math.sin(phase) * 0.3;
        setPulseScale(scale);
        
        // Determine if we're in the "click window" (when pulse is near peak)
        // Allow clicks in the top 40% of the pulse cycle (when sin is high)
        const isClickWindow = Math.sin(phase) > 0.6;
        
        // Check if we just entered a click window (transition from false to true)
        if (isClickWindow && !previousCanClickRef.current) {
          // Reset the click flag for this new window
          // Only reset if enough time has passed since last successful click
          const timeSinceLastSuccessfulClick = now - lastSuccessfulClickTimeRef.current;
          const minTimeSinceClick = targetRhythmRef.current * 0.5; // Wait at least 50% of rhythm before checking for new window
          
          if (timeSinceLastSuccessfulClick > minTimeSinceClick) {
            clickedInWindowRef.current = false;
          }
        }
        
        // Check if we just left a click window (transition from true to false)
        if (!isClickWindow && previousCanClickRef.current) {
          // Only check for missed click if enough time has passed since last successful click
          // This prevents false positives when user clicks correctly
          const timeSinceLastSuccessfulClick = now - lastSuccessfulClickTimeRef.current;
          const minTimeBetweenClicks = targetRhythmRef.current * 0.8; // At least 80% of rhythm must pass before checking for missed click
          
          // If user didn't click during the window and has already made at least one click, they lose
          // But only if enough time has passed since the last successful click (to avoid false positives)
          if (!clickedInWindowRef.current && clicksRef.current > 0 && gameStateRef.current === 'playing' && timeSinceLastSuccessfulClick > minTimeBetweenClicks) {
            // User missed the click window - restart
            setClicks(0);
            clicksRef.current = 0;
            setGameProgress(0);
            const resetTime = Date.now();
            lastClickRef.current = resetTime;
            lastClickTimeRef.current = resetTime;
            lastSuccessfulClickTimeRef.current = resetTime;
            setError(true);
            setTimeout(() => setError(false), 500);
          }
        }
        
        previousCanClickRef.current = isClickWindow;
        setCanClick(isClickWindow);
      }, 16); // ~60fps
      
      pulseIntervalRef.current = pulseInterval;
    };
    
    startPulse();
    
    return () => {
      if (pulseIntervalRef.current) {
        clearInterval(pulseIntervalRef.current);
      }
    };
  }, []);

  const handleClick = () => {
    if (gameState !== 'playing') return;

    const now = Date.now();
    const timeSinceLastClick = now - lastClickRef.current;
    
    // Mark that user clicked during the current window
    clickedInWindowRef.current = true;
    lastClickTimeRef.current = now;
    
    // First click is always valid
    if (clicks === 0) {
      const newClicks = clicks + 1;
      setClicks(newClicks);
      clicksRef.current = newClicks;
      setGameProgress((newClicks / targetClicks) * 100);
      lastClickRef.current = now;
      lastSuccessfulClickTimeRef.current = now;
      setError(false);
      
      if (newClicks >= targetClicks) {
        setGameState('success');
        gameStateRef.current = 'success';
        setTimeout(() => {
          onComplete();
        }, 1000);
      }
      return;
    }
    
    // Must click within the rhythm window
    if (timeSinceLastClick >= rhythmWindow.min && timeSinceLastClick <= rhythmWindow.max) {
      const newClicks = clicks + 1;
      setClicks(newClicks);
      clicksRef.current = newClicks;
      setGameProgress((newClicks / targetClicks) * 100);
      lastClickRef.current = now;
      lastSuccessfulClickTimeRef.current = now; // Update successful click time
      setError(false);
      
      if (newClicks >= targetClicks) {
        setGameState('success');
        gameStateRef.current = 'success';
        setTimeout(() => {
          onComplete();
        }, 1000);
      }
    } else {
      // Incorrect rhythm: restart
      setClicks(0);
      clicksRef.current = 0;
      setGameProgress(0);
      lastClickRef.current = now;
      lastClickTimeRef.current = now;
      lastSuccessfulClickTimeRef.current = now;
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      <div className="relative bg-turquoise-800 rounded-2xl p-10 md:p-16 max-w-3xl mx-4 border-2 border-turquoise-400 w-full min-h-[700px] h-[700px] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-3xl font-bold opacity-60 hover:opacity-100 transition-opacity w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-10"
        >
          ×
        </button>

        <div className="text-center mb-10 flex-shrink-0">
          <h2 className="font-lora text-3xl md:text-4xl font-bold text-turquoise-400 mb-4">
            Healing: Breathing Rhythm
          </h2>
          <p className="text-white opacity-80">
            Click following the rhythmic pulse
          </p>
        </div>

        {gameState === 'success' ? (
          <div className="text-center flex-1 flex items-center justify-center">
            <div>
              <p className="text-green-400 text-2xl font-bold mb-4">Completed!</p>
              <p className="text-white opacity-80">You have found your healing rhythm</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-center">
            <div className="mb-8 flex-shrink-0">
              <div className="w-full bg-gray-700 rounded-full h-4">
                <div
                  className="bg-turquoise-400 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${gameProgress}%` }}
                />
              </div>
              <p className="text-white text-sm mt-2 text-center">
                Correct clicks: {clicks} / {targetClicks}
              </p>
            </div>

            <div className="flex flex-col items-center gap-8 flex-1 justify-center min-h-[400px]">
              {/* Visual pulse indicator */}
              <div className="relative flex items-center justify-center" style={{ minHeight: '400px', minWidth: '400px' }}>
                {/* Outer pulse ring */}
                <div
                  className="absolute rounded-full border-4 border-turquoise-400 opacity-30"
                  style={{
                    width: `${circleSize * pulseScale * 1.5}px`,
                    height: `${circleSize * pulseScale * 1.5}px`,
                    transition: 'all 0.1s ease-out'
                  }}
                />
                {/* Middle pulse ring */}
                <div
                  className="absolute rounded-full border-2 border-turquoise-300 opacity-50"
                  style={{
                    width: `${circleSize * pulseScale * 1.2}px`,
                    height: `${circleSize * pulseScale * 1.2}px`,
                    transition: 'all 0.1s ease-out'
                  }}
                />
                {/* Main button */}
                <button
                  onClick={handleClick}
                  className={`rounded-full text-xl font-bold transition-all relative z-10 ${
                    error
                      ? 'bg-red-500 text-white'
                      : canClick
                      ? 'bg-turquoise-400 text-black hover:bg-turquoise-300 shadow-lg shadow-turquoise-400/50'
                      : 'bg-turquoise-600 text-black opacity-70'
                  }`}
                  style={{ 
                    width: `${circleSize * pulseScale}px`, 
                    height: `${circleSize * pulseScale}px`,
                    transition: 'all 0.1s ease-out'
                  }}
                >
                  {error ? 'Try again' : canClick ? 'Click now' : 'Wait...'}
                </button>
              </div>
              
              {/* Text indicator */}
              <div className="text-center flex-shrink-0">
                {canClick && !error && (
                  <p className="text-turquoise-400 text-lg font-bold animate-pulse">
                    Now!
                  </p>
                )}
                {!canClick && !error && clicks > 0 && (
                  <p className="text-white opacity-60 text-sm">
                    Follow the rhythm...
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

