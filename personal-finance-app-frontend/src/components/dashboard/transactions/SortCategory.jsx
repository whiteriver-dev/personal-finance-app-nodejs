import './SortCategory.scss';
import React, { useState, useEffect, useRef } from 'react';

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
                    <svg
                        fill="#201F24" 
                        height="20" 
                        viewBox="0 0 20 20" 
                        preserveAspectRatio="xMidYMid meet"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="m16.7976 2.71562-.0062.00704-5.2914 5.65v4.33514c.0003.2062-.0504.4092-.1476.5911-.0972.1818-.2379.3368-.4095.4511l-2.49995 1.6672c-.1884.1255-.40734.1975-.63344.2082-.22611.0108-.45091-.04-.65039-.147s-.36616-.2662-.48225-.4605-.17723-.4165-.17689-.6429v-6.00234l-5.29141-5.65-.00625-.00704c-.16269-.17905-.269938-.40146-.308716-.64026s-.007425-.48373.090256-.70506c.09768-.22133.25749-.409563.46005-.541857.20255-.132294.43914-.202966.68107-.203443h13.75002c.2421.000024.479.070368.6819.202485.2029.132118.3631.320325.4611.541745.0979.22142.1295.46653.0908.70555-.0387.23901-.146.46165-.3088.64084z"/>
                    </svg>
                </span>
            </button>
            <div className='sortcategory__desktop'>
                <label>Category</label>
                <div className='sortcategory__dropdown' onClick={() => setIsOpen(!isOpen)}>
                <span>{selectedOption}</span>
                    <span class='sortcategory__icon'>
                        <svg
                            className={`sortcategory__icon ${isOpen ? 'rotated' : ''}`}
                            fill="#201F24" 
                            height="6"
                            width="11"
                            viewBox="0 0 11 06" 
                            preserveAspectRatio="xMidYMid meet"
                            xmlns="http://www.w3.org/2000/svg">
                           <path d="m11.3538.85375-5.00002 5c-.04644.04649-.10158.08337-.16228.10853s-.12576.03811-.19147.03811-.13077-.01295-.19147-.03811-.11585-.06204-.16228-.10853l-5.000002-5c-.070006-.069927-.11769-.159054-.137015-.256096-.019325-.097043-.009423-.197638.028453-.289049.037877-.091412.102024-.16953.18432-.224465.082297-.0549354.179044-.08421771.277994-.08413985h9.99997c.099-.00007786.1957.02920445.278.08413985.0823.054935.1465.133053.1843.224465.0379.091411.0478.192006.0285.289049-.0193.097042-.067.186169-.137.256096z" fill="#201f24"/>
                        </svg>
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