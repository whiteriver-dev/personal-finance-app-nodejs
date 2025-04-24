import React from 'react';
import './DeleteConfirmModal.scss';

function DeleteConfirmModal({ onConfirm, onCancel }) {
  return (
    <div className="delete-modal-backdrop">
      <div className="delete-modal">
        <h3>Are you sure?</h3>
        <p>This budget and its associated transactions will be permanently deleted.</p>
        <div className="delete-modal__actions">
          <button onClick={onConfirm} className="confirm-btn">Yes, Delete</button>
          <button onClick={onCancel} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
