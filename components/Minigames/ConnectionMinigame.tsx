'use client';

import { useState, useRef, useEffect } from 'react';
import Button from '../Button';

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
  const [letterSize, setLetterSize] = useState(96);

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
    setCurrentStep(0);
    setGameProgress(0);
  }, []);

  const handleLetterClick = (letter: string) => {
    if (gameState !== 'playing') return;

    const expectedLetter = selectedWord[userSequenceRef.current.length];
    if (letter === expectedLetter) {
      userSequenceRef.current.push(letter);
      const newStep = userSequenceRef.current.length;
      setCurrentStep(newStep);
      setGameProgress((newStep / selectedWord.length) * 100);
      setError(false);
      
      if (newStep === selectedWord.length) {
        setGameState('success');
        setTimeout(() => {
          onComplete();
        }, 1000);
      }
    } else {
      // Error: restart
      userSequenceRef.current = [];
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
    
    // Check if this letter has been completed (count how many times this letter should appear before current position)
    let completedCount = 0;
    for (let i = 0; i < currentExpectedIndex; i++) {
      if (selectedWord[i] === letter) {
        completedCount++;
      }
    }
    
    // Count how many times this letter appears in user sequence so far
    let userCount = 0;
    for (let i = 0; i < userSequenceRef.current.length; i++) {
      if (userSequenceRef.current[i] === letter) {
        userCount++;
      }
    }
    
    const isCompleted = userCount > 0 && userCount <= completedCount;
    const isWrong = !isNext && !isCompleted && error;
    
    return { isNext, isCompleted, isWrong };
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center select-none">
      <div className="relative bg-turquoise-800 rounded-2xl p-8 md:p-12 max-w-2xl mx-4 border-2 border-turquoise-400">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-3xl font-bold opacity-60 hover:opacity-100 transition-opacity w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-10 z-10 select-none"
        >
          ×
        </button>

        <div className="text-center mb-8 select-none">
          <h2 className="font-lora text-3xl md:text-4xl font-bold text-turquoise-400 mb-4 select-none">
            Connection: Connect the Word
          </h2>
          <p className="text-white opacity-80 select-none">
            Click the letters in order to form the word
          </p>
        </div>

        {gameState === 'success' ? (
          <div className="text-center select-none">
            <p className="text-green-400 text-2xl font-bold mb-4 select-none">Completed!</p>
            <p className="text-white opacity-80 select-none">You formed: <span className="text-turquoise-400 font-bold">{selectedWord}</span></p>
            <p className="text-white opacity-80 mt-2 select-none">You have established the connection</p>
          </div>
        ) : (
          <>
            <div className="mb-6 select-none">
              <div className="w-full bg-gray-700 rounded-full h-4">
                <div
                  className="bg-turquoise-400 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${gameProgress}%` }}
                />
              </div>
              <p className="text-white text-sm mt-2 text-center select-none">
                Progress: {currentStep} / {selectedWord.length}
              </p>
              {error && (
                <p className="text-red-400 text-sm mt-2 text-center animate-pulse select-none">
                  Incorrect order. Try again.
                </p>
              )}
            </div>

            <div className={`grid gap-4 ${selectedWord.length <= 4 ? 'grid-cols-2' : selectedWord.length <= 6 ? 'grid-cols-3' : 'grid-cols-4'}`}>
              {shuffledLetters.map((letter, index) => {
                const { isCompleted, isWrong } = getLetterState(letter, index);
                
                return (
                  <button
                    key={`${letter}-${index}`}
                    onClick={() => handleLetterClick(letter)}
                    className={`rounded-full text-2xl md:text-3xl font-bold transition-all select-none ${
                      isCompleted
                        ? 'bg-green-400 text-black opacity-60'
                        : isWrong && error
                        ? 'bg-red-400 text-black animate-shake'
                        : 'bg-gray-600 text-white hover:bg-gray-500'
                    }`}
                    style={{ 
                      width: `${letterSize}px`, 
                      height: `${letterSize}px`,
                      fontSize: `${letterSize * 0.3}px`
                    }}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
