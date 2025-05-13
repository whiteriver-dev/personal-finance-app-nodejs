import './Dashboard.scss';
import React, {/*useEffect,*/ useState} from 'react';
// import { useNavigate } from 'react-router-dom';

import MobileNavbar from '../navigation/MobileNavbar';
import Sidebar from '../navigation/Sidebar';
import Overview from '../dashboard/Overview';
import Transactions from '../dashboard/Transactions';   
import Budgets from '../dashboard/Budgets';
import Pots from '../dashboard/Pots';

function Dashboard() {

    const [activeSection, setActiveSection] = useState('overview');


    const userId = 13;


 /*   const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [token, setToken] = useState(''); 
    const navigate = useNavigate(); */

    const renderContent = () => {
        switch(activeSection) {
            case 'overview':
                return <Overview />;
            case 'transactions':
                return <Transactions userId={userId}/>;
            case 'budgets':
                return <Budgets userId={userId}/>;
            case 'pots':
                return <Pots userId={userId}/>;
            default:
                return <Overview />;
        }
    }

 /*   useEffect(() => { 
        const token = localStorage.getItem('token');
        const name = localStorage.getItem('name');
        const email = localStorage.getItem('email');

        if (!token) {
            navigate('/login');
        }

        setName(name);
        setEmail(email);   
        setToken(token);

    }, [navigate]); */


    
    return (
        <div className="dashboard">
            <MobileNavbar activeSection={activeSection} setActiveSection={setActiveSection} />
            <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
            <div className='dashboard__content'>{renderContent()}</div>
        </div>
    );
}

export default Dashboard;