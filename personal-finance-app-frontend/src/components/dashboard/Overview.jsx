import './Overview.scss';
import React from 'react'; 

function Overview() {
    return (
        <div className="overview">
            <h1 className='overview__header'>Overview</h1>
            <div className='balance-income-expenses'>
                <div className='balance-income-expenses__item dark'>
                    <h2 className='balance-income-expenses__item-header'>Current Balance</h2>
                    <p className='balance-income-expenses__item-value'>$0.00</p>
                </div>
                <div className='balance-income-expenses__item'>
                    <h2 className='balance-income-expenses__item-header'>Income</h2>
                    <p className='balance-income-expenses__item-value'>$0.00</p>
                </div>
                <div className='balance-income-expenses__item'>
                    <h2 className='balance-income-expenses__item-header'>Expenses</h2>
                    <p className='balance-income-expenses__item-value'>$0.00</p>
                </div>
            </div>
            <div className='overview__grid'>

            </div>
        </div>
    );
}

export default Overview;