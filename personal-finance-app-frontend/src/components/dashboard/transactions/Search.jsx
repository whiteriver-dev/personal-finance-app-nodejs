import './Search.scss';
import React, { useState, useEffect, useRef } from 'react';
import SearchIcon from '../../reusable/small/Icons.jsx';

function Search({ placeholder, onSearch }) {
    const [isFocused, setIsFocused] = useState(false);
    const [isSmall, setIsSmall] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const containerRef = useRef(null);

    useEffect(() => {
        const observer = new ResizeObserver((entries) => {
          for (let entry of entries) {
            const width = entry.contentRect.width;
            setIsSmall(width < 150);
          }
        });
      
        const element = containerRef.current; 
      
        if (element) {
          observer.observe(element);
        }
      
        return () => {
          if (element) {
            observer.unobserve(element); 
          }
        };
      }, []);
      
      



      const handleChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        onSearch(value);
      };

    return (
        <div className='search-container'>
            <div className='input-wrapper-container'>
                <input
                    ref={containerRef}
                    type='text'
                    placeholder={isFocused 
                        ? "" 
                        : isSmall 
                          ? "Search tran..." 
                          : placeholder}
                    value={inputValue}
                    onChange={handleChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className='search-input'
                />
                <div className='icon-wrapper'>
                  <SearchIcon size={16} color="#201F24" />
                </div>
            </div>
        </div>
    );
 }

export default Search;