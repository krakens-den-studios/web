import React, { DetailedHTMLProps, DialogHTMLAttributes, ReactNode, useCallback, useEffect, useRef } from 'react';

export interface DialogProps extends DetailedHTMLProps<DialogHTMLAttributes<HTMLDialogElement>, HTMLDialogElement> {
  children: ReactNode;
  open: boolean;
  onClose: () => void;
}

const Dialog = ({ children, title, open, onClose, ...rest }: DialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const closeDialog = useCallback(() => {
    dialogRef.current?.close();
    onClose();
  }, [onClose]);

  const onDialogClick = (event: React.MouseEvent<HTMLDialogElement, MouseEvent>) => {
    if (!open || !dialogRef.current) return;

    const dialogDimensions = dialogRef.current.getBoundingClientRect();

    if (
      event.clientX < dialogDimensions.left ||
      event.clientX > dialogDimensions.right ||
      event.clientY < dialogDimensions.top ||
      event.clientY > dialogDimensions.bottom
    )
      closeDialog();
  };

  useEffect(() => {
    if (open && !dialogRef.current?.open) dialogRef.current?.showModal();
    else if (!open && dialogRef.current?.open) closeDialog();
  }, [closeDialog, open]);

  return (
    <dialog
      onClick={onDialogClick}
      className={`z-10 ml-auto bg-turquoise-800 w-fit h-fit  backdrop:opacity-90 backdrop:cursor-pointer`}
      ref={dialogRef}
      onClose={closeDialog}
      {...rest}
    >
      {children}
    </dialog>
  );
};

export default Dialog;
