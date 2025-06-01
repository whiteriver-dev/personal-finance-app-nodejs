import React, { useState } from 'react';
import './Register.scss';
import ButtonPrimary from '../reusable/small/ButtonPrimary';
import { PulseLoader } from 'react-spinners';
import { useNavigate, Link } from 'react-router-dom'; 
import { API_URL } from '../../utils/api';


function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Ensures email format
        return emailRegex.test(email);
    }

    const validateName = (name) => {
        const nameRegex = /^[A-Za-z\s]+$/; // Allows only letters and spaces
        return nameRegex.test(name);
    };

   const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Frontend form validation

        const validationErrors = {};

        if (!name) {
            validationErrors.name = 'Name is required';
        } else if (!validateName(name)) {
            validationErrors.name = 'Name should contain letters only';
        }

        if (!password) {
            validationErrors.password = 'Password is required';
        } else if (password.length < 6) {
            validationErrors.password = 'Password should be at least 6 characters long';
        }

        if (!email) {
            validationErrors.email = 'Email is required';
        } else if (!validateEmail(email)) {   
            validationErrors.email = 'Email is invalid';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsLoading(false);
            return;
        }
    

        setErrors({}); // Clear the errors

        // Request to the backend

        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });

        setIsLoading(false);

        const data = await response.json();

        if (response.ok) {
            navigate('/login');
        }   else {
            setErrors({ backend: data.message });
        }


    };


    return (
        <div className="register">
            <div className="register__container">
                <h1>Sign Up</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor='name-input'>Name{errors.name && <span className='error'>{errors.name}</span>}</label>
                    <input
                     className={`name-input ${errors.name ? 'error' : ''}`}
                     type="text"
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                     />
                     
                    <label htmlFor='email-input'>Email{errors.email && <span className='error'>{errors.email}</span>}</label>
                    <input
                     className={`email-input ${errors.email ? 'error' : ''}`}
                     type="email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     />
                    <label htmlFor='createpassword-input'>Create Password{errors.password && <span className='error'>{errors.password}</span>}</label>
                    <input
                     className={`createpassword-input ${errors.password ? 'error' : ''}`}
                     type="password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     />

                    {errors.backend && <span className='backend-error'>{errors.backend}</span>}

                    <ButtonPrimary
                        text={
                            isLoading ? (
                            <PulseLoader color="white" size={6}/>
                            ) : (
                                'Register'
                            )
                        } 
                        disabled={isLoading}/>

                </form>
                <p>Already have an account? <Link to="/login" className='login-link'>Login</Link></p>
            </div>
        </div>
    );
}

export default Register;

// Pre-deployment code check DONE