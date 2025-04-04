import './Transactions.scss';
import React from 'react';
import Search from './small/Search';
import SortBy from './small/SortBy';

function Transactions() {
    return (
        <div className="transactions">
            <h1>Transactions</h1>
            <div class='transactions__content'>
                <div className='search-sort-container'>
                    <Search placeholder="Search transaction"/>
                    <SortBy/>
                </div>
            </div>
        </div>
    );
}

export default Transactions;