'use client';

import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import Loading from './Loading';
import { useAudio } from '@/hooks/useAudio';

export interface ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  label: string;
  loading?: boolean;
  disabled?: boolean;
  compact?: boolean;
}

const Button = ({ label, loading, disabled, compact, onClick, ...rest }: ButtonProps) => {
  const { playButtonClick } = useAudio();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playButtonClick();
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      disabled={disabled || loading}
      onClick={handleClick}
      {...rest}
      className={`bg-turquoise-400 hover:bg-turquoise-300 relative ${
        compact ? 'w-full max-w-xs py-3 px-4 rounded-xl' : 'w-56 py-4 px-6 rounded-2xl'
      } border-none select-none flex items-center justify-center h-fit outline-none ${
        loading ? 'pointer-events-none' : ''
      } ${disabled ? 'opacity-40 pointer-events-none' : ''}`}
    >
      {loading && <Loading className="absolute" />}

      <div className={`flex items-center justify-center gap-2 ${loading ? 'opacity-0' : ''}`}>
        {label && (
          <p
            className={`whitespace-nowrap font-lora font-bold text-black ${compact ? 'text-base sm:text-lg' : 'text-xl'}`}
          >
            {label}
          </p>
        )}
      </div>
    </button>
  );
};

export default Button;
