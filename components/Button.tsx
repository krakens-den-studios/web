import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import Loading from './Loading';

export interface ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  label: string;
  loading?: boolean;
  disabled?: boolean;
}

const Button = ({ label, loading, disabled, ...rest }: ButtonProps) => {
  return (
    <button
      disabled={disabled || loading}
      {...rest}
      className={`bg-turquoise-400 hover:bg-turquoise-300 relative w-56 py-4 px-6 border-none select-none flex items-center justify-center h-fit outline-none rounded-2xl ${
        loading ? 'pointer-events-none' : ''
      } ${disabled ? 'opacity-40 pointer-events-none' : ''}`}
    >
      {loading && <Loading className="absolute" />}

      <div className={`flex items-center justify-center gap-2 ${loading ? 'opacity-0' : ''}`}>
        {label && <p className="whitespace-nowrap text-xl font-lora font-bold text-black">{label}</p>}
      </div>
    </button>
  );
};

export default Button;
