import './Pots.scss';
import React, { useState, useEffect, useCallback } from 'react';
import PotItem from './pots/PotItem';
import ButtonPrimary from '../reusable/small/ButtonPrimary';


function Pots( { userId }) {

    const [pots, setPots] = useState([]);

    const fetchPots = useCallback(async () => {
      try {
        const res = await fetch(`http://localhost:5050/pots/${userId}`);
        if (res.ok) {
          const data = await res.json();
          console.log('Pots fetched:', data);
          setPots(data);
        } else {
          console.error(`Error fetching pots: ${res.statusText}`);
        }
      } catch (err) {
        console.error('Error fetching pots:', err);
      }
    }, [userId]);

    useEffect(() => {
      fetchPots();
    }, [fetchPots]);

    return (
        <div className="pots">
            <div className='pots__header'>
                <h1>Pots</h1>
                <ButtonPrimary text="+ Create New Pot" onClick={() => console.log("Create new pot")} className='add-pot' />
            </div>
            <div className='pots__grid'>
            {pots.length > 0 ? (
                pots.map((pot) => (
                    <PotItem
                    key={pot.id}
                    pot={pot}
                    onPotUpdated={fetchPots}
                    />
                ))
                ) : (
                <p>No pots found. Start saving now!</p>
                )}
            </div>
        </div>
    );
}

export default Pots;