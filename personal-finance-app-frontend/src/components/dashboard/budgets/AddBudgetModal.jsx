import React, { useEffect, useState, useRef } from 'react';
import './AddBudgetModal.scss';

function AddBudgetModal({ userId, onClose, onBudgetCreated, usedColors }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [colors, setColors] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedColorId, setSelectedColorId] = useState('');
  const dropdownRef = useRef(null);

  // Handle Click Outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
  
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch Colors
  useEffect(() => {
    fetch('http://localhost:5050/colors')
      .then(res => res.json())
      .then(data => setColors(data));
  }, []);

  // Prevents background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';  
    return () => {
      document.body.style.overflow = 'auto'; 
    };
  }, []);

  // Handle Submit
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
          <button type="button" onClick={onClose}>
            ✕
          </button>
        </div>

        <p className='modal-description'>
          Choose a category to set a spending budget. These categories can help you monitor spending.
        </p>

        <form onSubmit={handleSubmit}>
          <label>
            Budget Category
            <input 
              type="text" 
              value={name} 
              placeholder='Budget name' 
              maxLength={30} 
              onChange={(e) => setName(e.target.value)} 
            />
          </label>

          <label>
            Maximum Spend
            <div className='input-with-prefix'>
              <span className="money-prefix">$</span>
              <input 
                type="number"
                value={amount} 
                min="0" 
                step="0.01"
                placeholder='e.g 2000' 
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') {
                    setAmount('');
                    return;
                  }
                  if (/^\d*\.?\d{0,2}$/.test(value)) {
                    setAmount(value);
                  }
                }}
                onKeyDown={(e) => {
                  if (['-', '+', 'e', 'E'].includes(e.key)) {
                    e.preventDefault();
                  }
                }} 
              />
            </div>
          </label>

          <label>Theme
            <div className="custom-dropdown" ref={dropdownRef}>
              <div className="custom-dropdown__selected" onClick={() => setDropdownOpen(!dropdownOpen)}>
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
                  {colors.map(color => {
                    const isUsed = usedColors.includes(color.id);

                    return (
                      <div
                        key={color.id}
                        className={`custom-dropdown__option ${isUsed ? 'disabled' : ''}`}
                        onClick={() => {
                          if (!isUsed) {
                            setSelectedColorId(color.id);
                            setDropdownOpen(false);
                          }
                        }}
                      >
                        <span 
                          className={`color-circle ${isUsed ? 'used' : ''}`} 
                          style={{ backgroundColor: color.hex }} 
                        />
                        <div className={`color-name-container ${isUsed ? 'already-used' : ''}`}>
                          <span className="color-name">{color.name}</span>
                          {isUsed && <span className="already-used-label">Already used</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </label>

          <div className="modal-actions">
            <button type="submit">Add Budget</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBudgetModal;
