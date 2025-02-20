import { ReactNode } from "react";
import ReactDOM from "react-dom";
import styles from "./_styles.module.scss";

type ModalProps = {
  open: boolean;
  variant?: 'alert';
  onClose: () => void;
  children: ReactNode;
};

const Modal = ({ open, variant, onClose, children }: ModalProps) => {
  if (!open) return null;

  const portalElement = document.getElementById("portal");
  if (!portalElement) {
    console.error("Portal element not found");
    return null;
  }

  return ReactDOM.createPortal(
    <div className={styles.modalbackground}>
      <div className={styles.overlay_styles} onClick={onClose}></div>
      <div className={`${styles.modal_styles} ${variant === 'alert' ? styles['modal_styles__alert'] : ''}`}>{children}</div>
    </div>,
    portalElement
  );
};

export default Modal;
