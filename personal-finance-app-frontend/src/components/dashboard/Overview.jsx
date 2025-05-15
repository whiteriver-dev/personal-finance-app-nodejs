import './Overview.scss';
import React, { useEffect, useState} from 'react'; 
import PotsOverview from './overview/PotsOverview';

function Overview( {userId} ) {
  const [pots, setPots] = useState([]);
 // const [budgets, setBudgets] = useState([]);
  const [totalSaved, setTotalSaved] = useState(0);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const potsRes = await fetch(`http://localhost:5050/pots/${userId}`);
    //    const budgetsRes = await fetch(`http://localhost:5050/budgets/${userId}`);
        
     //   if (!potsRes.ok || !budgetsRes.ok) throw new Error('Failed to fetch data');

        const potsData = await potsRes.json();
    //    const budgetsData = await budgetsRes.json();

        setPots(potsData);
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
                <PotsOverview pots={pots} totalSaved={totalSaved}/>
            </div>
        </div>
    );
}


export default Overview;