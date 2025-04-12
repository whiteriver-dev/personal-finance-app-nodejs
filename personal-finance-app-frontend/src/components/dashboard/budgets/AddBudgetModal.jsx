import React, { useState } from 'react';
import './AddBudgetModal.scss';

function AddBudgetModal({ userId, onClose, onBudgetCreated }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newBudget = {
      name,
      amount: parseFloat(amount),
      user_id: userId,
    };

    try {
      const res = await fetch('http://localhost:5000/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBudget),
      });

      if (!res.ok) throw new Error('Failed to create budget');

      onBudgetCreated(); // Triggers refetch in parent
      onClose();         // Closes modal
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
