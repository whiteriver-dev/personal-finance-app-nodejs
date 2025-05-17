import './Transactions.scss';
import React, { useState, useEffect, useCallback } from 'react';
import Search from './transactions/Search';
import SortBy from './transactions/SortBy';
import SortCategory from './transactions/SortCategory';
import TransactionsTable from './transactions/TransactionsTable';
import AddTransactionModal from './transactions/AddTransactionModal';
import PaginationButtons from './transactions/PaginationButtons';
import useDebounce from '../../utils/useDebounce';

function Transactions({ userId }) {

  // State for transactions and budgets
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [addTransactionsModal, setAddTransactionsModal] = useState(false);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 400); // Ensures 400 millisecond delay after typing has stopped to submit query to database - reduce bandwidth

  // State for sorting
  const [sort, setSort] = useState("latest");

  // State for sorting categories
  const [categoryFilter, setCategoryFilter] = useState('All Transactions');
  const categoryQuery = categoryFilter !== 'All Transactions' ? `&category=${categoryFilter}` : '';

  // Handlers

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // reset page
  };
  
  const handleSortChange = (sortOption) => {
    setSort(sortOption);
    setCurrentPage(1); // reset page
  };
  
  const handleCategoryChange = (category) => {
    setCategoryFilter(category);
    setCurrentPage(1); // reset page
  };
  

  // Fetch paginated transactions
  const fetchTransactions = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:5050/transactions?userId=${userId}&page=${currentPage}&limit=${itemsPerPage}&search=${debouncedSearchQuery}&sort=${sort}${categoryQuery}`);
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  }, [userId, currentPage, itemsPerPage, debouncedSearchQuery, sort, categoryQuery]);
  

  // Fetch total transaction count
  const fetchTransactionCount = useCallback(async () => {
    try {
      const categoryQuery = categoryFilter !== 'All Transactions' ? `&category=${categoryFilter}` : '';
      const res = await fetch(
        `http://localhost:5050/transactions/count?userId=${userId}&search=${debouncedSearchQuery}${categoryQuery}`
      );
      const data = await res.json();
      setTotalCount(data.total);
    } catch (err) {
      console.error('Error getting transaction count:', err);
    }
  }, [userId, debouncedSearchQuery, categoryFilter]);
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
              <Search placeholder="Search transaction" onSearch={handleSearch} />
            </div>
            <div className='sort-container'>
              <SortBy onSortChange={handleSortChange} selectedOption={sort} />
              <SortCategory budgets={budgets} onSortChange={handleCategoryChange} />
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


// Pre-deployment code check DONE
