import './SortCategory.scss';
import React, { useState, useEffect, useRef } from 'react';
import { CaretDownIcon, FilterIcon } from '../../reusable/small/Icons';

function SortCategory( { budgets, onSortChange }) {

    const [selectedOption, setSelectedOption] = useState('All Transactions');
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);



    const handleSelection = (budgetName) => {
        setSelectedOption(budgetName);
        setIsOpen(false);
        onSortChange(budgetName); // pass selected budget up
      };

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
          }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }, []);

    return (
        <div className='sortcategory' ref={dropdownRef}>
            <button className='sortcategory__mobile' onClick={() => setIsOpen(!isOpen)}>
                <span class='sortcategory__icon'>
                    <FilterIcon size={20} color="#201F24" />
                </span>
            </button>
            <div className='sortcategory__desktop'>
                <label>Category</label>
                <div className='sortcategory__dropdown' onClick={() => setIsOpen(!isOpen)}>
                <span>{selectedOption}</span>
                    <span class={`sortcategory__icon ${isOpen ? 'rotated' : ''}`}>
                        <CaretDownIcon size={6} color="#201F24"/>
                    </span>
                </div>
            </div>
            {isOpen && (
                <ul className="sortcategory__options">
                <li
                    key="all"
                    className={selectedOption === 'All Transactions' ? 'selected' : ''}
                    onClick={() => handleSelection('All Transactions')}
                >
                    All Transactions
                </li>

                {budgets.map((budget) => (
                    <li
                    key={budget.id}
                    className={budget.name === selectedOption ? 'selected' : ''}
                    onClick={() => handleSelection(budget.name)}
                    >
                    {budget.name}
                    </li>
                ))}
                </ul>
            )}
        </div>
    );
}

export default SortCategory;