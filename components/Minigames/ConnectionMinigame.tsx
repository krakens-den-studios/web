'use client';

import { useState, useRef, useEffect } from 'react';
import Button from '../Button';
import { useAudio } from '@/hooks/useAudio';

interface ConnectionMinigameProps {
  onComplete: () => void;
  onClose: () => void;
}

// List of words for the connection game - easy to add more in future updates
const WORDS = [
  'HOPE',
  'LOVE',
  'CALM',
  'KIND',
  'WARM',
  'SAFE',
  'HEAL',
  'JOY',
  'PEACE',
  'TRUST',
  'GROW',
  'OPEN',
  'CARE',
  'SOFT',
  'GENTLE',
  'BRAVE',
  'STRONG',
  'TRUE',
  'REAL',
  'FREE',
  'LIGHT',
  'DEEP',
  'QUIET',
  'STILL',
  'EASE',
  'REST',
  'GLOW',
  'FLOW',
  'RISE',
  'BEAM'
];

export default function ConnectionMinigame({ onComplete, onClose }: ConnectionMinigameProps) {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'success'>('idle');
  const [gameProgress, setGameProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState(false);
  const [selectedWord, setSelectedWord] = useState<string>('');
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const userSequenceRef = useRef<string[]>([]);
  const clickedIndicesRef = useRef<number[]>([]); // Track which shuffled letter indices have been clicked
  const [letterSize, setLetterSize] = useState(96);
  const { playMinigameSound } = useAudio();

  useEffect(() => {
    // Select a random word
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setSelectedWord(randomWord);
    
    // Convert word to array of letters and shuffle them
    const letters = randomWord.split('');
    const shuffled = [...letters].sort(() => Math.random() - 0.5);
    setShuffledLetters(shuffled);
    
    // Randomize letter button size for variety
    const randomLetterSize = Math.floor(Math.random() * 16) + 80; // 80-96px
    setLetterSize(randomLetterSize);
    
    setGameState('playing');
    userSequenceRef.current = [];
    clickedIndicesRef.current = [];
    setCurrentStep(0);
    setGameProgress(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLetterClick = (letter: string, shuffledIndex: number) => {
    if (gameState !== 'playing') return;
    
    // Check if this letter has already been clicked
    if (clickedIndicesRef.current.includes(shuffledIndex)) {
      return; // Ignore clicks on already used letters
    }

    const expectedLetter = selectedWord[userSequenceRef.current.length];
    if (letter === expectedLetter) {
      userSequenceRef.current.push(letter);
      clickedIndicesRef.current.push(shuffledIndex);
      const newStep = userSequenceRef.current.length;
      setCurrentStep(newStep);
      setGameProgress((newStep / selectedWord.length) * 100);
      setError(false);
      
      if (newStep === selectedWord.length) {
        playMinigameSound('connection');
        setGameState('success');
        setTimeout(() => {
          onComplete();
        }, 1000);
      }
    } else {
      // Error: restart
      userSequenceRef.current = [];
      clickedIndicesRef.current = [];
      setCurrentStep(0);
      setGameProgress(0);
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  const getLetterState = (letter: string, shuffledIndex: number) => {
    const currentExpectedIndex = userSequenceRef.current.length;
    const expectedLetter = selectedWord[currentExpectedIndex];
    const isNext = letter === expectedLetter;
    
    // Check if this specific letter instance has been clicked
    const isCompleted = clickedIndicesRef.current.includes(shuffledIndex);
    const isWrong = !isNext && !isCompleted && error;
    
    return { isNext, isCompleted, isWrong };
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center select-none">
      <div className="relative bg-turquoise-800 rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 max-w-2xl mx-2 sm:mx-4 border-2 border-turquoise-400 w-full h-[90vh] max-h-[90vh] flex flex-col overflow-hidden" style={{ minHeight: '500px', maxHeight: '90vh' }}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-3xl font-bold opacity-60 hover:opacity-100 transition-opacity w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-10 z-10 select-none"
        >
          ×
        </button>

        <div className="text-center mb-3 sm:mb-4 md:mb-6 flex-shrink-0 select-none">
          <h2 className="font-lora text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-turquoise-400 mb-2 sm:mb-4 select-none">
            Connection
          </h2>
        </div>

        {gameState === 'success' ? (
          <div className="text-center flex-1 flex items-center justify-center min-h-0 select-none">
            <div>
              <p className="text-green-400 text-lg sm:text-xl md:text-2xl font-bold mb-4 select-none">Completed!</p>
              <p className="text-white opacity-80 text-sm sm:text-base select-none">You formed: <span className="text-turquoise-400 font-bold">{selectedWord}</span></p>
              <p className="text-white opacity-80 mt-2 text-xs sm:text-sm select-none">You have established the connection</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-center min-h-0 overflow-y-auto">
            <div className="mb-4 sm:mb-6 flex-shrink-0 select-none">
              <div className="w-full bg-gray-700 rounded-full h-4">
                <div
                  className="bg-turquoise-400 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${gameProgress}%` }}
                />
              </div>
              <p className="text-white text-xs sm:text-sm mt-2 text-center select-none">
                Progress: {currentStep} / {selectedWord.length}
              </p>
              {error && (
                <p className="text-red-400 text-xs sm:text-sm mt-2 text-center animate-pulse select-none">
                  Incorrect order. Try again.
                </p>
              )}
            </div>

            <div className={`grid gap-2 sm:gap-3 md:gap-4 justify-items-center ${selectedWord.length <= 4 ? 'grid-cols-2' : selectedWord.length <= 6 ? 'grid-cols-3' : 'grid-cols-4'}`}>
              {shuffledLetters.map((letter, index) => {
                const { isCompleted, isWrong } = getLetterState(letter, index);
                
                return (
                  <button
                    key={`${letter}-${index}`}
                    onClick={() => handleLetterClick(letter, index)}
                    disabled={isCompleted}
                    className={`rounded-full text-sm sm:text-base md:text-lg lg:text-xl font-bold transition-all select-none flex items-center justify-center ${
                      isCompleted
                        ? 'bg-green-400 text-black opacity-60'
                        : isWrong && error
                        ? 'bg-red-400 text-black animate-shake'
                        : 'bg-gray-600 text-white hover:bg-gray-500'
                    }`}
                    style={{ 
                      width: `min(${letterSize}px, 20vw, 15vh)`, 
                      height: `min(${letterSize}px, 20vw, 15vh)`,
                      fontSize: `min(${letterSize * 0.3}px, 5vw, 4vh)`,
                      maxWidth: '100%',
                      maxHeight: '100%',
                      minWidth: '48px',
                      minHeight: '48px'
                    }}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
