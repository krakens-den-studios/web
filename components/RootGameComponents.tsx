'use client';

import { useState, useEffect } from 'react';
import KrakenTreasure from './KrakenTreasure';
import OctopusCollector from './OctopusCollector';
import { useOctopuses } from '@/hooks/useOctopuses';

export default function RootGameComponents() {
  const [showTreasure, setShowTreasure] = useState(false);
  const { octopusCount, collectedOctopuses, updateOctopusCount, collectOctopus } = useOctopuses();

  // Listen for custom event to open treasure
  useEffect(() => {
    const handleOpenTreasure = () => {
      setShowTreasure(true);
      // Dispatch event when shop opens
      window.dispatchEvent(new CustomEvent('shopOpened'));
    };
    window.addEventListener('openTreasure', handleOpenTreasure);
    return () => {
      window.removeEventListener('openTreasure', handleOpenTreasure);
    };
  }, []);

  return (
    <>
      {/* Collectable krakenlings on root page - only show when treasure is closed */}
      {!showTreasure && (
        <OctopusCollector
          onCollect={collectOctopus}
          collectedOctopuses={collectedOctopuses}
        />
      )}
      
      {showTreasure && (
        <KrakenTreasure
          collectedOctopuses={octopusCount}
          onOctopusChange={updateOctopusCount}
          onClose={() => {
            setShowTreasure(false);
            // Dispatch event when shop closes
            window.dispatchEvent(new CustomEvent('shopClosed'));
          }}
        />
      )}
    </>
  );
}

