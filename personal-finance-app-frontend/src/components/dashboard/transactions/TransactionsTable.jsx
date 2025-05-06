import './TransactionsTable.scss';
import React, { useState } from 'react';
import DeleteConfirmModal from '../budgets/DeleteConfirmModal';

function TransactionsTable({ transactions, onDeleteTransaction }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  

                                      
  return (
    <div className="transactions-table">
      {/* Desktop view */}
      <table className="transactions-table__desktop">
        <thead>
          <tr>
            <th>Transaction</th>
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
              <td className={`transaction-amount ${tx.amount >= 0 ? 'positive' : 'negative'}`}> {tx.amount >= 0 ? `+$${tx.amount}` : `-$${Math.abs(tx.amount)}`}</td>
              <td className='transact-delete-btn'>        
                    <button onClick={() => {
                      setShowDeleteModal(true);
                      setTransactionToDelete(tx);
                      }}>✕</button>
              </td>
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
              <span className={`transaction-amount ${tx.amount >= 0 ? 'positive' : 'negative'}`}> {tx.amount >= 0 ? `+$${tx.amount}` : `-$${Math.abs(tx.amount)}`}</span>
              <span className="date">{new Date(tx.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              <span className='transact-delete-btn'>        
                <button onClick={() => {
                        setShowDeleteModal(true);
                        setTransactionToDelete(tx);
                        }}>✕</button>
              </span>

              

              
            </div>
            
          </div>
        ))}
        
      </div>
      {showDeleteModal && transactionToDelete && (
        <DeleteConfirmModal
          name={transactionToDelete.description}
          onConfirm={() => {
            onDeleteTransaction(transactionToDelete.id);
            setShowDeleteModal(false);
            setTransactionToDelete(null);
          }}
          onCancel={() => {
            setShowDeleteModal(false);
            setTransactionToDelete(null);
          }}
          confirmMessage="Are you sure you want to delete this transaction? This action cannot be reversed, and all the data inside it will be removed forever."
        />
      )}
    </div>
    
  );
}

export default TransactionsTable;
