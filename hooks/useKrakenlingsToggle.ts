'use client';

import { useState, useEffect } from 'react';
import { cookieStorage } from '@/utils/cookieStorage';

const KRAKENLINGS_ENABLED_KEY = 'krakenlings-enabled';

export function useKrakenlingsToggle() {
  const [isEnabled, setIsEnabled] = useState(false); // Por defecto desactivado

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const saved = cookieStorage.getItem(KRAKENLINGS_ENABLED_KEY);
    // Si no hay valor guardado, por defecto es false (desactivado)
    if (saved === null) {
      setIsEnabled(false);
      cookieStorage.setItem(KRAKENLINGS_ENABLED_KEY, 'false');
    } else {
      setIsEnabled(saved === 'true');
    }
  }, []);

  const toggle = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    if (typeof window !== 'undefined') {
      cookieStorage.setItem(KRAKENLINGS_ENABLED_KEY, newValue.toString());
    }
  };

  const enable = () => {
    setIsEnabled(true);
    if (typeof window !== 'undefined') {
      cookieStorage.setItem(KRAKENLINGS_ENABLED_KEY, 'true');
    }
  };

  const disable = () => {
    setIsEnabled(false);
    if (typeof window !== 'undefined') {
      cookieStorage.setItem(KRAKENLINGS_ENABLED_KEY, 'false');
    }
  };

  return {
    isEnabled,
    toggle,
    enable,
    disable
  };
}
