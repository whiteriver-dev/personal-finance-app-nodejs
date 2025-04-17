import React, { useEffect, useState } from 'react';
import './AddBudgetModal.scss';
import { allBudgetColors } from '../../../constants/budgetColors';

function AddBudgetModal({ userId, onClose, onBudgetCreated, usedColors }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [color, setColor] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const availableColors = Object.entries(allBudgetColors).filter(
    ([, hex]) => !usedColors.includes(hex)
  );

  useEffect(() => { // Prevents background scroll when modal is open
    document.body.style.overflow = 'hidden';  
    return () => {
      document.body.style.overflow = 'auto'; 
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newBudget = {
      name,
      amount: parseFloat(amount),
      user_id: userId,
      color
    };

    try {
      const res = await fetch('http://localhost:5050/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBudget),
      });

      if (!res.ok) throw new Error('Failed to create budget');

      onBudgetCreated();
      onClose();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Add New Budget</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Budget Name:
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>

          <label>
            Amount:
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </label>

          <label>Color Tag:</label>
          <div className="custom-dropdown" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <div className="custom-dropdown__selected">
              {color ? (
                <>
                  <span className="color-circle" style={{ backgroundColor: color }}></span>
                  <span>{Object.keys(allBudgetColors).find(k => allBudgetColors[k] === color)}</span>
                </>
              ) : (
                <span>Select a color</span>
              )}
            </div>
            {dropdownOpen && (
              <div className="custom-dropdown__list">
                {availableColors.map(([name, hex]) => (
                  <div
                    key={hex}
                    className="custom-dropdown__option"
                    onClick={() => {
                      setColor(hex);
                      setDropdownOpen(false);
                    }}
                  >
                    <span className="color-circle" style={{ backgroundColor: hex }}></span>
                    {name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="submit">Add Budget</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBudgetModal;
