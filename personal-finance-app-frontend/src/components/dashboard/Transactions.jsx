import './Transactions.scss';
import React from 'react';
import Search from './small/Search';

function Transactions() {
    return (
        <div className="transactions">
            <h1>Transactions</h1>
            <Search placeholder="Search transaction"/>
        </div>
    );
}

export default Transactions;