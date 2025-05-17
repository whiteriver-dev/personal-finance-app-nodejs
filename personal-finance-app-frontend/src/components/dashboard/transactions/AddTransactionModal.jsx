import React, { useState, useEffect, useRef } from 'react';
import './AddTransactionModal.scss';

function AddTransactionModal({ userId, onClose, onTransactionCreated }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [isExpense, setIsExpense] = useState(true); // default to Expense
  const [budgets, setBudgets] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetch(`http://localhost:5050/budgets/${userId}`)
      .then(res => res.json())
      .then(data => setBudgets(data));
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalAmount = parseFloat(amount);
    if (isExpense) {
      finalAmount = -Math.abs(finalAmount); // Force negative
    } else {
      finalAmount = Math.abs(finalAmount); // Force positive
    }

    const newTransaction = {
      description,
      amount: finalAmount,
      user_id: userId,
      category: isExpense ? selectedBudget : null, // Only assign category if Expense
      date: new Date().toISOString().split('T')[0], // today's date
    };

    try {
      const res = await fetch('http://localhost:5050/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction),
      });

      if (!res.ok) throw new Error('Failed to create transaction');

      onTransactionCreated();
      onClose();
    } catch (err) {
      console.error('Error creating transaction:', err);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2>Add Transaction</h2>
          <button type="button" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="transaction-type-toggle">
            <button
              type="button"
              className={isExpense ? 'active' : 'inactive'}
              onClick={() => setIsExpense(true)}
            >
              Expense
            </button>
            <button
              type="button"
              className={!isExpense ? 'active' : 'inactive'}
              onClick={() => setIsExpense(false)}
            >
              Income
            </button>
          </div>

          <label>
            Transaction
            <input 
              type="text" 
              value={description} 
              maxLength={30}
              placeholder="e.g. Grocery Store or Salary" 
              onChange={(e) => setDescription(e.target.value)} 
              required 
            />
          </label>

          <label>
            Amount
            <div className="input-with-prefix">
              <span className="money-prefix">$</span>
              <input 
                type="number" 
                value={amount}
                min="0" 
                step="0.01"
                placeholder="e.g. 1000"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') return setAmount('');
                  if (/^\d*\.?\d{0,2}$/.test(value)) {
                    setAmount(value);
                  }
                }}
                onKeyDown={(e) => {
                  if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault();
                }}
                required
              />
            </div>
          </label>

          {isExpense && (
            <label>
              Category
              <div className="custom-dropdown" ref={dropdownRef}>
                <div 
                  className="custom-dropdown__selected" 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {selectedBudget || 'Select a category'}
                </div>

                {dropdownOpen && (
                  <div className="custom-dropdown__list">
                    {budgets.map(budget => (
                      <div
                        key={budget.id}
                        className="custom-dropdown__option"
                        onClick={() => {
                          setSelectedBudget(budget.name);
                          setDropdownOpen(false);
                        }}
                      >
                        {budget.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </label>
          )}

          <div className="modal-actions">
            <button type="submit">Add Transaction</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTransactionModal;


// Pre-deployment code check DONE