import './Budgets.scss';
import React, { useState, useEffect } from 'react';
import DonutChart from './small/DonutChart';

function Budgets({ userId }) {

    const [budgets, setBudgets] = useState([]);

    useEffect(() => { // Fetch budgets
        fetch(`http://localhost:5000/budgets/${userId}`)
          .then((res) => res.json())
          .then((data) => setBudgets(data))
          .catch((err) => console.error('Error fetching budgets:', err));
      }, [userId]);

      useEffect(() => { // Fetch $ spent of Budgets
        fetch(`http://localhost:5000/budgets-with-spent/${userId}`)
          .then((res) => res.json())
          .then((data) => setBudgets(data))
          .catch((err) => console.error('Error fetching budgets:', err));
      }, [userId]);
      


    return (
        <div className="budgets">
            <h1>Budgets</h1>

            <DonutChart data={budgets} width={240} height={240} />
        </div>
    );
}

export default Budgets;