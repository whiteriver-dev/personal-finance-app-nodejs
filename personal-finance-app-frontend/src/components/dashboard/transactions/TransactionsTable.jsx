import React from 'react';
import './TransactionsTable.scss'; // We'll create basic styling next

function TransactionsTable({ transactions }) {
  return (
    <div className="transactions-table">
      <table>
        <thead>
          <tr>
            <th>Recipient / Sender</th>
            <th>Category</th>
            <th>Transaction Date</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan="4" className="no-transactions">No transactions available</td>
            </tr>
          ) : (
            transactions.map((tx) => (
              <tr key={tx.id}>
                <td className='recipient'>{tx.description}</td>
                <td>{tx.category}</td>
                <td>{new Date(tx.date).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}</td>
                <td className='transaction-amount'>${parseFloat(tx.amount).toFixed(2)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionsTable;
