import './Dashboard.scss';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import MobileNavbar from '../navigation/MobileNavbar';
import Sidebar from '../navigation/Sidebar';
import Overview from '../dashboard/Overview';
import Transactions from '../dashboard/Transactions';   
import Budgets from '../dashboard/Budgets';
import Pots from '../dashboard/Pots';

function Dashboard() {


    // Application state
    const [activeSection, setActiveSection] = useState('overview');
  /*  const [name, setName] = useState('');
    const [email, setEmail] = useState('');*/
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate(); 

    /**
     * Fetch user data from local storage and set to state.
     * Redirects to login if no token is found.
     */
    useEffect(() => { 
        const token = localStorage.getItem('token');
   /*     const name = localStorage.getItem('name');
        const email = localStorage.getItem('email'); */
        const storedUserId = localStorage.getItem('userId');

        if (!token) {
            navigate('/login');
        } else {
       /*     setName(name);
            setEmail(email);   
            setToken(token); */
            setUserId(storedUserId);
        }
    }, [navigate]); 


    /**
     * Renders the correct section based on the activeSection state.
     */
    const renderContent = () => {
        if (!userId) {
            return <div>Loading...</div>;
        }
        switch(activeSection) {
            case 'overview':
                return <Overview userId={userId} setActiveSection={setActiveSection}/>;
            case 'transactions':
                return <Transactions userId={userId}/>;
            case 'budgets':
                return <Budgets userId={userId}/>;
            case 'pots':
                return <Pots userId={userId}/>;
            default:
                return <Overview userId={userId} setActiveSection={setActiveSection}/>;
        }
    };

    return (
        <div className="dashboard">
            <MobileNavbar activeSection={activeSection} setActiveSection={setActiveSection} />
            <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
            <div className='dashboard__content'>{renderContent()}</div>
        </div>
    );
}

export default Dashboard;
