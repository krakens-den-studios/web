'use client';

import { useEffect, useRef, useState } from 'react';

const UNLOCKABLES_STORAGE_KEY = 'unlockables-progress';

interface AudioSettings {
  buttonClickEnabled: boolean;
  collectEnabled: boolean;
  minigameSoundsEnabled: {
    hope: boolean;
    courage: boolean;
    connection: boolean;
    healing: boolean;
  };
  musicEnabled: boolean;
}

// Global singleton for music to ensure it only plays once and persists across page navigations
let globalMusicRef: HTMLAudioElement | null = null;
let musicInitialized = false;
let musicEnabledState = false;

function initializeGlobalMusic() {
  if (typeof window === 'undefined' || musicInitialized) return;
  
  globalMusicRef = new Audio('/sounds/music.mp3');
  globalMusicRef.loop = true;
  globalMusicRef.volume = 0.3;
  musicInitialized = true;
  
  // Try to play if music is already enabled
  if (musicEnabledState) {
    globalMusicRef.play().catch(() => {
      // Ignore autoplay errors
    });
  }
}

function updateGlobalMusic(enabled: boolean) {
  // Only update if the state actually changed
  if (musicEnabledState === enabled && globalMusicRef) {
    // If music is already in the desired state, don't do anything
    return;
  }
  
  musicEnabledState = enabled;
  
  if (!globalMusicRef) {
    initializeGlobalMusic();
  }
  
  if (!globalMusicRef) return;
  
  if (enabled) {
    // Only play if not already playing
    if (globalMusicRef.paused) {
      globalMusicRef.play().catch(() => {
        // Ignore autoplay errors
      });
    }
  } else {
    // Only pause if actually playing
    if (!globalMusicRef.paused) {
      globalMusicRef.pause();
    }
  }
}

export function useAudio() {
  const [settings, setSettings] = useState<AudioSettings>({
    buttonClickEnabled: false,
    collectEnabled: false,
    minigameSoundsEnabled: {
      hope: false,
      courage: false,
      connection: false,
      healing: false
    },
    musicEnabled: false
  });
  const settingsLoadedRef = useRef(false);

  const buttonClickSoundRef = useRef<HTMLAudioElement | null>(null);
  const collectSoundRef = useRef<HTMLAudioElement | null>(null);
  const hopeSoundRef = useRef<HTMLAudioElement | null>(null);
  const courageSoundRef = useRef<HTMLAudioElement | null>(null);
  const connectionSoundRef = useRef<HTMLAudioElement | null>(null);
  const healingSoundRef = useRef<HTMLAudioElement | null>(null);

  // Load settings from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadSettings = () => {
      try {
        const saved = localStorage.getItem(UNLOCKABLES_STORAGE_KEY);
        if (saved) {
          const unlockables: any[] = JSON.parse(saved);
          
          const buttonClickEnabled = unlockables.some(u => u.id === 'sound-button-click' && u.unlocked);
          const collectEnabled = unlockables.some(u => u.id === 'sound-button-click' && u.unlocked); // Same upgrade
          const hopeEnabled = unlockables.some(u => u.id === 'sound-minigame-hope' && u.unlocked);
          const courageEnabled = unlockables.some(u => u.id === 'sound-minigame-courage' && u.unlocked);
          const connectionEnabled = unlockables.some(u => u.id === 'sound-minigame-connection' && u.unlocked);
          const healingEnabled = unlockables.some(u => u.id === 'sound-minigame-healing' && u.unlocked);
          const musicEnabled = unlockables.some(u => u.id === 'sound-music' && u.unlocked);

          setSettings({
            buttonClickEnabled,
            collectEnabled,
            minigameSoundsEnabled: {
              hope: hopeEnabled,
              courage: courageEnabled,
              connection: connectionEnabled,
              healing: healingEnabled
            },
            musicEnabled
          });
          
          settingsLoadedRef.current = true;
          
          // Update global music state only after loading from localStorage
          updateGlobalMusic(musicEnabled);
        } else {
          // Even if no saved data, mark as loaded
          settingsLoadedRef.current = true;
        }
      } catch (e) {
        // Ignore errors
      }
    };

    loadSettings();

    // Listen for changes
    const handleStorageChange = () => {
      loadSettings();
    };

    window.addEventListener('storage', handleStorageChange);
    // Also listen for custom event when unlockables change
    const handleUnlockableChange = () => {
      loadSettings();
    };
    window.addEventListener('unlockableChanged', handleUnlockableChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('unlockableChanged', handleUnlockableChange);
    };
  }, []);

  // Initialize audio elements (except music, which is global)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    buttonClickSoundRef.current = new Audio('/sounds/click.mp3');
    collectSoundRef.current = new Audio('/sounds/collect.wav');
    hopeSoundRef.current = new Audio('/sounds/hope.mp3');
    courageSoundRef.current = new Audio('/sounds/courage.mp3');
    connectionSoundRef.current = new Audio('/sounds/connection.mp3');
    healingSoundRef.current = new Audio('/sounds/healing.mp3');
    
    // Initialize global music if not already initialized
    initializeGlobalMusic();

    return () => {
      // Cleanup sound effects only (not music, as it's global)
      buttonClickSoundRef.current?.pause();
      collectSoundRef.current?.pause();
      hopeSoundRef.current?.pause();
      courageSoundRef.current?.pause();
      connectionSoundRef.current?.pause();
      healingSoundRef.current?.pause();
    };
  }, []);

  // Handle music playback using global singleton
  // Only update when settings actually change after loading from localStorage
  useEffect(() => {
    // Only update if settings have been loaded from localStorage
    // This prevents pausing music when components mount with default false values
    if (settingsLoadedRef.current) {
      updateGlobalMusic(settings.musicEnabled);
    }
  }, [settings.musicEnabled]);

  const playButtonClick = () => {
    if (settings.buttonClickEnabled && buttonClickSoundRef.current) {
      buttonClickSoundRef.current.currentTime = 0;
      buttonClickSoundRef.current.play().catch(() => {
        // Ignore play errors
      });
    }
  };

  const playCollect = () => {
    if (settings.collectEnabled && collectSoundRef.current) {
      collectSoundRef.current.currentTime = 0;
      collectSoundRef.current.play().catch(() => {
        // Ignore play errors
      });
    }
  };

  const playMinigameSound = (minigameId: 'hope' | 'courage' | 'connection' | 'healing') => {
    if (!settings.minigameSoundsEnabled[minigameId]) return;

    let soundRef: HTMLAudioElement | null = null;
    switch (minigameId) {
      case 'hope':
        soundRef = hopeSoundRef.current;
        break;
      case 'courage':
        soundRef = courageSoundRef.current;
        break;
      case 'connection':
        soundRef = connectionSoundRef.current;
        break;
      case 'healing':
        soundRef = healingSoundRef.current;
        break;
    }

    if (soundRef) {
      soundRef.currentTime = 0;
      soundRef.play().catch(() => {
        // Ignore play errors
      });
    }
  };

  return {
    playButtonClick,
    playCollect,
    playMinigameSound,
    musicEnabled: settings.musicEnabled
  };
}

