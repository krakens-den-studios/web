'use client';

import { useEffect, useRef, useState, MutableRefObject } from 'react';
import { cookieStorage } from '@/utils/cookieStorage';
import { deserializeUnlockables } from '@/shared/gameData';

const UNLOCKABLES_STORAGE_KEY = 'unlockables-progress';
const AUDIO_SETTINGS_KEY = 'audio-settings';

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

  const defaultSettings: AudioSettings = {
    buttonClickEnabled: false,
    collectEnabled: false,
    minigameSoundsEnabled: {
      hope: false,
      courage: false,
      connection: false,
      healing: false
    },
    musicEnabled: false
  };

  const mergeSettings = (overrides: Partial<AudioSettings>): AudioSettings => ({
    buttonClickEnabled: overrides.buttonClickEnabled ?? defaultSettings.buttonClickEnabled,
    collectEnabled: overrides.collectEnabled ?? defaultSettings.collectEnabled,
    musicEnabled: overrides.musicEnabled ?? defaultSettings.musicEnabled,
    minigameSoundsEnabled: {
      hope: overrides.minigameSoundsEnabled?.hope ?? defaultSettings.minigameSoundsEnabled.hope,
      courage: overrides.minigameSoundsEnabled?.courage ?? defaultSettings.minigameSoundsEnabled.courage,
      connection: overrides.minigameSoundsEnabled?.connection ?? defaultSettings.minigameSoundsEnabled.connection,
      healing: overrides.minigameSoundsEnabled?.healing ?? defaultSettings.minigameSoundsEnabled.healing,
    }
  });

  const loadAudioSettingsFromCookie = (): AudioSettings | null => {
    const saved = cookieStorage.getItem(AUDIO_SETTINGS_KEY);
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      return mergeSettings({
        buttonClickEnabled: !!parsed.buttonClickEnabled,
        collectEnabled: !!parsed.collectEnabled,
        musicEnabled: !!parsed.musicEnabled,
        minigameSoundsEnabled: {
          hope: !!parsed.minigameSoundsEnabled?.hope,
          courage: !!parsed.minigameSoundsEnabled?.courage,
          connection: !!parsed.minigameSoundsEnabled?.connection,
          healing: !!parsed.minigameSoundsEnabled?.healing
        }
      });
    } catch {
      return null;
    }
  };

  const persistAudioSettings = (settingsToSave: AudioSettings) => {
    cookieStorage.setItem(AUDIO_SETTINGS_KEY, JSON.stringify(settingsToSave));
  };

  const deriveSettingsFromUnlockables = (): AudioSettings | null => {
    const raw = cookieStorage.getItem(UNLOCKABLES_STORAGE_KEY);
    if (!raw) return null;

    const { state: unlockables } = deserializeUnlockables(raw);
    const buttonClickEnabled = unlockables.some(u => u.id === 'sound-button-click' && u.unlocked);
    const hopeEnabled = unlockables.some(u => u.id === 'sound-minigame-hope' && u.unlocked);
    const courageEnabled = unlockables.some(u => u.id === 'sound-minigame-courage' && u.unlocked);
    const connectionEnabled = unlockables.some(u => u.id === 'sound-minigame-connection' && u.unlocked);
    const healingEnabled = unlockables.some(u => u.id === 'sound-minigame-healing' && u.unlocked);
    const musicEnabled = unlockables.some(u => u.id === 'sound-music' && u.unlocked);

    return {
      buttonClickEnabled,
      collectEnabled: buttonClickEnabled,
      minigameSoundsEnabled: {
        hope: hopeEnabled,
        courage: courageEnabled,
        connection: connectionEnabled,
        healing: healingEnabled
      },
      musicEnabled
    };
  };

  // Load settings from cookies
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const applySettings = (newSettings: AudioSettings) => {
      setSettings(newSettings);
      settingsLoadedRef.current = true;
      updateGlobalMusic(newSettings.musicEnabled);
    };

    const loadSettings = () => {
      const audioCookieSettings = loadAudioSettingsFromCookie();
      if (audioCookieSettings) {
        applySettings(audioCookieSettings);
        return;
      }

      const derived = deriveSettingsFromUnlockables();
      if (derived) {
        applySettings(derived);
        persistAudioSettings(derived);
        return;
      }

      applySettings({ ...defaultSettings });
      persistAudioSettings(defaultSettings);
    };

    loadSettings();

    // Listen for custom event when unlockables change
    const handleUnlockableChange = () => {
      loadSettings();
    };
    window.addEventListener('unlockableChanged', handleUnlockableChange);
    window.addEventListener('audioSettingsChanged', handleUnlockableChange);

    return () => {
      window.removeEventListener('unlockableChanged', handleUnlockableChange);
      window.removeEventListener('audioSettingsChanged', handleUnlockableChange);
    };
  }, []);

  // Initialize audio elements (except music, which is global)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    buttonClickSoundRef.current = new Audio('/sounds/click.mp3');
    buttonClickSoundRef.current.preload = 'auto';
    buttonClickSoundRef.current.load();
    
    collectSoundRef.current = new Audio('/sounds/collect.wav');
    collectSoundRef.current.preload = 'auto';
    collectSoundRef.current.volume = 0.15;
    collectSoundRef.current.load();
    
    hopeSoundRef.current = new Audio('/sounds/hope.wav');
    hopeSoundRef.current.preload = 'auto';
    hopeSoundRef.current.load();
    
    courageSoundRef.current = new Audio('/sounds/courage.wav');
    courageSoundRef.current.preload = 'auto';
    courageSoundRef.current.load();
    
    connectionSoundRef.current = new Audio('/sounds/connection.wav');
    connectionSoundRef.current.preload = 'auto';
    connectionSoundRef.current.load();
    
    healingSoundRef.current = new Audio('/sounds/healing.wav');
    healingSoundRef.current.preload = 'auto';
    healingSoundRef.current.load();
    
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
  // Only update when settings actually change after loading from cookies
  useEffect(() => {
    // Only update if settings have been loaded from cookies
    // This prevents pausing music when components mount with default false values
    if (settingsLoadedRef.current) {
      updateGlobalMusic(settings.musicEnabled);
    }
  }, [settings.musicEnabled]);

  const playSoundEffect = (ref: MutableRefObject<HTMLAudioElement | null>) => {
    const sound = ref.current;
    if (!sound) return;
    if (sound.readyState === 0) {
      sound.load();
    }
    try {
      sound.currentTime = 0;
    } catch (e) {
      // Some browsers may throw if the element isn't seekable yet; ignore.
    }
    sound.play().catch(() => {
      const clone = sound.cloneNode(true) as HTMLAudioElement;
      clone.play().catch(() => {
        // Ignore play errors to avoid console noise
      });
    });
  };

  const playButtonClick = () => {
    if (settings.buttonClickEnabled) {
      playSoundEffect(buttonClickSoundRef);
    }
  };

  const playCollect = () => {
    if (settings.collectEnabled) {
      playSoundEffect(collectSoundRef);
    }
  };

  const playMinigameSound = (minigameId: 'hope' | 'courage' | 'connection' | 'healing') => {
    if (!settings.minigameSoundsEnabled[minigameId]) return;

    let soundRef: MutableRefObject<HTMLAudioElement | null>;
    switch (minigameId) {
      case 'hope':
        soundRef = hopeSoundRef;
        break;
      case 'courage':
        soundRef = courageSoundRef;
        break;
      case 'connection':
        soundRef = connectionSoundRef;
        break;
      case 'healing':
        soundRef = healingSoundRef;
        break;
      default:
        return;
    }

    playSoundEffect(soundRef);
  };

  return {
    playButtonClick,
    playCollect,
    playMinigameSound,
    musicEnabled: settings.musicEnabled
  };
}

