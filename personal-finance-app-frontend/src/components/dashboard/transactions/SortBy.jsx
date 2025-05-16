import './SortBy.scss';
import React, { useState, useEffect, useRef } from 'react';
import { CaretDownIcon, SortIcon } from '../../reusable/small/Icons';

function SortBy( { onSortChange, selectedOption }) {

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const options = [
        { value: "latest", label: "Latest" },
        { value: "oldest", label: "Oldest" },
        { value: "a-z", label: "A-Z" },
        { value: "z-a", label: "Z-A" },
        { value: "highest", label: "Highest" },
        { value: "lowest", label: "Lowest" },
    ]

    const handleSelection = (value) => {
        setIsOpen(false);
        onSortChange(value);
        console.log("selectedOption:", selectedOption);
        console.log("options:", options);
    }

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
        <div className='sortby' ref={dropdownRef}>
            <button className='sortby__mobile' onClick={() => setIsOpen(!isOpen)}>
                <span class='sortby__icon'>
                    <SortIcon size={20} color="#201F24" />
                </span>
            </button>
            <div className='sortby__desktop'>
                <label>Sort by</label>
                <div className='sortby__dropdown' onClick={() => setIsOpen(!isOpen)}>
                <span>{options.find((opt) => opt.value == selectedOption)?.label}</span>
                    <span className={`sortby__icon ${isOpen ? 'rotated' : ''}`}>
                        <CaretDownIcon size={6} color="#201F24"/>
                    </span>
                </div>
            </div>
            {isOpen && (
            <ul className="sortby__options">
                {options.map((option) => (
                    <li key={option.value} 
                        className={option.value === selectedOption ? 'selected' : ''}
                        onClick={() => handleSelection(option.value)}
                        >
                        {option.label}
                    </li>
                ))}
                </ul>
        )}
        </div>
    );
}

export default SortBy;