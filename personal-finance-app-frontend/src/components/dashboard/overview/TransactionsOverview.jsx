import './TransactionsOverview.scss';
import React from 'react';
import { CaretRightIcon } from '../../reusable/small/Icons';
function TransactionsOverview({ transactions, setActiveSection }) {
  const lastFiveTransactions = transactions.slice(0, 5);

  // Format to currency
const formatCurrency = (amount) => {
  const isNegative = amount < 0;
  const formattedAmount = Math.abs(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  return isNegative ? `-$${formattedAmount}` : `+$${formattedAmount}`;
};

    return (
        <div className='transactions-overview'>
            <div className='overview-header'>
            <h2 className='overview-header__title'>Transactions</h2>
            <button className='see-details'
                onClick={() => {
                    setActiveSection('transactions');
                }}>
                See details <span><CaretRightIcon size='11' color='#201F24'/></span>
                </button>
            </div>
            <div className='transactions-overview__list'>
                {lastFiveTransactions.map((transaction) => (
                    <div key={transaction.id} className='transaction-item'>
                        <div className='transaction-item__name'>
                            <h4>{transaction.description}</h4>

                        </div>
                        <div className={`transaction-item__info ${transaction.amount < 0 ? 'negative' : 'positive'}`}>
                            <span>{formatCurrency(transaction.amount)}</span>
                            <p>{new Date(transaction.date).toLocaleDateString()}</p>
                        </div>
                    </div>
                    ))}
            </div>
        </div>
    );
}

export default TransactionsOverview;