import React, { useState } from 'react';
import './Login.scss';
import ButtonPrimary from '../reusable/small/ButtonPrimary';
import { PulseLoader } from 'react-spinners';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../../utils/api'; 

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({}); // Error object for form validation
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };
    
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors({}); // Clear the errors
        setIsLoading(true); 

        const validationErrors = {};

        if (!email) { 
            validationErrors.email = 'Email is required';
        } else if (!validateEmail(email)) {
            validationErrors.email = 'Email is invalid';
        }

        if (!password) {  
            validationErrors.password = 'Password is required';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsLoading(false);
            return;
        }

        setErrors({}); // Clear the errors
        setIsLoading(false);

        // Login request to backend

        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })

        const data = await response.json();

        setIsLoading(false);

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('name', data.name);
            localStorage.setItem('email', data.email);
            localStorage.setItem('userId', data.userId);
            navigate('/dashboard');
        } else {
            setErrors({ backend: data.message });
        }

    }

    return (
        <div className="login">
            <div className="login__container">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}> 
                    <label htmlFor='email-input'>Email{errors.email && <span className='error'>{errors.email}</span>}</label>
                    <input
                    className={`email-input ${errors.email ? 'error' : ''}`}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor='password-input'>Password{errors.password && <span className='error'>{errors.password}</span>}</label>
                    <input
                    className={`password-input ${errors.password ? 'error' : ''}`}
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
                                'Login'
                            )
                        } 
                        type="submit"
                        disabled={isLoading}/>
                </form>
                <p>Need to create an account? <Link to="/register" className='register-link'>Register</Link></p>
            </div>
        </div>
    );
}



export default Login;

// Pre-deployment code check DONE

