import './PotItem.scss';
import React, { useState } from 'react';
import OptionsDropdown from '../../reusable/small/OptionsDropdown';
import DeleteConfirmModal from '../../reusable/small/DeleteConfirmModal';

function PotItem({ pot, onEdit, onPotUpdated }) {
  const percentage = Math.min(((pot.saved / pot.target) * 100).toFixed(2), 100);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5050/pots/${pot.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete');
      onPotUpdated();
      setShowDeleteModal(false);
    } catch (err) {
      console.error('Error deleting pot:', err);
    }
  };

  const options = [
    { label: 'Edit Pot', action: onEdit },
    { label: 'Delete Pot', action: () => setShowDeleteModal(true) }
  ];

  // ➕ Add Money Handler
  const handleAddClick = () => {
    console.log('Add Money clicked for:', pot.name);
    // Logic to open the Add Money modal or interface
  };

  // ➖ Withdraw Handler
  const handleWithdrawClick = () => {
    console.log('Withdraw clicked for:', pot.name);
    // Logic to open the Withdraw modal or interface
  };

  return (
    <div className="pot" style={{ borderColor: pot.color }}>
      <div className='pot__header'>
        <div className="pot__header-title">
          <span className="pot__color" style={{ backgroundColor: pot.color }}></span>
          <h2>{pot.name}</h2>
        </div>
        <OptionsDropdown options={options} />
      </div>
      <div className='pot__saved'>
        <p>Total Saved </p><span>${pot.saved}</span>
      </div>
      <div className="pot__progress-bar"> 
        <div
          className="pot__progress-bar-fill"
          style={{ width: `${percentage}%`, backgroundColor: pot.color }}
        />
      </div>
      <div className="pot__details">
        <span className='pot__percentage'>{percentage}%</span>
        <span className='pot__goal'>Target of ${pot.target}</span>
      </div>
      
      <div className="pot__actions">
        <button onClick={handleAddClick}>+ Add Money</button>
        <button onClick={handleWithdrawClick}>Withdraw</button>
      </div>

      {showDeleteModal && (
        <DeleteConfirmModal
          name={pot.name}
          onConfirm={handleDelete}
          onCancel={() => {
            setShowDeleteModal(false);
          }}
          confirmMessage={'Are you sure you want to delete this pot? This action cannot be reversed, and all the data inside it will be removed forever.'}
        />
      )}
    </div>
  );
}

export default PotItem;
