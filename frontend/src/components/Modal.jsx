import React from 'react';
import './Modal.css';
import { HiX } from 'react-icons/hi';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick} id="modal-overlay">
      <div className={`modal-content modal-${size} animate-scale-in`}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close btn-icon btn-ghost" onClick={onClose} id="modal-close-btn">
            <HiX size={20} />
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
