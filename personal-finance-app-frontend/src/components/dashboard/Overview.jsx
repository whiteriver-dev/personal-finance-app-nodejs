import './Overview.scss';
import React, { useEffect, useState} from 'react'; 
import PotsOverview from './overview/PotsOverview';
import TransactionsOverview from './overview/TransactionsOverview';
import BudgetsOverview from './overview/BudgetsOverview';
import { API_URL } from '../../utils/api';

function Overview( {userId, setActiveSection} ) {
  const [pots, setPots] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [totalSaved, setTotalSaved] = useState(0)

function formatCurrency(amount) {
  const sign = amount < 0 ? '-' : '';
  return `${sign}$${Math.abs(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const INCOME = transactions
  .filter(tx => Number(tx.amount) > 0)
  .reduce((sum, tx) => sum + Number(tx.amount), 0);

const EXPENSES = transactions
  .filter(tx => Number(tx.amount) < 0)
  .reduce((sum, tx) => sum + Math.abs(Number(tx.amount)), 0);

const BALANCE = INCOME - EXPENSES;


  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const potsRes = await fetch(`${API_URL}/pots/${userId}`);
        const potsData = await potsRes.json();
        const budgetsRes = await fetch(`${API_URL}/budgets-with-spent/${userId}`);
        
        if (!potsRes.ok || !budgetsRes.ok) throw new Error('Failed to fetch data');


        const budgetsData = await budgetsRes.json();

        const transactionsRes = await fetch(`${API_URL}/transactions?userId=${userId}`);
        const transactionsData = await transactionsRes.json();

        setPots(potsData);
        setTransactions(transactionsData);
        setBudgets(budgetsData);

        // Calculate total saved
        const total = potsData.reduce((acc, pot) => Number(acc) + Number(pot.saved), 0);
        setTotalSaved(total);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [userId]);

    return (
        <div className="overview">
            <h1 className='overview__header'>Overview</h1>
            <div className='balance-income-expenses'>
                <div className='balance-income-expenses__item dark'>
                    <h2 className='balance-income-expenses__item-header'>Current Balance</h2>
                    <p className='balance-income-expenses__item-value'>{formatCurrency(BALANCE)}</p>
                </div>
                <div className='balance-income-expenses__item'>
                    <h2 className='balance-income-expenses__item-header'>Income</h2>
                    <p className='balance-income-expenses__item-value'>{formatCurrency(INCOME)}</p>
                </div>
                <div className='balance-income-expenses__item'>
                    <h2 className='balance-income-expenses__item-header'>Expenses</h2>
                    <p className='balance-income-expenses__item-value'>{formatCurrency(EXPENSES)}</p>
                </div>
            </div>
            <div className='overview__grid'>
                <PotsOverview pots={pots} totalSaved={totalSaved} setActiveSection={setActiveSection}/>
                <TransactionsOverview transactions={transactions} setActiveSection={setActiveSection}/>
                <BudgetsOverview budgets={budgets} setActiveSection={setActiveSection}/>
            </div>
        </div>
    );
}


export default Overview;


// Pre-deployment code check DONE