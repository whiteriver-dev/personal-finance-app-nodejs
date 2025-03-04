import './ButtonPrimary.scss';
import React from 'react';

function ButtonPrimary({ text, onClick, className }) {
    return (
        <button className={`button-primary ${className}`} onClick={onClick}>
            {text}
        </button>
    );
}

export default ButtonPrimary;