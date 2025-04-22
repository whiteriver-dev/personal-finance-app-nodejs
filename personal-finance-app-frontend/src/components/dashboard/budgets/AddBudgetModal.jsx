import React, { useEffect, useState } from 'react';
import './AddBudgetModal.scss';

function AddBudgetModal({ userId, onClose, onBudgetCreated }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [colors, setColors] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedColorId, setSelectedColorId] = useState('');


  useEffect(() => {
    fetch('http://localhost:5050/colors')
      .then(res => res.json())
      .then(data => setColors(data));
  }, []);

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
      color_id: selectedColorId,
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
        <div className="modal-header">
            <h2>Add New Budget</h2>
            <button type="button" onClick={onClose}>X</button>
        </div>
        <form onSubmit={handleSubmit}>
          <label>
            Budget Name:
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
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
            <button type="submit">Add Budget</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBudgetModal;
