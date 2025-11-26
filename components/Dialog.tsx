import { ReactNode } from 'react';

interface DialogProps {
  children: ReactNode;
  open: boolean;
  onClose: () => void;
}

const Dialog = ({ children, open, onClose }: DialogProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end lg:hidden" onClick={onClose}>
      <button
        type="button"
        aria-label="Close dialog overlay"
        className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative h-full w-full max-w-sm sm:max-w-md bg-turquoise-800 shadow-2xl border-l-2 border-turquoise-400 overflow-y-auto px-4 py-6 transition-transform duration-300 translate-x-0"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Dialog;
