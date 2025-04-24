import './BarSummary.scss';
import React, { useState, useRef, useEffect} from 'react';
import DeleteConfirmModal from './DeleteConfirmModal';

function BarSummary({ budgetId, name, spent, amount, color, transactions, onBudgetUpdated, onEdit }) {

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const dropdownRef = useRef(null);


    const percentage = Math.min((spent / amount) * 100, 100);

    useEffect(() => {
        const handleClickOutside = (e) => {
          if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setIsDropdownOpen(false);
          }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }, []);
    
      const handleEdit = () => {
        onEdit()
        setIsDropdownOpen(false);
      };
    
      const handleDelete = async () => {
        try {
          const res = await fetch(`http://localhost:5050/budgets/${budgetId}`, {
            method: 'DELETE',
          });
          if (!res.ok) throw new Error('Failed to delete');
      
          onBudgetUpdated(); 
          setShowDeleteModal(false);
        } catch (err) {
          console.error('Error deleting budget:', err);
        }
      };
      


    return (
        <div className="bar-summary">
            <div className ="bar-summary__header">
                <div className="bar-summary__header-title">
                    <span className="bar-summary__color-dot" style={{ backgroundColor: color }}></span>
                    <h2>{name}</h2>
                </div>
                <div class ='budget__options-container' ref={dropdownRef}>
                    <button className='budgets__options' onClick={() => setIsDropdownOpen((prev) => !prev)}>
                        <svg fill="none" height="4" viewBox="0 0 14 4" width="14" xmlns="http://www.w3.org/2000/svg">
                            <path d="m8.75 2c0 .34612-.10264.68446-.29493.97225-.19229.28778-.4656.51209-.78537.64454s-.67164.16711-1.01111.09958c-.33946-.06752-.65128-.23419-.89603-.47893-.24474-.24474-.41141-.55657-.47893-.89603-.06753-.33947-.03287-.69134.09958-1.01111.13246-.31977.35676-.593079.64454-.785372.28779-.192292.62613-.294928.97225-.294928.46413 0 .90925.184375 1.23744.512563.32819.328187.51256.773307.51256 1.237437zm-6.75-1.75c-.34612 0-.68446.102636-.97225.294928-.287783.192293-.512085.465602-.644538.785372-.132454.31977-.16711.67164-.099585 1.01111.067524.33946.234195.65129.478937.89603.244746.24474.556566.41141.896026.47893.33947.06753.69134.03287 1.01111-.09958s.59308-.35676.78537-.64454c.1923-.28779.29493-.62613.29493-.97225 0-.46413-.18437-.90925-.51256-1.237437-.32819-.328188-.77331-.512563-1.23744-.512563zm10 0c-.3461 0-.6845.102636-.9722.294928-.2878.192293-.5121.465602-.6446.785372-.1324.31977-.1671.67164-.0996 1.01111.0676.33946.2342.65129.479.89603.2447.24474.5565.41141.896.47893.3395.06753.6913.03287 1.0111-.09958s.5931-.35676.7854-.64454c.1923-.28779.2949-.62613.2949-.97225 0-.22981-.0453-.45738-.1332-.6697-.088-.21232-.2169-.405234-.3794-.567737-.1625-.162502-.3554-.291407-.5677-.379352-.2123-.087946-.4399-.133211-.6697-.133211z" fill="#B3B3B3"/>
                        </svg>
                    </button>
                    {isDropdownOpen && (
                        <div className="budget__dropdown">
                        <button className='budget__dropdown-edit' onClick={handleEdit}>Edit Budget</button>
                        <button className='budget__dropdown-delete' onClick={() => setShowDeleteModal(true)}>Delete Budget</button>
                        {showDeleteModal && (
                            <DeleteConfirmModal
                                onConfirm={handleDelete}
                                onCancel={() => setShowDeleteModal(false)}
                            />
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className='bar-summary__progress'>
                <p className='max-budget'>Maximum of ${amount}</p>
                <div className="bar-summary__bar-container">
                    <div
                    className="bar-summary__bar-fill"
                    style={{ width: `${percentage}%`, backgroundColor: color }}
                    />
                </div>
                <div className='bar-summary__spent-remaining'>
                <span className='bar-summary__spent-remaining-colorcode' style={{ backgroundColor: color}}></span>
                    <p className='spent'><span className='spent-remaining__label'>Spent</span><span className='spent-remaining__amount'>${spent}</span></p>
                    <p className='remaining'><span className='spent-remaining__label'>Remaining</span><span className='spent-remaining__amount'>${amount}</span></p>
                </div>
            </div>
            <div className="bar-summary__latest-transactions">
                <h2>Latest Spending</h2>
                {transactions.length === 0 ? (
                    <p className="bar-summary__latest-empty">No recent transactions</p>
                ) : (
                    <div className="bar-summary__latest-rows">
                    {transactions.map(tx => (
                        <div key={tx.id} className="bar-summary__latest-row">
                            <span className="latest-description">{tx.description}</span>
                            <span className="latest-amount-date">
                                <span className="latest-amount">${tx.amount}</span>
                                <span className="latest-date">
                                    {new Date(tx.date).toLocaleDateString('en-GB', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                    })}
                                </span>
                            </span>
                        </div>
                    ))}
                    </div>
                )}
            </div>
        </div>
    )
};

export default BarSummary;