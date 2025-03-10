import './NavButton.scss';
import React from 'react';
import PropTypes from 'prop-types';

function NavButton({text, icon, onClick, isActive}) {
    return (
        <button
            className={`nav-button ${isActive ? 'active' : ''}`}
            onClick={onClick}
        >
            {icon && <span className="nav-button__icon">{icon}</span>}
            <span className="nav-button__text">{text}</span>
        </button>
    );
}

NavButton.propTypes = {
    text: PropTypes.string.isRequired,
    icon: PropTypes.node,
    onClick: PropTypes.func,
    isActive: PropTypes.bool
}


export default NavButton;