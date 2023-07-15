import { DetailedHTMLProps, HTMLAttributes } from 'react';
import { RiLoader4Fill } from 'react-icons/ri';

export type LoadingProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const Loading = ({ className, ...props }: LoadingProps) => {
  return (
    <div
      {...props}
      className={`relative w-full h-full flex items-center justify-center ${className}`}
      data-testid="loading"
    >
      <RiLoader4Fill className="text-black relative p-2 h-12 w-12 animate-spin" />
    </div>
  );
};

export default Loading;
