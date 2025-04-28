import './TransactionsTable.scss';
import React from 'react';

function TransactionsTable({ transactions }) {
  return (
    <div className="transactions-table">
      {/* Desktop view */}
      <table className="transactions-table__desktop">
        <thead>
          <tr>
            <th>Recipient / Sender</th>
            <th>Category</th>
            <th>Transaction Date</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(tx => (
            <tr key={tx.id}>
              <td className='recipient'>{tx.description}</td>
              <td>{tx.category}</td>
              <td>{new Date(tx.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
              <td className='transaction-amount'>{tx.amount < 0 ? '-' : ''}${Math.abs(tx.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile view */}
      <div className="transactions-table__mobile">
        {transactions.map(tx => (
          <div key={tx.id} className="transactions-table__mobile-card">
            <div className="transactions-table__row">
              <span className="recipient">{tx.description}</span>
              <span className="category">{tx.category}</span>
            </div>
            <div className="transactions-table__row">
              <span className="transaction-amount">{tx.amount < 0 ? '-' : ''}${Math.abs(tx.amount)}</span>
              <span className="date">{new Date(tx.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TransactionsTable;
