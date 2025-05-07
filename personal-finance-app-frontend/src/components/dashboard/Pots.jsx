import './Pots.scss';
import React, { useState, useEffect, useCallback } from 'react';
import PotItem from './pots/PotItem';
import AddPotModal from './pots/AddPotModal';
import ButtonPrimary from '../reusable/small/ButtonPrimary';

function Pots({ userId }) {
  const [pots, setPots] = useState([]);
  const [showAddModal, setAddShowModal] = useState(false);
  const [showEditModal, setEditModal] = useState(false);
  const [potToEdit, setPotToEdit] = useState(null);
  const usedColors = pots.map(p => p.color_id);

  // Fetch Pots  const fetchPots = useCallback(async () => {
    const fetchPots = useCallback(async () => {
        try {
          const res = await fetch(`http://localhost:5050/pots/${userId}`);
          if (!res.ok) throw new Error("Failed to fetch pots");
          const data = await res.json();
          setPots(data);
        } catch (err) {
          console.error('Error fetching pots:', err);
        }
      }, [userId]);
    
      // Initial data load with proper dependency management
      useEffect(() => {
        fetchPots();
      }, [fetchPots]);

  return (
    <div className="pots">
      <div className='pots__header'>
        <h1>Pots</h1>
        <ButtonPrimary text="+ Add New Pot" onClick={() => setAddShowModal(true)} className='add-pot' />
      </div>

      {/* Add Pot Modal */}
      {showAddModal && (
        <AddPotModal
          userId={userId}
          onClose={() => setAddShowModal(false)}
          onPotCreated={fetchPots}
          usedColors={usedColors}
        />
      )}

      {/* Edit Pot Modal */}
      {showEditModal && (
        console.log("Pot to edit:", potToEdit) // Debugging line
      )}

      {/* Pot List */}
      <div className='pots__grid'>
        {pots.map((pot) => (
          <PotItem
            key={pot.id}
            pot={pot}
            onPotUpdated={fetchPots}
            onEdit={() => {
              setPotToEdit(pot);
              setEditModal(true);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default Pots;
