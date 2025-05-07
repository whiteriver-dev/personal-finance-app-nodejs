import React, { useState, useEffect, useRef } from 'react';
import './EditPotModal.scss';

function EditPotModal({ pot, onClose, onPotUpdated }) {
  const [name, setName] = useState(pot.name);
  const [target, setTarget] = useState(pot.target);
  const [colors, setColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState(pot.color);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  // Fetch colors from the backend
  useEffect(() => {
    fetch('http://localhost:5050/colors')
      .then(res => res.json())
      .then(data => setColors(data))
      .catch(err => console.error('Error fetching colors:', err));
  }, []);

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedPot = {
      name,
      target: parseFloat(target),
      color: selectedColor
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

  return (
    <div className="edit-modal-backdrop">
      <div className="edit-modal">
        <div className="modal-header">
          <h2>Edit Pot</h2>
          <button type="button" onClick={onClose}>
            ✕
          </button>
        </div>
        <p className='modal-description'>Edit your pot details and update your savings goal.</p>
        <form onSubmit={handleSubmit}>
          <label>
            Pot Name
            <input value={name} maxLength={30} onChange={(e) => setName(e.target.value)} />
          </label>

          <label>
            Savings Target
            <div className="input-with-prefix">
              <span className="money-prefix">$</span>
              <input
                type="number"
                value={target}
                min="0"
                step="0.01"
                onKeyDown={(e) => {
                  if (['-', '+', 'e', 'E'].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  const value = e.target.value;

                  if (value === '') {
                    setTarget('');
                    return;
                  }

                  if (/^\d*\.?\d{0,2}$/.test(value)) {
                    setTarget(value);
                  }
                }}
              />
            </div>
          </label>

          <label>Theme
            <div
              className="custom-dropdown"
              ref={dropdownRef}
            >
              <div className="custom-dropdown__selected" onClick={() => setDropdownOpen(!dropdownOpen)}>
                {selectedColor ? (
                  <>
                    <span className="color-circle" style={{ backgroundColor: selectedColor }}></span>
                    <span>{colors.find(c => c.hex === selectedColor)?.name || 'Select a color'}</span>
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
                      className={`custom-dropdown__option ${color.hex === selectedColor ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedColor(color.hex);
                        setDropdownOpen(false);
                      }}
                    >
                      <span className="color-circle" style={{ backgroundColor: color.hex }}></span>
                      <span className="color-name">{color.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </label>

          <div className="modal-actions">
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPotModal;
