import './PotsOverview.scss';
import React from 'react';
import { PotsOverviewIcon, CaretRightIcon } from '../../reusable/small/Icons';

function PotsOverview({ pots, totalSaved, setActiveSection} ) {

    const displayedPots = pots.slice(0, 4); // Maximum of 4 pots in overview

  // Format to currency
  const formatCurrency = (amount) => {
    return `$${amount.toFixed(0).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
  };

  return (
    <div className='pots-overview'>
      <div className='overview-header'>
        <h2 className='overview-header__title'>Pots</h2>
        <button className='see-details'
            onClick={() => {
                setActiveSection('pots');
            }}>
            See details <span><CaretRightIcon size='11' color='#201F24'/></span>
            </button>
        
      </div>
      <div className='pots-overview__content'>
        <div className='pots-overview__total-saved-container'>
          <div className='pots-overview__total-saved__icon'>
              <PotsOverviewIcon size={36} color='$green' />
          </div>
          <div className='pots-overview__total-saved'>
            <h3>Total Saved</h3>
            <p>{formatCurrency(totalSaved)}</p>
          </div>

        </div>
        <div className='pots-overview__grid'>
          {displayedPots.map((pot) => (
            <div key={pot.id} className='pots-overview__item'>
              <div
                className='pots-overview__color-indicator'
                style={{ backgroundColor: pot.color }}
              />
              <div className='pots-overview__details'>
                <h4>{pot.name}</h4>
                <span>{formatCurrency(pot.saved)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PotsOverview;


// Pre-deployment code check DONE