import Image from 'next/image';
import { CSSProperties } from 'react';

type KrakenlingTint = 'turquoise' | 'white' | 'gold' | 'pink' | 'cost' | 'reward' | 'total' | 'openShop' | 'none';
type KrakenlingBackground = 'none' | 'turquoise' | 'gold' | 'rewardDelta' | 'rewardAbsolute' | 'total';

const TINT_FILTERS: Record<KrakenlingTint, string> = {
  turquoise: '',
  white: 'grayscale(1) brightness(1.9)',
  gold: 'grayscale(1) sepia(1) hue-rotate(320deg) saturate(6) brightness(1.1)',
  pink: 'grayscale(1) sepia(1) hue-rotate(280deg) saturate(6) brightness(1.1)',
  cost: 'grayscale(1) sepia(1) hue-rotate(330deg) saturate(7) brightness(1.15)',
  reward: 'grayscale(1) sepia(1) hue-rotate(90deg) saturate(5) brightness(1.2)',
  total: 'grayscale(1) sepia(1) hue-rotate(190deg) saturate(5) brightness(1.2)',
  openShop: 'grayscale(1) sepia(1) hue-rotate(210deg) saturate(5) brightness(1.2)',
  none: ''
};

const BACKGROUND_CLASSES: Record<KrakenlingBackground, string> = {
  none: '',
  turquoise: 'bg-turquoise-400/20 border border-turquoise-300 shadow-[0_0_10px_rgba(45,212,191,0.4)] rounded-full',
  gold: 'bg-amber-300/25 border border-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.45)] rounded-full',
  rewardDelta: 'bg-cyan-100/40 border border-cyan-200 shadow-[0_0_14px_rgba(34,211,238,0.5)] rounded-full',
  rewardAbsolute: 'bg-lime-200/35 border border-lime-300 shadow-[0_0_12px_rgba(190,242,100,0.45)] rounded-full',
  total: 'bg-sky-300/25 border border-sky-300 shadow-[0_0_12px_rgba(125,211,252,0.4)] rounded-full'
};

interface KrakenlingIconProps {
  size?: number;
  className?: string;
  tint?: KrakenlingTint;
  background?: KrakenlingBackground;
  style?: CSSProperties;
  priority?: boolean;
}

export default function KrakenlingIcon({
  size = 32,
  className,
  tint = 'turquoise',
  background = 'none',
  style,
  priority
}: KrakenlingIconProps) {
  const tintFilter = TINT_FILTERS[tint] || '';
  const combinedFilter = [tintFilter, style?.filter].filter(Boolean).join(' ').trim() || undefined;

  const padding = background === 'none' ? 0 : Math.max(2, Math.round(size * 0.25));
  const wrapperSize = size + padding * 2;
  const backgroundClass = BACKGROUND_CLASSES[background] || '';

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full ${backgroundClass} ${className || ''}`}
      style={{
        width: wrapperSize,
        height: wrapperSize,
        minWidth: wrapperSize,
        minHeight: wrapperSize
      }}
    >
      <Image
        src="/krakenling.png"
        alt="Krakenling icon"
        width={size}
        height={size}
        style={{ ...style, filter: combinedFilter }}
        priority={priority}
      />
    </span>
  );
}

