import { ReactNode } from 'react';

interface PointsProps {
  children: ReactNode;
}

const Points = ({ children }: PointsProps) => {
  return (
    <div className="relative w-full h-fit flex gap-8 items-center justify-center">
      <div className="w-4 h-4 rounded-full bg-gray hidden lg:flex" />
      <div className="w-4 h-4 rounded-full bg-gray hidden lg:flex" />
      <div className="w-7 h-7 rounded-full bg-gray hidden lg:flex" />
      <div className="w-9 h-9 rounded-full bg-gray hidden lg:flex" />

      {children}

      <div className="w-9 h-9 rounded-full bg-gray hidden lg:flex" />
      <div className="w-7 h-7 rounded-full bg-gray hidden lg:flex" />
      <div className="w-4 h-4 rounded-full bg-gray hidden lg:flex" />
      <div className="w-4 h-4 rounded-full bg-gray hidden lg:flex" />
    </div>
  );
};

export default Points;
