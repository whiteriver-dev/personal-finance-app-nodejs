import React, { useState, useEffect } from 'react';
import './PotTransactionModal.scss';

function PotTransactionModal({ pot, type, onClose, onPotUpdated }) {
  const [amount, setAmount] = useState('');
  const [updatedAmount, setUpdatedAmount] = useState(pot.saved);

  useEffect(() => {
    if (amount !== '' && !isNaN(amount)) {
      const newAmount = type === 'add' ? pot.saved + parseFloat(amount) : pot.saved - parseFloat(amount);
      setUpdatedAmount(newAmount);
    } else {
      setUpdatedAmount(pot.saved);
    }
  }, [amount, type, pot.saved]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Avoid negative balance
    if (type === 'withdraw' && updatedAmount < 0) {
      alert("You cannot withdraw more than what is saved.");
      return;
    }

    const updatedPot = {
      ...pot,
      saved: updatedAmount
    };

    try {
      const res = await fetch(`http://localhost:5050/pots/${pot.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPot),
      });

      if (!res.ok) throw new Error('Failed to update pot');

      onPotUpdated();
      onClose();
    } catch (err) {
      console.error('Error updating pot:', err);
    }
  };

  const percentage = Math.min(((updatedAmount / pot.target) * 100).toFixed(2), 100);

  return (
    <div className="transaction-modal-backdrop">
      <div className="transaction-modal">
        <div className="modal-header">
          <h2>{type === 'add' ? `Add to ${pot.name}` : `Withdraw from ${pot.name}`}</h2>
          <button type="button" onClick={onClose}>✕</button>
        </div>
        <p className='modal-description'>
          {type === 'add' ? "Add money to your savings pot." : "Withdraw money from your savings pot."}
        </p>
        
        <form onSubmit={handleSubmit}>
          <label>
            Amount
            <input
              type="number"
              value={amount}
              min="0"
              step="0.01"
              placeholder="Enter amount"
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                  setAmount(value);
                }
              }}
            />
          </label>

          <div className="transaction-progress-bar">
            <div
              className={`transaction-progress-bar-fill ${type === 'add' ? 'green' : 'red'}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          
          <div className="transaction-status">
            <span>Current: ${pot.saved}</span>
            <span>Target: ${pot.target}</span>
            <span>After: ${updatedAmount < 0 ? 0 : updatedAmount}</span>
          </div>

          <button 
            type="submit" 
            className={`transaction-confirm-button ${type === 'add' ? 'green' : 'red'}`}
            disabled={updatedAmount < 0}
          >
            {type === 'add' ? 'Confirm Addition' : 'Confirm Withdrawal'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PotTransactionModal;
