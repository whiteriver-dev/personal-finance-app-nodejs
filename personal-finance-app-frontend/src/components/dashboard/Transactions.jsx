import './Transactions.scss';
import React, { useState, useEffect } from 'react';
import Search from './transactions/Search';
import SortBy from './transactions/SortBy';
import SortCategory from './transactions/SortCategory';

function Transactions( userId) {

    const [budgets, setBudgets] = useState([]);

    useEffect(() => {
      fetch(`http://localhost:5050/budgets/${userId}`)
        .then(res => res.json())
        .then(data => setBudgets(data))
        .catch(err => console.error('Error fetching budgets:', err));
    }, [userId]);

    const handleSortChange = (selectedCategory) => {
        console.log('Selected category:', selectedCategory);
        // You can now filter your transactions based on selectedCategory
      };

    return (
        <div className="transactions">
            <h1>Transactions</h1>
            <div class='transactions__content'>
                <div className='search-container'>
                    <Search placeholder="Search transaction"/>
                </div>
                <div className='sort-container'>
                    <SortBy/>
                    <SortCategory budgets={budgets} onSortChange={handleSortChange}/>
                </div>
            </div>
        </div>
    );
}

export default Transactions;