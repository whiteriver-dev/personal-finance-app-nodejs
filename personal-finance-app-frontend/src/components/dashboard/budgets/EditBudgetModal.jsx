import React, { useState, useEffect } from 'react';
import './EditBudgetModal.scss';

function EditBudgetModal({ budget, onClose, onBudgetUpdated }) {
  const [name, setName] = useState(budget.name);
  const [amount, setAmount] = useState(budget.amount);
  const [colors, setColors] = useState([]);
  const [selectedColorId, setSelectedColorId] = useState(budget.color_id || '');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5050/colors')
      .then(res => res.json())
      .then(data => setColors(data));
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedBudget = {
      name,
      amount: parseFloat(amount),
      color_id: selectedColorId,
    };

    try {
      const res = await fetch(`http://localhost:5050/budgets/${budget.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBudget),
      });

      if (!res.ok) throw new Error('Failed to update budget');

      onBudgetUpdated();
      onClose();
    } catch (err) {
      console.error('Error updating budget:', err);
    }
  };

  return (
    <div className="edit-modal-backdrop">
      <div className="edit-modal">
        <div className="modal-header">
          <h2>Edit Budget</h2>
          <button type="button" onClick={onClose}>X</button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>

          <label>
            Amount:
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </label>

          <label>Color Tag:</label>
          <div className="custom-dropdown" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <div className="custom-dropdown__selected">
              {selectedColorId ? (
                <>
                  {(() => {
                    const selectedColor = colors.find(c => c.id === selectedColorId);
                    return (
                      <>
                        <span className="color-circle" style={{ backgroundColor: selectedColor?.hex }}></span>
                        <span>{selectedColor?.name}</span>
                      </>
                    );
                  })()}
                </>
              ) : (
                <span>Select a color</span>
              )}
            </div>
            {dropdownOpen && (
              <div className="custom-dropdown__list">
                {colors.map(color => (
                  <div
                    key={color.id}
                    className="custom-dropdown__option"
                    onClick={() => {
                      setSelectedColorId(color.id);
                      setDropdownOpen(false);
                    }}
                  >
                    <span className="color-circle" style={{ backgroundColor: color.hex }}></span>
                    {color.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditBudgetModal;
