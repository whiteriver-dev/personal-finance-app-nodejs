import './PotItem.scss';
import React, { useState } from 'react';
import OptionsDropdown from '../../reusable/small/OptionsDropdown';
import DeleteConfirmModal from '../../reusable/small/DeleteConfirmModal';
import EditPotModal from './EditPotModal';

function PotItem({ pot, onPotUpdated, usedColors }) {
  const percentage = Math.min(((pot.saved / pot.target) * 100).toFixed(2), 100);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Handlers need to be defined before they are used in options
  const handleEdit = () => {
    setShowEditModal(true);
  };

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

  // Dropdown Options
  const options = [
    { label: 'Edit Pot', action: handleEdit },
    { label: 'Delete Pot', action: () => setShowDeleteModal(true) }
  ];

  const handleAddClick = () => {
    console.log('Add Money clicked for:', pot.name);
    // Add modal logic here
  };

  const handleWithdrawClick = () => {
    console.log('Withdraw clicked for:', pot.name);
    // Withdraw modal logic here
  };

  return (
    <>
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

      {showEditModal && (
        <EditPotModal
          pot={pot}
          onClose={() => setShowEditModal(false)}
          onPotUpdated={onPotUpdated}
          usedColors={usedColors}
        />
      )}
    </>
  );
}

export default PotItem;
