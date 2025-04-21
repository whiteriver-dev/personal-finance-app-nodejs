import React, { useState } from 'react';
import './EditBudgetModal.scss';
import { allBudgetColors } from '../../../constants/budgetColors';

function EditBudgetModal({ budget, onClose, onBudgetUpdated }) {
  const [name, setName] = useState(budget.name);
  const [amount, setAmount] = useState(budget.amount);
  const [color, setColor] = useState(budget.color_id);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedBudget = {
      name,
      amount: parseFloat(amount),
      color,
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
      console.error('Error:', err);
    }
  };

  return (
    <div className="edit-modal-backdrop">
      <div className="edit-modal">
        <h2>Edit Budget</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label>
            Amount:
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </label>
          <label>
            Color:
            <select value={color} onChange={(e) => setColor(e.target.value)}>
              {Object.entries(allBudgetColors).map(([label, hex]) => (
                <option key={hex} value={hex}>{label}</option>
              ))}
            </select>
          </label>
          <div className="edit-modal__actions">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditBudgetModal;
