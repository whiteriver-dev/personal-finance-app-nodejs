import React, { useEffect, useState, useRef } from 'react';
import './AddPotModal.scss';

function AddPotModal({ userId, onClose, onPotCreated, usedColors }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [colors, setColors] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedColorId, setSelectedColorId] = useState('');
  const dropdownRef = useRef(null);
  
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
  
    const newPot = {
      name,
      saved: 0,
      target: parseFloat(amount),
      user_id: userId,
      color: selectedColorId,
    };
  
    try {

      const res = await fetch('http://localhost:5050/pots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPot),
      });
  
      if (!res.ok) throw new Error('Failed to create pot');
  
      onPotCreated();
      onClose();
    } catch (err) {
      console.error('Error:', err);
    }
  };
  

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
            <h2>Add New Pot</h2>
            <button type="button" onClick={onClose}>
                <svg fill="#696868" height="25.5" viewBox="0 0 25.5 25.5" width="25.5" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.53 9.53L14.06 13L17.53 16.47C17.6037 16.5387 17.6628 16.6215 17.7038 16.7135C17.7448 16.8055 17.7668 16.9048 17.7686 17.0055C17.7704 17.1062 17.7518 17.2062 17.7141 17.2996C17.6764 17.393 17.6203 17.4778 17.549 17.549C17.4778 17.6203 17.393 17.6764 17.2996 17.7141C17.2062 17.7518 17.1062 17.7704 17.0055 17.7686C16.9048 17.7668 16.8055 17.7448 16.7135 17.7038C16.6215 17.6628 16.5387 17.6037 16.47 17.53L13 14.06L9.53 17.53C9.38783 17.6625 9.19978 17.7346 9.00548 17.7312C8.81118 17.7277 8.6258 17.649 8.48838 17.5116C8.35097 17.3742 8.27226 17.1888 8.26883 16.9945C8.2654 16.8002 8.33753 16.6122 8.47001 16.47L11.94 13L8.47001 9.53C8.33753 9.38782 8.2654 9.19978 8.26883 9.00548C8.27226 8.81118 8.35097 8.62579 8.48838 8.48838C8.6258 8.35097 8.81118 8.27225 9.00548 8.26882C9.19978 8.2654 9.38783 8.33752 9.53 8.47L13 11.94L16.47 8.47C16.6122 8.33752 16.8002 8.2654 16.9945 8.26882C17.1888 8.27225 17.3742 8.35097 17.5116 8.48838C17.649 8.62579 17.7278 8.81118 17.7312 9.00548C17.7346 9.19978 17.6625 9.38782 17.53 9.53ZM25.75 13C25.75 15.5217 25.0022 17.9868 23.6012 20.0835C22.2003 22.1802 20.209 23.8144 17.8792 24.7795C15.5495 25.7445 12.9859 25.997 10.5126 25.505C8.03935 25.0131 5.76751 23.7987 3.98439 22.0156C2.20127 20.2325 0.986955 17.9607 0.494993 15.4874C0.00303192 13.0141 0.255524 10.4505 1.22054 8.12079C2.18556 5.79103 3.81976 3.79975 5.91648 2.39876C8.01321 0.997774 10.4783 0.25 13 0.25C16.3803 0.25397 19.621 1.59854 22.0112 3.98877C24.4015 6.379 25.746 9.61971 25.75 13ZM24.25 13C24.25 10.775 23.5902 8.59989 22.354 6.74983C21.1179 4.89978 19.3609 3.45784 17.3052 2.60635C15.2495 1.75487 12.9875 1.53208 10.8052 1.96617C8.62295 2.40025 6.61839 3.47171 5.04505 5.04505C3.47171 6.61839 2.40025 8.62295 1.96617 10.8052C1.53209 12.9875 1.75487 15.2495 2.60636 17.3052C3.45785 19.3609 4.89979 21.1179 6.74984 22.354C8.59989 23.5902 10.775 24.25 13 24.25C15.9827 24.2467 18.8422 23.0604 20.9513 20.9513C23.0604 18.8422 24.2467 15.9827 24.25 13Z"/>
                </svg>
            </button>
        </div>
        <p className='modal-description'>Create a pot to set savings targets. These can help keep you on track as you save for special purchases.</p>
        <form onSubmit={handleSubmit}>
          <label>
            Pot Name
            <input type="text" value={name} placeholder='e.g Rainy Days' maxLength={30} onChange={(e) => setName(e.target.value)} />
          </label>

          <label>
            Target
            <div className='input-with-prefix'>
              <span className="money-prefix">$</span>
              <input type="number"
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
                  
                      if (/^\d*\.?\d{0,2}$/.test(value)) { //This allows only numbers and up to 2 decimal places
                        setAmount(value);
                      }
                    }}
                     onKeyDown={(e) => {
                      if (['-', '+', 'e', 'E'].includes(e.key)) {
                        e.preventDefault();
                      }
                    }} />
            </div>
          </label>

          <label>Theme
          <div className="custom-dropdown" ref={dropdownRef} >
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
                      <span className={`color-circle ${isUsed ? 'used' : ''}`} style={{ backgroundColor: color.hex }}></span>
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
            <button type="submit">Add Pot</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPotModal;
