import './Overview.scss';
import React, { useEffect, useState} from 'react'; 
import PotsOverview from './overview/PotsOverview';
import TransactionsOverview from './overview/TransactionsOverview';

function Overview( {userId, setActiveSection} ) {
  const [pots, setPots] = useState([]);
  const [transactions, setTransactions] = useState([]);
 // const [budgets, setBudgets] = useState([]);
  const [totalSaved, setTotalSaved] = useState(0);



  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const potsRes = await fetch(`http://localhost:5050/pots/${userId}`);
        const potsData = await potsRes.json();
    //    const budgetsRes = await fetch(`http://localhost:5050/budgets/${userId}`);
        
     //   if (!potsRes.ok || !budgetsRes.ok) throw new Error('Failed to fetch data');


    //    const budgetsData = await budgetsRes.json();

        const transactionsRes = await fetch(`http://localhost:5050/transactions?userId=${userId}`);
        const transactionsData = await transactionsRes.json();

        setPots(potsData);
        setTransactions(transactionsData);
     //   setBudgets(budgetsData);

        // Calculate total saved
        const total = potsData.reduce((acc, pot) => acc + pot.saved, 0);
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
                <PotsOverview pots={pots} totalSaved={totalSaved} setActiveSection={setActiveSection}/>
                <TransactionsOverview transactions={transactions} setActiveSection={setActiveSection}/>
            </div>
        </div>
    );
}


export default Overview;