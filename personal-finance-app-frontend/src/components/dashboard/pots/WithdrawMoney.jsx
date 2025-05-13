import React, { useEffect, useState } from 'react';
import './WithdrawMoney.scss';

function WithdrawMoney({ pot, onClose, onPotUpdated }) { 
  const [amount, setAmount] = useState('');
  const [updatedAmount, setUpdatedAmount] = useState(pot.saved);

  useEffect(() => {
    if (amount !== '' && !isNaN(amount)) {
      const newAmount = Math.max(pot.saved - parseFloat(amount), 0); // Ensure it doesn't go negative
      setUpdatedAmount(newAmount);
    } else {
      setUpdatedAmount(pot.saved);
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
  const subtractedPercentage = Math.min(((parseFloat(amount) || 0) / pot.target).toFixed(2) * 100, 100);
  const totalPercentage = Math.max(currentPercentage - subtractedPercentage, 0).toFixed(2);

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2>Withdraw from '{pot.name}'</h2>
          <button type="button" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
            <div className="pot-transaction__header">
                <span>New Amount</span><span>${pot.saved}</span>
            </div>
            <div className="pot-transaction__progress-bar">
                <div
                className="pot-transaction__progress-bar-fill"
                style={{
                    width: `${currentPercentage - subtractedPercentage}%`,
                    borderRadius: subtractedPercentage === 0 ? '0 0.4rem 0.4rem 0' : '',
                    borderRight: subtractedPercentage === 0 ? 'none' : '0.2rem solid white'
                  }}
                />
                <div
                className="pot-transaction__subtracted"
                style={{
                    width: `${subtractedPercentage}%`,
                    right: `${100 - currentPercentage}%`
                }}
                />
            </div>
            
            <div className="transaction-status">
                <span className={`transaction-status__amount ${subtractedPercentage > 0 ? 'red' : ''}`}>{totalPercentage}%</span>
                <span>Target of ${pot.target}</span>
            </div>

          <label>
            Amount to Withdraw
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
                <button type="submit">Confirm Withdrawal</button>
            </div>
          
        </form>
      </div>
    </div>
  );
}

export default WithdrawMoney;

