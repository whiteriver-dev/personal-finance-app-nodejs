import './BarSummary.scss';
import React, { useState } from 'react';
import DeleteConfirmModal from '../../reusable/small/DeleteConfirmModal';
import OptionsDropdown from '../../reusable/small/OptionsDropdown';

function BarSummary({ budgetId, name, spent, amount, color, transactions, onBudgetUpdated, onEdit }) {
  
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Handlers
    const handleEdit = () => {
        onEdit();
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

    // Dropdown Options
    const options = [
        { label: 'Edit Budget', action: handleEdit },
        { label: 'Delete Budget', action: () => setShowDeleteModal(true) }
    ];

    const percentage = Math.min((Math.abs(spent) / amount) * 100, 100);

    return (
        <div className="bar-summary">
            <div className="bar-summary__header">
                <div className="bar-summary__header-title">
                    <span className="bar-summary__color-dot" style={{ backgroundColor: color }}></span>
                    <h2>{name}</h2>
                </div>
                <OptionsDropdown options={options} />
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
                    <span className='bar-summary__spent-remaining-colorcode' style={{ backgroundColor: color }}></span>
                    <p className='spent'>
                        <span className='spent-remaining__label'>Spent</span>
                        <span className='spent-remaining__amount'>${Math.abs(spent)}</span>
                    </p>
                    <p className='remaining'>
                        <span className='spent-remaining__label'>Remaining</span>
                        <span className='spent-remaining__amount'>${amount}</span>
                    </p>
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
                                    <span className={`latest-amount ${tx.amount > 0 ? 'positive' : ''}`}>
                                        {tx.amount < 0 ? '-' : ''}${Math.abs(tx.amount)}
                                    </span>
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

            {showDeleteModal && (
                <DeleteConfirmModal
                    name={name}
                    onConfirm={handleDelete}
                    onCancel={() => {
                        setShowDeleteModal(false);
                    }}
                    confirmMessage={'Are you sure you want to delete this budget? This action cannot be reversed, and all the data inside it will be removed forever.'}
                />
            )}
        </div>
    );
};

export default BarSummary;


// Pre-deployment code check DONE
