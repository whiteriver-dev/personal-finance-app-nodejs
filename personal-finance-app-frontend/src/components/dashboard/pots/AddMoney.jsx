import React, { useEffect, useState } from 'react';
import './AddMoney.scss';

function AddMoneyModal({ pot, onClose, onPotUpdated }) {
  const [amount, setAmount] = useState('');
  const [updatedAmount, setUpdatedAmount] = useState(pot.saved);

  useEffect(() => {
    if (amount !== '' && !isNaN(amount)) {
      const newAmount = pot.saved + parseFloat(amount);
      setUpdatedAmount(newAmount);
    } else {
      setUpdatedAmount(0);
    }
  }, [amount, pot.saved]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedPot = {
      ...pot,
      saved: updatedAmount,
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

  const currentPercentage = Math.min(((pot.saved / pot.target) * 100).toFixed(2), 100);
  const addedPercentage = Math.min(((parseFloat(updatedAmount) || 0) / pot.target).toFixed(2) * 100, 100);
  const totalPercentage = Math.min(((updatedAmount / pot.target) * 100).toFixed(2));

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2>Add to {pot.name}</h2>
          <button type="button" onClick={onClose}>
            ✕
          </button>
        </div>
        <p className="modal-description">
          Add money to your {pot.name} pot.
        </p>

        <form onSubmit={handleSubmit}>
            <div className="pot-transaction__header">
                <span>New Amount</span><span>${pot.saved}</span>
            </div>
            <div className="pot-transaction__progress-bar">
                <div
                className="pot-transaction__progress-bar-fill"
                style={{
                    width: `${currentPercentage}%`,
                    ...(addedPercentage === 0 ? { borderRadius: '0 0.4rem 0.4rem 0' } : {})
                  }}
                  
                />
                <div
                className="pot-transaction__added"
                style={{
                    width: `${addedPercentage}%`,
                    left: `${currentPercentage}%`
                }}
                />
                
            </div>
            
            <div className="transaction-status">
                <span>{totalPercentage > 0 ? totalPercentage : currentPercentage}%</span>
                <span>Target of ${pot.target}</span>
                <span>${updatedAmount}</span>
            </div>


          <label>
            Amount to Add
            <div className='input-with-prefix'>
              <span className="money-prefix">$</span>
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
            </div>
          </label>
          <div className="modal-actions">
                <button type="submit">Confirm Addition</button>
            </div>
          
        </form>
      </div>
    </div>
  );
}

export default AddMoneyModal;
