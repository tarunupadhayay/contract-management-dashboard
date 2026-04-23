import React, { useState, useEffect, useCallback } from 'react';
import { HiOutlineSearch, HiX } from 'react-icons/hi';
import './SearchBar.css';

const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => {
  const [localValue, setLocalValue] = useState(value || '');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [localValue]);

  // Sync external value changes
  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className="search-bar" id="search-bar">
      <HiOutlineSearch className="search-icon" size={18} />
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        id="search-input"
      />
      {localValue && (
        <button className="search-clear" onClick={handleClear} id="search-clear-btn">
          <HiX size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
