import './Pots.scss';
import React, { useState, useEffect, useCallback } from 'react';
import PotItem from './pots/PotItem';
import AddPotModal from './pots/AddPotModal';
import EditPotModal from './pots/EditPotModal';
import ButtonPrimary from '../reusable/small/ButtonPrimary';
import { API_URL } from '../../utils/api';

function Pots({ userId }) {
  const [pots, setPots] = useState([]);
  const [colors, setColors] = useState([]);
  const [showAddModal, setAddShowModal] = useState(false);
  const [showEditModal, setEditModal] = useState(false);
  const [potToEdit, setPotToEdit] = useState(null);

    // Fetch all colors
    const fetchColors = useCallback(async () => {
        try {
          const res = await fetch(`${API_URL}/colors`);
          if (!res.ok) throw new Error("Failed to fetch colors");
          const data = await res.json();
          setColors(data);
        } catch (err) {
          console.error('Error fetching colors:', err);
        }
      }, []);

        // Get used color IDs
        const usedColors = pots.map(p => {
            const colorObj = colors.find(color => color.hex === p.color);
            return colorObj ? colorObj.id : null;
        }).filter(Boolean);
  
  // Fetching pots from backend
  const fetchPots = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/pots/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch pots");
      const data = await res.json();
      setPots(data);
    } catch (err) {
      console.error('Error fetching pots:', err);
    }
  }, [userId]);

  useEffect(() => {
    fetchPots();
    fetchColors();
  }, [fetchPots, fetchColors]);

  return (
    <div className="pots">
      <div className='pots__header'>
        <h1>Pots</h1>
        <ButtonPrimary text="+ Add New Pot" onClick={() => setAddShowModal(true)} className='add-pot' />
      </div>

      {showAddModal && (
        <AddPotModal
          userId={userId}
          onClose={() => setAddShowModal(false)}
          onPotCreated={fetchPots}
          usedColors={usedColors}
        />
      )}

      {showEditModal && potToEdit && (
        <EditPotModal
          pot={potToEdit}
          onClose={() => {
            setEditModal(false);
            setPotToEdit(null);
          }}
          onPotUpdated={fetchPots}
          usedColors={usedColors}
        />
      )}

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


// Pre-deployment code check DONE
