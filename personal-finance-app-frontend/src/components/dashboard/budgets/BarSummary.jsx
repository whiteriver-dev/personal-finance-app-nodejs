import './BarSummary.scss';
import React from 'react';
import colors from '../../../constants/budgetColors';

function BarSummary({ name, spent, amount, transactions, index }) {

    const percentage = Math.min((spent / amount) * 100, 100);
    const color = colors[index % colors.length];

    return (
        <div className="bar-summary">
            <div className ="bar-summary__header">
                <h2>{name}</h2>
                <button className='budgets__options'>...</button>
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
                    <p className='spent'><span className='spent-remaining__label'>Spent</span><span className='spent-remaining__amount'>${spent}</span></p>
                    <p className='remaining'><span className='spent-remaining__label'>Remaining</span><span className='spent-remaining__amount'>${amount} remaining</span></p>
                </div>
            </div>
            <div className="bar-summary__latest-transactions">
                <h2>Latest Spending</h2>
                <ul className="bar-summary__latest-list">
                    {transactions.length === 0 ? (
                        <li className="bar-summary__latest-empty">No recent transactions</li>
                    ) : (
                        transactions.map(tx => (
                        <li key={tx.id} className="bar-summary__latest-item">
                            ${tx.amount} – {tx.description}
                        </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    )
};

export default BarSummary;