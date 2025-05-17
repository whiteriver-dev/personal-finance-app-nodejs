import React, { useState, useRef, useEffect } from 'react';
import './OptionsDropdown.scss';
import { EllipsisIcon } from '../small/Icons';

function OptionsDropdown({ options }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='options__container' ref={dropdownRef}>
      <button 
        className='options__toggle' 
        onClick={() => setIsDropdownOpen((prev) => !prev)}
      >
        <EllipsisIcon size={4} color='#B3B3B3' />
      </button>

      {isDropdownOpen && (
        <div className='options__dropdown'>
          {options.map((option, index) => {
            const isDelete = option.label.toLowerCase().includes('delete');
            return (
              <button 
                key={index} 
                className={`options__item ${isDelete ? 'options__delete' : ''}`} 
                onClick={() => {
                  option.action();
                  setIsDropdownOpen(false);
                }}
                data-action-type={isDelete ? 'delete' : 'action'}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default OptionsDropdown;


// Pre-deployment code check DONE