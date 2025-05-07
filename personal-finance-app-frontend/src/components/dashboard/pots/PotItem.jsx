import './PotItem.scss';
import React from 'react';

function PotItem({ pot }) {
    
  const percentage = Math.min(((pot.saved / pot.target) * 100).toFixed(2), 100);


  const handleAddClick = () => {
    console.log("Add Money clicked for:", pot.name);
    // Add modal logic here
  };

  const handleWithdrawClick = () => {
    console.log("Withdraw clicked for:", pot.name);
    // Withdraw modal logic here
  };

  return (
    <div className="pot" style={{ borderColor: pot.color }}>
      <div className="pot__header">
        <span className="pot__color" style={{ backgroundColor: pot.color }}></span>
        <h2>{pot.name}</h2>
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
        <span className='pot__percentage'>{percentage}%</span><span className='pot__goal'>Target of ${pot.target}</span>
      </div>
      <div className="pot__actions">
        <button onClick={handleAddClick}>+ Add Money</button>
        <button onClick={handleWithdrawClick}>Withdraw</button>
      </div>
    </div>
  );
}

export default PotItem;
