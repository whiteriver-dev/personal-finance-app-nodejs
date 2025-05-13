import React, { useEffect, useState } from 'react';
import './WithdrawMoney.scss';

function WithdrawMoney({ pot, onClose, onPotUpdated }) {
  const [amount, setAmount] = useState('');
  const [updatedAmount, setUpdatedAmount] = useState(pot.saved);

  // Handle amount change and update the visualization
  useEffect(() => {
    if (amount !== '' && !isNaN(amount)) {
      const newAmount = pot.saved - parseFloat(amount);
      setUpdatedAmount(newAmount < 0 ? 0 : newAmount); // Prevent negative amounts
    } else if (amount === '') {
      setUpdatedAmount(pot.saved); // Default back to saved if input is cleared
    }
  }, [amount, pot.saved]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedPot = {
      ...pot,
      saved: updatedAmount,
    };

    try {
      const res = await fetch(`http://localhost:5050/pots/withdraw/${pot.id}`, {
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

  // Calculate percentages for the progress bar
  const currentPercentage = Math.min(((pot.saved / pot.target) * 100).toFixed(2), 100);
  const subtractedPercentage = Math.min(((parseFloat(amount) || 0) / pot.target) * 100, 100);
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

        <p className='modal-description'>Withdraw from your pot to put money back in your main balance. This will reduce the amount you have in this pot.</p>
        <form onSubmit={handleSubmit}>
          <div className="pot-transaction__header">
            <span>New Amount</span><span>${updatedAmount}</span>
          </div>

          <div className="pot-transaction__progress-bar">
            <div
              className="pot-transaction__progress-bar-fill"
              style={{
                width: `${totalPercentage}%`,
                borderRadius: subtractedPercentage === 0 ? '0 0.8rem 0.8rem 0' : '',
                borderRight: subtractedPercentage === 0 ? 'none' : '0.2rem solid white',
              }}
            />
            <div
              className="pot-transaction__subtracted"
              style={{
                width: `${subtractedPercentage}%`,
                right: `${100 - currentPercentage}%`,
              }}
            />
          </div>

          <div className="transaction-status">
            <span className={`transaction-status__amount ${subtractedPercentage > 0 ? 'red' : ''}`}>
              {totalPercentage}%
            </span>
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
