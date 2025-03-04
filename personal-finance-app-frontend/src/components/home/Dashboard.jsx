import './Dashboard.scss';
import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    useEffect(() => { 
        const token = localStorage.getItem('token');
        const name = localStorage.getItem('name');
        const email = localStorage.getItem('email');

        if (!token) {
            navigate('/login');
        }

        setName(name);
        setEmail(email);   
        setToken(token);

    }, []);


    
    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            <p>Welcome to your dashboard, {name}</p>
            <p>Email: {email}</p>
            <p>Token: {token}</p>
        </div>
    );
}

export default Dashboard;