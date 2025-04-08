import './Budgets.scss';
import React, { useState, useEffect } from 'react';
import DonutChart from './budgets/DonutChart';
import BarSummary from './budgets/BarSummary';

function Budgets({ userId }) {

    const [budgets, setBudgets] = useState([]);
    const [transactions, setTransactions] = useState([]);
    
      useEffect(() => { // Fetch $ spent of Budgets
        fetch(`http://localhost:5000/budgets-with-spent/${userId}`)
          .then((res) => res.json())
          .then((data) => setBudgets(data))
          .catch((err) => console.error('Error fetching budgets:', err));
      }, [userId]);

      useEffect(() => {
        fetch(`http://localhost:5000/transactions/${userId}`)
          .then(res => res.json())
          .then(data => {
            console.log("Fetched transactions:", data); // 👈 What does this show?
            setTransactions(data);
          })
          .catch(err => console.error('Error fetching transactions:', err));
      }, [userId]);
      


    return (
        <div className="budgets">
        <h1>Budgets</h1>
  
        {budgets.map((budget, i) => {
          const budgetTransactions = transactions

            .filter(tx => tx.category === budget.name)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3);
  
          return (
            <BarSummary
              key={budget.id}
              name={budget.name}
              spent={budget.spent}
              amount={budget.amount}
              transactions={budgetTransactions}
              index={i}
            />
          );
        })}
      </div>
    );
}

export default Budgets;

// <DonutChart data={budgets} width={240} height={240} />