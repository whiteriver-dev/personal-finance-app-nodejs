import './Budgets.scss';
import React, { useState, useEffect } from 'react';
import DonutChart from './budgets/DonutChart';
import BarSummary from './budgets/BarSummary';
import AddBudgetModal from './budgets/AddBudgetModal';


function Budgets({ userId }) {

    const [budgets, setBudgets] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const usedColors = budgets.map(b => b.color);

    const fetchBudgets = async () => {
      const res = await fetch(`http://localhost:5050/budgets-with-spent/${userId}`);
      const data = await res.json();
      setBudgets(data);
    };
    
      useEffect(() => { // Fetch $ spent of Budgets
        fetch(`http://localhost:5050/budgets-with-spent/${userId}`)
          .then((res) => res.json())
          .then((data) => setBudgets(data))
          .catch((err) => console.error('Error fetching budgets:', err));
      }, [userId]);

      useEffect(() => {
        fetch(`http://localhost:5050/transactions/${userId}`)
          .then(res => res.json())
          .then(data => {
            console.log("Fetched transactions:", data); // 👈 What does this show?
            setTransactions(data);
          })
          .catch(err => console.error('Error fetching transactions:', err));
      }, [userId]);
      


    return (
        <div className="budgets">
            <div class='budgets-header'>
              <h1>Budgets</h1>
              <button className='add-budget' onClick={() => setShowModal(true)}>+ Add New Budget</button>

              {showModal && (
                <AddBudgetModal
                  userId={userId}
                  onClose={() => setShowModal(false)}
                  onBudgetCreated={fetchBudgets}
                  usedColors={usedColors}
                />
              )}
            </div>

            <div className='budgets-grid'>
                <div className='budget-chart'>
                    <DonutChart data={budgets} width={240} height={240} />
                </div>
                <div className="budgets-summary">
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
            </div>
      </div>
    );
}

export default Budgets;

// <DonutChart data={budgets} width={240} height={240} />