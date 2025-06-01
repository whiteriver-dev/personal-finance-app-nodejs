import './Budgets.scss';
import React, { useState, useEffect } from 'react';
import DonutChart from './budgets/DonutChart';
import BarSummary from './budgets/BarSummary';
import AddBudgetModal from './budgets/AddBudgetModal';
import EditBudgetModal from './budgets/EditBudgetModal';
import ButtonPrimary from '../reusable/small/ButtonPrimary';
import { API_URL } from '../../utils/api';


function Budgets({ userId }) {

    const [budgets, setBudgets] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [showAddModal, setAddShowModal] = useState(false);
    const [showEditModal, setEditModal] = useState(false);
    const [budgetToEdit, setBudgetToEdit] = useState(null);
    const usedColors = budgets.map(b => b.color_id);

    const fetchBudgets = async () => {
      const res = await fetch(`${API_URL}/budgets-with-spent/${userId}`);
      const data = await res.json();
      setBudgets(data);
    };
    
      useEffect(() => { // Fetch $ spent of Budgets
        fetch(`${API_URL}/budgets-with-spent/${userId}`)
          .then((res) => res.json())
          .then((data) => setBudgets(data))
          .catch((err) => console.error('Error fetching budgets:', err));
      }, [userId]);

      useEffect(() => {
        fetch(`${API_URL}/transactions/recent/${userId}`)
          .then(res => res.json())
          .then(data => {
            setTransactions(data);
          })
          .catch(err => console.error('Error fetching transactions:', err));
      }, [userId]);

      


    return (
        <div className="budgets">
            <div class='budgets-header'>
              <h1>Budgets</h1>
              <ButtonPrimary text="+ Add New Budget" onClick={() => setAddShowModal(true)} className='add-budget' />

              {showAddModal && (
                <AddBudgetModal
                  userId={userId}
                  onClose={() => setAddShowModal(false)}
                  onBudgetCreated={fetchBudgets}
                  usedColors={usedColors}
                />
              )}

              {showEditModal && (
                <EditBudgetModal
                  budget={budgetToEdit}
                  onClose={() => setEditModal(false)}
                  onBudgetUpdated={fetchBudgets}
                  usedColors={usedColors}
                />
              )}
            </div>

            <div className='budgets-grid'>
                <div className='budget-chart'>
                    <DonutChart data={budgets} width={240} height={240} />
                </div>
                <div className="budgets-summary">
                    {budgets.map((budget) => {
                    const budgetTransactions = transactions

                        .filter(tx => tx.category === budget.name)
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .slice(0, 3);
            
                    return (
                        <BarSummary
                          key={budget.id}
                          budgetId={budget.id}
                          name={budget.name}
                          spent={budget.spent}
                          amount={budget.amount}
                          color={budget.color}
                          transactions={budgetTransactions}
                          onBudgetUpdated={fetchBudgets}
                          onEdit={() => {
                              setBudgetToEdit(budget);
                              setEditModal(true);
                          }}
                        />
                        
                    );
                    })}
                </div>
            </div>
      </div>
    );
}

export default Budgets;


// Pre-deployment code check DONE