import './AuthTemplate.scss';
import React from 'react';
import Login from './Login';
import Register from './Register';
import { useLocation } from 'react-router-dom';

function AuthTemplate() {
    const location = useLocation();

    const isLoginPage = location.pathname === '/login';

    return (
        <div className="auth-template">
            <div className="auth-template__container">
                <div className="mobile-banner">
                    <img src='/assets/images/logo-large.svg' alt='Logo' />
                </div>
                <div className="auth-template__left">
                    <img src='/assets/images/illustration-authentication.svg' alt='Authentication' />
                    <img src='/assets/images/logo-large.svg' className='overlay-logo' alt='Logo' />
                    <div className='overlay-text'>
                        <h1> Keep track of your money and save for your future</h1>
                        <p>Personal finance app puts you in control of your spending. Track transactions, set budgets, and add to savings pot easily.</p>
                    </div>
                </div>
                <div className="auth-template__right">
                    {isLoginPage ? <Login /> : <Register />}
                </div>
            </div>
        </div>
    )
}

export default AuthTemplate;