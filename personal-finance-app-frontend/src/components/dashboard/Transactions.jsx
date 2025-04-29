import './Transactions.scss';
import React, { useState, useEffect } from 'react';
import Search from './transactions/Search';
import SortBy from './transactions/SortBy';
import SortCategory from './transactions/SortCategory';
import TransactionsTable from './transactions/TransactionsTable';
import AddTransactionModal from './transactions/AddTransactionModal';
import PaginationButtons from './transactions/PaginationButtons';

function Transactions( {userId} ) {

    const [budgets, setBudgets] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [addTransactionsModal, setAddTransactionsModal] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(transactions.length / itemsPerPage);

    const paginatedTransactions = transactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );

    const handleDeleteTransaction = async (transactionId) => {
        try {
          const res = await fetch(`http://localhost:5050/transactions/${transactionId}`, {
            method: 'DELETE',
          });
          if (!res.ok) throw new Error('Failed to delete transaction');
      
          // Refetch or update transactions after delete
          fetchTransactions(); // Assuming you have fetchTransactions() already
        } catch (err) {
          console.error('Error deleting transaction:', err);
        }
      };

    
    const fetchTransactions = async () => {
        const res = await fetch(`http://localhost:5050/transactions/${userId}`);
        const data = await res.json();
        setTransactions(data);
      };

    useEffect(() => {
      fetch(`http://localhost:5050/budgets/${userId}`)
        .then(res => res.json())
        .then(data => setBudgets(data))
        .catch(err => console.error('Error fetching budgets:', err));
    }, [userId]);

    useEffect(() => {
    fetch(`http://localhost:5050/transactions/${userId}`)
        .then(res => res.json())
        .then(data => {
        console.log("Fetched transactions:", data); 
        setTransactions(data);
        })
        .catch(err => console.error('Error fetching transactions:', err));
    }, [userId]);

    const handleSortChange = (selectedCategory) => {
        console.log('Selected category:', selectedCategory);
        // You can now filter your transactions based on selectedCategory
      };

      // 

    return (
        <div className="transactions">
            <div className='transactions__header'>
                <h1>Transactions</h1>
                <button className='add-transaction' onClick={() => setAddTransactionsModal(true)}>+ Add New Transaction</button> 
            </div>
            <div className='transactions__content-container'>
                <div class='transactions__content'>
                    <div className='search-container'>
                        <Search placeholder="Search transaction"/>
                    </div>
                    <div className='sort-container'>
                        <SortBy/>
                        <SortCategory budgets={budgets} onSortChange={handleSortChange}/>
                    </div>
                    
                </div>
                <div className='transactions__table'>
                    <TransactionsTable transactions={paginatedTransactions} onDeleteTransaction={handleDeleteTransaction}/>
                </div>

                <PaginationButtons 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                />
            </div>


            {addTransactionsModal && (
                <AddTransactionModal
                    userId={userId}
                    budgets={budgets}
                    onClose={() => setAddTransactionsModal(false)}
                    onTransactionCreated={fetchTransactions}
                />
            )}
        </div>
    );
}

export default Transactions;