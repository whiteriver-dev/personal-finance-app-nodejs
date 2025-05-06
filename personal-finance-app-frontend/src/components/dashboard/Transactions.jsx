import './Transactions.scss';
import React, { useState, useEffect, useCallback } from 'react';
import Search from './transactions/Search';
import SortBy from './transactions/SortBy';
import SortCategory from './transactions/SortCategory';
import TransactionsTable from './transactions/TransactionsTable';
import AddTransactionModal from './transactions/AddTransactionModal';
import PaginationButtons from './transactions/PaginationButtons';

function Transactions({ userId }) {
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [addTransactionsModal, setAddTransactionsModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // Fetch paginated transactions
  const fetchTransactions = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:5050/transactions?userId=${userId}&page=${currentPage}&limit=${itemsPerPage}`);
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  }, [userId, currentPage]);

  // Fetch total transaction count
  const fetchTransactionCount = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:5050/transactions/count?userId=${userId}`);
      const data = await res.json();
      setTotalCount(data.total);
    } catch (err) {
      console.error('Error fetching transaction count:', err);
    }
  }, [userId]);

  const handleDeleteTransaction = async (transactionId) => {
    try {
      const res = await fetch(`http://localhost:5050/transactions/${transactionId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete transaction');
      await fetchTransactions();
      await fetchTransactionCount();
    } catch (err) {
      console.error('Error deleting transaction:', err);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchTransactionCount();
  }, [fetchTransactions, fetchTransactionCount]);

  useEffect(() => {
    fetch(`http://localhost:5050/budgets/${userId}`)
      .then(res => res.json())
      .then(data => setBudgets(data))
      .catch(err => console.error('Error fetching budgets:', err));
  }, [userId]);

  const handleSortChange = (selectedCategory) => {
    console.log('Selected category:', selectedCategory);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="transactions">
      <div className='transactions__header'>
        <h1>Transactions</h1>
        <button className='add-transaction' onClick={() => setAddTransactionsModal(true)}>+ Add New Transaction</button>
      </div>
      <div className='transactions__content-container'>
        <div className='transactions__top'>
          <div className='transactions__content'>
            <div className='search-container'>
              <Search placeholder="Search transaction" />
            </div>
            <div className='sort-container'>
              <SortBy />
              <SortCategory budgets={budgets} onSortChange={handleSortChange} />
            </div>
          </div>
          <div className='transactions__table'>
            <TransactionsTable
              transactions={transactions}
              onDeleteTransaction={handleDeleteTransaction}
            />
          </div>
        </div>
        <div className='transactions__bottom'>
          <PaginationButtons
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {addTransactionsModal && (
        <AddTransactionModal
          userId={userId}
          budgets={budgets}
          onClose={() => setAddTransactionsModal(false)}
          onTransactionCreated={() => {
            fetchTransactions();
            fetchTransactionCount();
          }}
        />
      )}
    </div>
  );
}

export default Transactions;
