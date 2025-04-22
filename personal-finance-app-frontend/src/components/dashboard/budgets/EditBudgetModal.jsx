import React, { useState, useEffect } from 'react';
import './EditBudgetModal.scss';

function EditBudgetModal({ budget, onClose, onBudgetUpdated }) {
  const [name, setName] = useState(budget.name);
  const [amount, setAmount] = useState(budget.amount);
  const [colorId, setColorId] = useState(budget.color_id);
  const [colors, setColors] = useState([]);

  // Fetch all colors from the database
  useEffect(() => {
    fetch('http://localhost:5050/colors')
      .then(res => res.json())
      .then(data => setColors(data))
      .catch(err => console.error('Error fetching colors:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedBudget = {
      name,
      amount: parseFloat(amount),
      color_id: colorId,  // <- Use correct field name
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
            <select value={colorId} onChange={(e) => setColorId(Number(e.target.value))}>
              {colors.map(color => (
                <option key={color.id} value={color.id}>
                  {color.name}
                </option>
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
