import { forwardRef, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({ children , isOpen, onClose}) {
  const dialog = useRef();

  useEffect(() => {
    if(isOpen){
        dialog.current.showModal();
      } else {
        dialog.current.close();
      }
    }, [isOpen]);

  return createPortal(
    <dialog className="modal" ref={dialog} onClose={onClose}>
      {isOpen ? children : null}
    </dialog>,
    document.getElementById('modal')
  );
};